import Stripe from 'stripe';
import admin from 'firebase-admin';
import { initSentryBackend, captureBackendError, flushSentry } from './_utils/sentry.js';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
  }
}

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  initSentryBackend();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    captureBackendError(err, { context: 'stripe-webhook', step: 'signature-verification' });
    await flushSentry();
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    captureBackendError(error, { 
      context: 'stripe-webhook', 
      eventType: event?.type,
      step: 'event-handling' 
    });
    await flushSentry();
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// ============================================
// Webhook Handlers
// ============================================

async function handleCheckoutComplete(session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan || 'free';
  
  if (!userId) {
    console.error('❌ No userId in checkout session');
    return;
  }

  const subscriptionId = session.subscription;
  const customerId = session.customer;

  console.log(`💳 Processing checkout for user ${userId}, plan: ${plan}`);

  // Fetch subscription to get full details
  if (subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await updateUserSubscription(userId, subscription);
      console.log(`✅ Checkout complete for user ${userId}`);
    } catch (error) {
      console.error('❌ Failed to fetch subscription:', error.message);
      // Fallback: still update customer ID
      await db.collection('users').doc(userId).set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan: plan,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }
  }
}

async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    // Try to find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', subscription.customer)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.error('No user found for subscription:', subscription.id);
      return;
    }
    
    const userDoc = usersSnapshot.docs[0];
    await updateUserSubscription(userDoc.id, subscription);
    return;
  }

  await updateUserSubscription(userId, subscription);
}

async function updateUserSubscription(userId, subscription) {
  // Determine plan from metadata or price
  let plan = subscription.metadata?.plan || 'free';
  
  // Fallback: check price ID if no metadata
  if (plan === 'free') {
    const priceId = subscription.items.data[0]?.price?.id;
    const amount = subscription.items.data[0]?.price?.unit_amount;
    
    console.log(`🔍 Price ID: ${priceId}, Amount: ${amount}`);
    
    // Detect by amount (in cents)
    if (amount === 499) {
      plan = 'pro'; // $4.99
    } else if (amount === 999) {
      plan = 'unlimited'; // $9.99
    } else if (priceId?.includes('eID')) {
      plan = 'pro';
    } else {
      plan = 'unlimited';
    }
  }

  // Map Stripe status to our status
  const statusMap = {
    'active': 'active',
    'trialing': 'trialing',
    'past_due': 'past_due',
    'canceled': 'canceled',
    'unpaid': 'past_due',
    'incomplete': 'incomplete',
    'incomplete_expired': 'canceled',
  };

  const status = statusMap[subscription.status] || 'active';

  // Update user document
  const updateData = {
    plan: plan,
    status: status,
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    currentPeriodStart: admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_start * 1000)),
    currentPeriodEnd: admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Set credits based on plan
  if (plan === 'pro') {
    updateData.credits = {
      monthlyCredits: 100,
      monthlyCreditsUsed: 0,
      lastMonthlyReset: admin.firestore.FieldValue.serverTimestamp(),
    };
    // Also set aiCredits for compatibility
    updateData.aiCredits = 100;
  } else if (plan === 'unlimited') {
    updateData.credits = {
      unlimited: true,
      lastUnlimitedReset: admin.firestore.FieldValue.serverTimestamp(),
    };
    updateData.aiCredits = 999999; // Large number for unlimited
  }

  await db.collection('users').doc(userId).set(updateData, { merge: true });
  
  console.log(`✅ User ${userId} updated: ${plan} (${status})`);

  // Create/update subscriptions collection for admin dashboard
  try {
    // Get user email from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const userEmail = userData?.email || subscription.metadata?.userEmail || null;
    
    await db.collection('subscriptions').doc(subscription.id).set({
      userId: userId,
      userEmail: userEmail,
      plan: plan,
      status: status,
      amount: subscription.items.data[0]?.price?.unit_amount ? 
              subscription.items.data[0].price.unit_amount / 100 : 
              (plan === 'unlimited' ? 9.99 : 4.99),
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_start * 1000)),
      currentPeriodEnd: admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
      createdAt: admin.firestore.Timestamp.fromDate(new Date(subscription.created * 1000)),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log(`✅ Subscription document created: ${subscription.id}`);
  } catch (error) {
    console.error('❌ Failed to create subscription document:', error.message);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    const usersSnapshot = await db.collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();
    
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await downgradeToFree(userDoc.id);
    }
    return;
  }

  await downgradeToFree(userId);
}

async function downgradeToFree(userId) {
  await db.collection('users').doc(userId).set({
    plan: 'free',
    status: 'active',
    stripeSubscriptionId: admin.firestore.FieldValue.delete(),
    currentPeriodStart: admin.firestore.FieldValue.delete(),
    currentPeriodEnd: admin.firestore.FieldValue.delete(),
    cancelAtPeriodEnd: false,
    aiCredits: 5,
    credits: {
      dailyCredits: 5,
      dailyCreditsUsed: 0,
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`✅ User ${userId} downgraded to free`);
}

async function handlePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) return;

  // Find user by subscription ID
  const usersSnapshot = await db.collection('users')
    .where('stripeSubscriptionId', '==', subscriptionId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) return;

  const userDoc = usersSnapshot.docs[0];
  
  // Reset monthly credits on successful payment
  const userData = userDoc.data();
  if (userData.plan === 'pro') {
    await db.collection('users').doc(userDoc.id).set({
      credits: {
        monthlyCredits: 100,
        monthlyCreditsUsed: 0,
        lastMonthlyReset: admin.firestore.FieldValue.serverTimestamp(),
      },
      aiCredits: 100,
      status: 'active',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  console.log(`✅ Payment succeeded for user ${userDoc.id}`);
}

async function handlePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) return;

  const usersSnapshot = await db.collection('users')
    .where('stripeSubscriptionId', '==', subscriptionId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) return;

  const userDoc = usersSnapshot.docs[0];
  
  await db.collection('users').doc(userDoc.id).set({
    status: 'past_due',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`⚠️ Payment failed for user ${userDoc.id}`);
}

import Stripe from 'stripe';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { initSentryBackend, captureBackendError, flushSentry } from './_utils/sentry.js';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
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
  const userId = session.client_reference_id || session.metadata?.userId;
  
  if (!userId) {
    console.error('No userId found in checkout session');
    return;
  }

  const subscriptionId = session.subscription;
  const customerId = session.customer;

  // Update user document with Stripe IDs
  await db.collection('users').doc(userId).set({
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    updatedAt: new Date(),
  }, { merge: true });

  console.log(`Checkout complete for user ${userId}`);
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
  // Determine plan from price
  const priceId = subscription.items.data[0]?.price?.id;
  let plan = 'free';
  
  // Map Stripe price IDs to plans
  // You'll need to update these with your actual Stripe price IDs
  if (priceId === process.env.STRIPE_PRO_PRICE_ID || priceId?.includes('pro')) {
    plan = 'pro';
  } else if (priceId === process.env.STRIPE_UNLIMITED_PRICE_ID || priceId?.includes('unlimited')) {
    plan = 'unlimited';
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
    stripeSubscriptionId: subscription.id,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  };

  // Set credits based on plan
  if (plan === 'pro') {
    updateData['credits.monthlyCredits'] = 100;
    updateData['credits.monthlyCreditsUsed'] = 0;
    updateData['credits.lastMonthlyReset'] = new Date();
  } else if (plan === 'unlimited') {
    updateData['credits.dailyUnlimitedUsed'] = 0;
    updateData['credits.lastUnlimitedReset'] = new Date();
  }

  await db.collection('users').doc(userId).set(updateData, { merge: true });

  // Also create/update subscriptions collection for admin dashboard
  try {
    await db.collection('subscriptions').doc(subscription.id).set({
      userId: userId,
      userEmail: subscription.metadata?.userEmail || null,
      plan: plan,
      status: status,
      amount: subscription.items.data[0]?.price?.unit_amount ? 
              subscription.items.data[0].price.unit_amount / 100 : 
              (plan === 'unlimited' ? 9.99 : 4.99),
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      createdAt: new Date(subscription.created * 1000),
      updatedAt: new Date()
    }, { merge: true });
    
    console.log(`Subscription document created: ${subscription.id}`);
  } catch (error) {
    console.error('Failed to create subscription document:', error);
  }

  console.log(`Subscription updated for user ${userId}: ${plan} (${status})`);
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
    stripeSubscriptionId: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    'credits.dailyCredits': 5,
    'credits.dailyCreditsUsed': 0,
    updatedAt: new Date(),
  }, { merge: true });

  console.log(`User ${userId} downgraded to free`);
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
      'credits.monthlyCreditsUsed': 0,
      'credits.lastMonthlyReset': new Date(),
      status: 'active',
      updatedAt: new Date(),
    }, { merge: true });
  }

  console.log(`Payment succeeded for user ${userDoc.id}`);
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
    updatedAt: new Date(),
  }, { merge: true });

  console.log(`Payment failed for user ${userDoc.id}`);
}

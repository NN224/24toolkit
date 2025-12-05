import Stripe from 'stripe';
import { initSentryBackend, captureBackendError, flushSentry } from './_utils/sentry.js';

export default async function handler(req, res) {
  initSentryBackend();
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  // Log key prefix for debugging (safe - only first 10 chars)
  console.log('Stripe key prefix:', process.env.STRIPE_SECRET_KEY.substring(0, 10));

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Parse body if needed
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { priceId, userId, userEmail, successUrl, cancelUrl } = body;

    console.log('Creating checkout for:', { priceId, userId, userEmail });

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine plan from price ID
    const isPro = priceId.includes('eID'); // Pro price ID contains 'eID'
    const plan = isPro ? 'pro' : 'unlimited';
    
    console.log(`Creating checkout: Plan=${plan}, PriceID=${priceId}`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.SITE_URL || process.env.VERCEL_URL || 'https://24toolkit.com'}/settings?success=true`,
      cancel_url: cancelUrl || `${process.env.SITE_URL || process.env.VERCEL_URL || 'https://24toolkit.com'}/pricing?canceled=true`,
      customer_email: userEmail || undefined,
      metadata: {
        userId: userId,
        userEmail: userEmail || '',
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          userEmail: userEmail || '',
          plan: plan,
        },
      },
      allow_promotion_codes: true,
    });
    
    console.log(`✅ Checkout session created: ${session.id}`);

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Checkout error:', error.message, error.stack);
    captureBackendError(error, { 
      context: 'checkout-session',
      priceId: body?.priceId,
      userId: body?.userId 
    });
    await flushSentry();
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}

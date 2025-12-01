import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
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

  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = req.body;

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine plan details for custom display
    const isPro = priceId.includes('eID'); // Pro price ID contains 'eID'
    const planName = isPro ? 'Pro Plan' : 'Unlimited Plan';
    const planDescription = isPro 
      ? '100 AI requests/month • No ads • Smart History'
      : 'Unlimited AI • Priority Support • Early Access';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || 'https://24toolkit.com/settings?success=true',
      cancel_url: cancelUrl || 'https://24toolkit.com/pricing?canceled=true',
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        plan: isPro ? 'pro' : 'unlimited',
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: isPro ? 'pro' : 'unlimited',
        },
      },
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: `🚀 Unlock ${planName} - ${planDescription}`,
        },
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}

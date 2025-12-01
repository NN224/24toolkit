import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { priceId, userId, userEmail, successUrl, cancelUrl } = body;

    if (!priceId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine plan details for custom display
    const isPro = priceId.includes('pro');
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
      // Custom product display with image
      line_item_overrides: undefined, // Use price's default
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL || 'https://24toolkit.com'}/settings?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL || 'https://24toolkit.com'}/pricing?canceled=true`,
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
      // Branding customization
      custom_text: {
        submit: {
          message: `🚀 Unlock ${planName} - ${planDescription}`,
        },
        terms_of_service_acceptance: {
          message: 'I agree to the [Terms of Service](https://24toolkit.com/terms-of-service)',
        },
      },
      consent_collection: {
        terms_of_service: 'required',
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

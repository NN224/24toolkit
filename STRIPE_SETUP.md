# Stripe Subscription Setup Guide

## Overview

This guide explains how to set up the Stripe subscription system for 24Toolkit.

## Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 AI requests/day, ads shown |
| **Pro** | $4.99/mo | 100 AI requests/month, no ads |
| **Unlimited** | $9.99/mo | Unlimited AI (50/day fair use), no ads, priority |

## Step 1: Create Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Click **+ Add Product**

### Pro Plan Product:
- **Name**: 24Toolkit Pro
- **Description**: 100 AI requests per month, ad-free experience, Smart History
- **Image**: Upload a professional product image (recommended: 512x512px)
  - 💡 **Tip**: Create an eye-catching image with:
    - Purple/gradient background (#7c3aed → #0ea5e9)
    - "PRO" text with lightning bolt icon
    - 24Toolkit logo
- **Pricing**: $4.99/month (recurring)
- Copy the **Price ID** (starts with `price_`)

### Unlimited Plan Product:
- **Name**: 24Toolkit Unlimited  
- **Description**: Unlimited AI access, priority support, early access to new features
- **Image**: Upload a premium product image
  - 💡 **Tip**: Make it look premium:
    - Gold/purple gradient background
    - Crown icon with "UNLIMITED" text
    - "∞" infinity symbol
- **Pricing**: $9.99/month (recurring)
- Copy the **Price ID** (starts with `price_`)

### Product Image Recommendations:
```
📐 Size: 512x512px or 1024x1024px (square)
🎨 Format: PNG with transparency or JPG
💜 Colors: Match your brand (purple #7c3aed, sky #0ea5e9)
✨ Style: Modern, clean, professional
```

**Example image ideas:**
- Pro: Lightning bolt + "PRO" badge on gradient
- Unlimited: Crown + "∞" symbol on premium gradient

## Step 2: Set Up Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add Endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/stripe-webhook`
4. **Events to listen**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** (starts with `whsec_`)

## Step 3: Environment Variables

Add these to your Vercel project (or `.env` for local):

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_...        # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (from Step 1)
STRIPE_PRO_PRICE_ID=price_...
STRIPE_UNLIMITED_PRICE_ID=price_...

# Firebase Admin SDK (for webhook to update Firestore)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Getting Firebase Admin Credentials:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Copy values from the downloaded JSON

## Step 4: Update Price IDs in Code

Update the price IDs in `src/lib/subscription.ts`:

```typescript
export const PLAN_LIMITS = {
  pro: {
    priceId: 'price_YOUR_PRO_PRICE_ID',  // Replace with actual
    // ...
  },
  unlimited: {
    priceId: 'price_YOUR_UNLIMITED_PRICE_ID',  // Replace with actual
    // ...
  }
}
```

## Step 5: Customer Portal Setup

1. Go to [Stripe Customer Portal Settings](https://dashboard.stripe.com/test/settings/billing/portal)
2. Enable:
   - ✅ Invoice history
   - ✅ Customer information
   - ✅ Payment method updates
   - ✅ Subscription cancellation
   - ✅ Subscription pausing (optional)

## Step 6: Test the Flow

### Test Mode:
1. Use Stripe test API keys (start with `sk_test_`)
2. Use test card: `4242 4242 4242 4242` (any future date, any CVC)

### Test Flow:
1. Sign in to 24Toolkit
2. Click "Upgrade" or go to `/pricing`
3. Select Pro or Unlimited
4. Complete Stripe Checkout with test card
5. Verify subscription updated in Firebase
6. Check credits in UI

## Firestore Data Structure

After subscription, user document will look like:

```json
{
  "plan": "pro",
  "status": "active",
  "stripeCustomerId": "cus_...",
  "stripeSubscriptionId": "sub_...",
  "currentPeriodStart": "2024-01-01T00:00:00Z",
  "currentPeriodEnd": "2024-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "credits": {
    "monthlyCredits": 100,
    "monthlyCreditsUsed": 0,
    "lastMonthlyReset": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Webhook not receiving events
- Check the webhook URL is correct
- Verify the webhook secret matches
- Check Vercel logs for errors

### Subscription not updating
- Verify Firebase Admin credentials
- Check Firestore rules allow server writes
- Look for errors in webhook logs

### Checkout not working
- Verify Stripe secret key
- Check price ID is correct
- Ensure user is authenticated

## Security Notes

- Never expose `STRIPE_SECRET_KEY` to client-side code
- Keep `STRIPE_WEBHOOK_SECRET` secure
- Firebase Admin credentials should only be on server

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/subscription.ts` | Subscription logic & plan limits |
| `src/contexts/SubscriptionContext.tsx` | React context for subscription state |
| `api/create-checkout-session.js` | Creates Stripe Checkout sessions |
| `api/stripe-webhook.js` | Handles Stripe webhook events |
| `api/customer-portal.js` | Customer portal session creation |
| `src/pages/PricingPage.tsx` | Pricing page UI |
| `src/components/SubscriptionModal.tsx` | Quick upgrade modal |

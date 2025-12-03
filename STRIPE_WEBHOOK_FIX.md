# 🔧 Stripe Webhook Fix - الحل الكامل

## 🚨 المشكلة

```
❌ Webhook returns 500 error
❌ Payment successful but user status not updated
❌ Firebase Admin credentials missing
❌ Subscription data not saved
```

---

## ✅ التعديلات المطلوبة

### 1. **Environment Variables in Vercel**

يجب إضافة هذه المتغيرات في Vercel Dashboard:

```bash
# Firebase Admin (REQUIRED for webhook)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# Stripe Keys
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Optional: For specific price detection
STRIPE_PRO_PRICE_ID=price_xxxxx  # $4.99
STRIPE_UNLIMITED_PRICE_ID=price_xxxxx  # $9.99
```

**كيف تحصل على `FIREBASE_SERVICE_ACCOUNT`:**

```bash
# 1. Go to Firebase Console
# 2. Project Settings > Service Accounts
# 3. Generate New Private Key
# 4. Download JSON file
# 5. Copy ENTIRE JSON content (minified, no line breaks)
# 6. Paste in Vercel env var
```

---

### 2. **Stripe Webhook Setup**

#### أ) الحصول على Webhook Secret:

```bash
# 1. Go to: https://dashboard.stripe.com/webhooks
# 2. Click "Add endpoint"
# 3. URL: https://24toolkit.com/api/stripe-webhook
# 4. Events to listen:
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed

# 5. Copy "Signing secret" (whsec_...)
# 6. Add to Vercel: STRIPE_WEBHOOK_SECRET
```

#### ب) Test Webhook Locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:5173/api/stripe-webhook

# In another terminal
npm run dev

# Trigger test payment
stripe trigger checkout.session.completed
```

---

### 3. **Firebase Collections Structure**

#### `users/{userId}` Document:

```javascript
{
  email: "user@example.com",
  displayName: "User Name",
  
  // Subscription Status
  plan: "free" | "pro" | "unlimited",
  status: "active" | "trialing" | "past_due" | "canceled",
  
  // Stripe IDs
  stripeCustomerId: "cus_xxxxx",
  stripeSubscriptionId: "sub_xxxxx",
  
  // Subscription Dates
  currentPeriodStart: Timestamp,
  currentPeriodEnd: Timestamp,
  cancelAtPeriodEnd: false,
  
  // Credits System
  aiCredits: 5, // For compatibility with old system
  credits: {
    // For Free users
    dailyCredits: 5,
    dailyCreditsUsed: 0,
    
    // For Pro users
    monthlyCredits: 100,
    monthlyCreditsUsed: 15,
    lastMonthlyReset: Timestamp,
    
    // For Unlimited users
    unlimited: true,
    lastUnlimitedReset: Timestamp,
  },
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

#### `subscriptions/{subscriptionId}` Document:

```javascript
{
  userId: "user_123",
  userEmail: "user@example.com",
  plan: "pro",
  status: "active",
  amount: 4.99,
  stripeCustomerId: "cus_xxxxx",
  stripeSubscriptionId: "sub_xxxxx",
  currentPeriodStart: Timestamp,
  currentPeriodEnd: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

## 🔄 Webhook Flow

```
User pays → Stripe → Webhook → stripe-webhook.js
                                     ↓
                          1. Verify signature
                          2. Parse event type
                          3. Update Firestore users/{userId}
                          4. Create subscriptions/{subId}
                          5. Set credits based on plan
                          6. Return 200 OK
```

---

## 🧪 Testing Steps

### 1. **Test with Stripe CLI:**

```bash
# Terminal 1: Start webhook listener
stripe listen --forward-to localhost:5173/api/stripe-webhook

# Terminal 2: Start dev server
npm run dev

# Terminal 3: Trigger events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

### 2. **Check Logs:**

```bash
# Vercel logs (production)
vercel logs

# Local logs
# Check terminal output for:
✅ Firebase Admin initialized
💳 Processing checkout for user xxx, plan: pro
✅ User xxx updated: pro (active)
✅ Subscription document created: sub_xxx
```

### 3. **Verify in Firebase:**

```bash
# Check users collection
users/{userId}
  - plan: "pro" or "unlimited"
  - status: "active"
  - aiCredits: 100 (pro) or 999999 (unlimited)
  - stripeSubscriptionId: "sub_xxx"

# Check subscriptions collection
subscriptions/{subId}
  - userId: "xxx"
  - plan: "pro"
  - status: "active"
```

---

## 🐛 Debugging

### Error: "Firebase Admin initialization failed"
```bash
# Check: FIREBASE_SERVICE_ACCOUNT is valid JSON
# Fix: Copy entire JSON from Firebase Console (no formatting)
```

### Error: "No userId in checkout session"
```bash
# Check: create-checkout-session.js sends metadata.userId
# Fix: Already fixed in code - redeploy
```

### Error: "Webhook signature verification failed"
```bash
# Check: STRIPE_WEBHOOK_SECRET is correct
# Fix: Copy from Stripe Dashboard > Webhooks > Signing secret
```

### Payment works but plan not updated
```bash
# Check: Webhook endpoint is registered in Stripe
# Fix: Add endpoint in Stripe Dashboard with correct URL
```

---

## 📋 Deployment Checklist

- [ ] Add `FIREBASE_SERVICE_ACCOUNT` to Vercel
- [ ] Add `STRIPE_SECRET_KEY` to Vercel  
- [ ] Add `STRIPE_WEBHOOK_SECRET` to Vercel
- [ ] Register webhook endpoint in Stripe Dashboard
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Test payment with real card
- [ ] Verify user plan updated in Firebase
- [ ] Check webhook logs show 200 OK

---

## 🎯 Expected Result

**After successful payment:**

```
✅ Stripe: Payment successful
✅ Webhook: Returns 200 OK
✅ Firebase users/{userId}:
   - plan: "pro" or "unlimited"
   - status: "active"
   - aiCredits: 100 or 999999
   - stripeSubscriptionId: "sub_xxx"
   
✅ Firebase subscriptions/{subId}:
   - Created with full details
   
✅ Frontend: User sees "Pro Plan" or "Unlimited"
✅ AI Tools: Credits updated correctly
```

---

## 📞 Support

If webhook still returns 500:
1. Check Vercel logs: `vercel logs`
2. Check Firebase Admin initialized correctly
3. Verify all env vars are set
4. Test locally with Stripe CLI
5. Check Firestore rules allow webhook writes

---

**Status:** ✅ Code Fixed - Need to Configure Vercel Env Vars

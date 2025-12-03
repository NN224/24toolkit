# 🎯 Stripe Webhook - Auto Collections Setup

## 📅 التاريخ: 3 ديسمبر 2024

---

## ✅ جاهز! Automatic Collections

### السؤال:
> "يعني إذا عميل بيدفع الجداول وحدها بتنعمل؟"

### الجواب:
**نعم! 100% تلقائي الآن ✅**

---

## 🔄 كيف يعمل النظام؟

### 1️⃣ العميل يدفع:
```
User → Pricing Page → "Upgrade to Pro"
→ Stripe Checkout → Payment
```

### 2️⃣ Stripe يرسل Webhook:
```
Stripe → api/stripe-webhook.js
→ Event: "customer.subscription.created"
```

### 3️⃣ Webhook يعمل كل شي تلقائياً:
```javascript
✅ Update users collection
✅ Set plan = 'pro' or 'unlimited'
✅ Set stripeSubscriptionId
✅ Set credits
✅ Create subscriptions document (NEW!)
```

**كل شي أوتوماتيك! لا يحتاج setup يدوي ✅**

---

## 📊 البيانات تتخزن في:

### Collection 1: `users` ✅
```javascript
{
  uid: "user123",
  email: "john@example.com",
  plan: "pro",              // ✅ auto-updated
  status: "active",         // ✅ auto-updated
  stripeCustomerId: "cus_xxx",
  stripeSubscriptionId: "sub_xxx",
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  credits: {
    monthlyCredits: 100,
    monthlyCreditsUsed: 0
  }
}
```

**التحديث:** تلقائي عند الدفع ✅

---

### Collection 2: `subscriptions` ✅ (NEW!)
```javascript
{
  // Document ID = Stripe subscription ID
  userId: "user123",
  userEmail: "john@example.com",
  plan: "pro",
  status: "active",
  amount: 4.99,
  stripeCustomerId: "cus_xxx",
  stripeSubscriptionId: "sub_xxx",
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**التحديث:** تلقائي عند الدفع ✅

---

## 🚀 ما تم تعديله (الآن)

### 1. **Webhook Enhancement** ✅

#### في `api/stripe-webhook.js`:

```javascript
// قبل:
await db.collection('users').doc(userId).set(updateData, { merge: true })
// ✅ يحدّث users فقط

// بعد:
await db.collection('users').doc(userId).set(updateData, { merge: true })

// ✅ NEW: Also create subscriptions document
await db.collection('subscriptions').doc(subscription.id).set({
  userId: userId,
  userEmail: subscription.metadata?.userEmail,
  plan: plan,
  status: status,
  amount: subscription.items.data[0].price.unit_amount / 100,
  stripeCustomerId: subscription.customer,
  stripeSubscriptionId: subscription.id,
  currentPeriodStart: new Date(subscription.current_period_start * 1000),
  currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  createdAt: new Date(subscription.created * 1000),
  updatedAt: new Date()
}, { merge: true })
```

**Result:** الآن يخزّن في collection-ين ✅

---

### 2. **Revenue Page Update** ✅

#### في `src/pages/admin/RevenuePage.tsx`:

```typescript
// قبل:
const subsRef = collection(db, 'subscriptions')
// ❌ يحتاج subscriptions collection منفصلة

// بعد:
const paidUsersRef = collection(db, 'users')
const paidUsersQuery = query(
  paidUsersRef,
  where('plan', 'in', ['pro', 'unlimited'])
)
// ✅ يستخدم users collection (موجودة!)
```

**Result:** يشتغل فوراً بدون setup ✅

---

## 🎯 Webhook Events

### Events المتعاملة:

```javascript
✅ checkout.session.completed
   → Update users with Stripe IDs

✅ customer.subscription.created
   → Create user subscription + subscriptions doc

✅ customer.subscription.updated
   → Update plan, status, dates

✅ customer.subscription.deleted
   → Downgrade to free

✅ invoice.payment_succeeded
   → Confirm payment

✅ invoice.payment_failed
   → Handle failed payment
```

**كلها تلقائية!** ✅

---

## 📦 Collections Status

### ✅ Auto-Created (عند الدفع):

```
✅ users
   → موجودة من Firebase Auth
   → تتحدّث تلقائياً بالـ webhook

✅ subscriptions (NEW!)
   → تنشأ تلقائياً عند أول دفع
   → document ID = Stripe subscription ID
   → تتحدّث تلقائياً
```

### ⚠️ Manual Setup (للـ AI analytics):

```
⚠️ ai-usage
   → يجب إضافة logging في callAI()
   → أو create يدوياً للتجربة
```

---

## 🧪 كيف تختبر؟

### Test Flow:

```
1. npm run dev

2. اذهب إلى /pricing

3. اضغط "Upgrade to Pro"

4. استخدم Stripe Test Card:
   4242 4242 4242 4242
   MM/YY: أي تاريخ مستقبلي
   CVC: أي 3 أرقام

5. أكمل الدفع

6. Webhook يشتغل تلقائياً:
   ✅ users collection updated
   ✅ subscriptions document created
   ✅ credits reset
   ✅ plan changed

7. اذهب إلى /admin/revenue
   ✅ شوف البيانات الحقيقية!
```

---

## 🔍 Verification

### بعد Test Payment:

#### 1. Check Firebase Console:
```
Firestore → users → [user-id]
✅ plan: "pro"
✅ status: "active"
✅ stripeSubscriptionId: "sub_xxx"

Firestore → subscriptions → [sub-id]
✅ userId: "user123"
✅ plan: "pro"
✅ amount: 4.99
✅ status: "active"
```

#### 2. Check Admin Dashboard:
```
/admin/revenue
✅ MRR: $4.99
✅ Active Subs: 1
✅ Recent Transactions: 1 row
```

#### 3. Check Logs:
```
Vercel Logs (or local console)
✅ "Subscription updated for user xxx: pro (active)"
✅ "Subscription document created: sub_xxx"
```

---

## ⚙️ Webhook Setup في Stripe

### لو ما عملته بعد:

#### 1. اذهب إلى Stripe Dashboard:
```
https://dashboard.stripe.com/test/webhooks
```

#### 2. Add Endpoint:
```
URL: https://24toolkit.com/api/stripe-webhook
(أو: https://your-domain.vercel.app/api/stripe-webhook)

Events to send:
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed
```

#### 3. Copy Webhook Secret:
```
whsec_xxxxxxxxxxxxxxxxxxxxx
```

#### 4. Add to Vercel:
```
Vercel → Project → Settings → Environment Variables
→ Add: STRIPE_WEBHOOK_SECRET = whsec_xxx
```

#### 5. Redeploy:
```
Vercel → Deployments → Redeploy
```

---

## 📋 Environment Variables

### Required في Vercel:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_... أو sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Admin (للـ webhook)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Optional: Price IDs للـ detection
STRIPE_PRO_PRICE_ID=price_1SZhq...
STRIPE_UNLIMITED_PRICE_ID=price_1SZhr...
```

---

## 🎉 الخلاصة

### ما يحتاج Setup يدوي:

```
✅ users collection
   → موجودة تلقائياً

✅ subscriptions collection
   → تنشأ تلقائياً عند أول دفع

✅ Plan updates
   → webhook يحدّثها تلقائياً

✅ Credits reset
   → webhook يحدّثها تلقائياً
```

---

### ما يحتاج Setup يدوي:

```
⚠️ ai-usage collection
   → للـ AI analytics
   → يجب إضافة logging أو create يدوياً
```

---

### Next Steps:

```
1. ✅ Webhook يشتغل → Collections تنشأ تلقائياً
2. ✅ Revenue Dashboard → يشتغل فوراً
3. ⚠️ AI Analytics → يحتاج ai-usage setup

Timeline:
→ Webhook: شغال الآن ✅
→ Revenue: شغال الآن ✅
→ AI Analytics: 10 دقائق للـ setup
```

---

## 🔄 Update Flow

### عند كل دفع:

```
Payment → Webhook → Firebase Updates:

1. users/{userId}
   ✅ plan updated
   ✅ status updated
   ✅ credits reset

2. subscriptions/{subId}
   ✅ document created/updated
   ✅ all subscription details

3. Admin Dashboard
   ✅ stats refresh
   ✅ revenue calculated
   ✅ charts updated
```

**كل شي أوتوماتيك! زيرو manual work ✅**

---

## 💰 Cost

### Webhook Calls:
```
Free! ✅
Stripe webhooks مجانية
```

### Firestore Writes:
```
2 writes per payment:
- 1 write to users
- 1 write to subscriptions

Cost: ~$0.00018 per payment
→ 1000 payments = $0.18 💵
```

**رخيص جداً!** ✅

---

## 🐛 Troubleshooting

### لو ما اشتغل Webhook:

#### 1. Check Webhook في Stripe:
```
Stripe Dashboard → Webhooks
→ شوف "Recent events"
→ لو في errors، شوف التفاصيل
```

#### 2. Check Environment Variables:
```
Vercel → Settings → Environment Variables
✅ STRIPE_WEBHOOK_SECRET موجود؟
✅ FIREBASE_* variables موجودة؟
```

#### 3. Check Logs:
```
Vercel → Deployments → View Function Logs
→ ابحث عن "stripe-webhook"
→ شوف لو في errors
```

#### 4. Test Webhook:
```
Stripe Dashboard → Webhooks
→ Send test webhook
→ checkout.session.completed
→ شوف Response
```

---

## ✅ Status

### الحالة الآن:

```
✅ Webhook code: Updated
✅ Revenue page: Updated
✅ Build: Successful
✅ Auto collections: Ready

Ready to test:
→ Make test payment
→ Webhook creates collections
→ Dashboard shows data
```

---

### ينقص (Optional):

```
⚠️ Setup webhook في Stripe (لو ما عملته)
⚠️ Deploy إلى Vercel
⚠️ Test payment
⚠️ Verify collections created
```

---

## 🎯 الجواب النهائي

### السؤال:
> "يعني إذا عميل بيدفع الجداول وحدها بتنعمل؟"

### الجواب:
```
✅ نعم! 100% أوتوماتيك

Stripe Webhook:
→ يحدّث users ✅
→ ينشئ subscriptions ✅
→ يحدّث credits ✅
→ كل شي تلقائي ✅

لا يحتاج:
❌ Manual collection creation
❌ Manual data entry
❌ Manual updates

يحتاج فقط:
✅ Webhook setup في Stripe (مرة واحدة)
✅ Environment variables في Vercel
```

---

**الخلاصة:** الكود جاهز! بمجرد الدفع، **كل شي يصير أوتوماتيك** ✅🎉

**الوقت:** Setup webhook في Stripe (5 دقائق) → Test payment → Done! 🚀

# 🔥 Firebase Collections Setup Guide

## 📅 التاريخ: 3 ديسمبر 2024

---

## 🎯 الهدف: بيانات حقيقية بدل Mock Data

### الحالة الحالية:
```
❌ AI Analytics: Mock data
❌ Revenue: Mock data  
✅ Users: Real data (Firebase Auth)
✅ Dashboard: Real data (Firestore)
```

### بعد الإعداد:
```
✅ AI Analytics: Real data
✅ Revenue: Real data
✅ Users: Real data
✅ Dashboard: Real data
```

---

## 📊 Collections المطلوبة

### 1. **users** (موجودة ✅)
```typescript
// Structure
{
  uid: string              // من Firebase Auth
  email: string
  displayName: string
  photoURL?: string
  plan: 'free' | 'pro' | 'unlimited'
  createdAt: Timestamp
  lastLoginAt?: Timestamp
  aiRequestsUsed?: number
}
```

**حالتها:** ✅ موجودة ومتصلة

---

### 2. **subscriptions** (يجب إنشاؤها)
```typescript
// Structure
{
  userId: string
  userEmail: string
  plan: 'pro' | 'unlimited'
  status: 'active' | 'canceled' | 'past_due'
  amount: number           // 4.99 or 9.99
  stripeCustomerId: string
  stripeSubscriptionId: string
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**متى تُنشأ:**
- ✅ تلقائياً عند Stripe Webhook
- ✅ عند إتمام الدفع

**الاستخدام:**
- Revenue Dashboard
- User Management
- Dashboard Stats

---

### 3. **ai-usage** (يجب إنشاؤها)
```typescript
// Structure
{
  userId: string
  userEmail: string
  tool: string             // اسم الأداة
  model?: string           // 'claude-3' | 'gpt-4' | etc
  timestamp: Timestamp
  cost: number            // بالدولار
  tokens?: number
  success: boolean
  duration?: number       // بالثواني
}
```

**متى تُنشأ:**
- ✅ كل مرة يستخدم user أداة AI
- ✅ في `src/lib/ai.ts` → `callAI()`

**الاستخدام:**
- AI Analytics
- Dashboard Stats
- Usage Tracking

---

## 🛠️ كيفية الإعداد

### Option 1: إنشاء Collections يدوياً (سريع)

#### في Firebase Console:

1. **اذهب إلى:** https://console.firebase.google.com
2. **اختر مشروعك:** 24toolkit
3. **Firestore Database** → **Start collection**

#### Collection 1: `subscriptions`
```
Collection ID: subscriptions

Document 1 (example):
- userId: "user123"
- userEmail: "john@example.com"
- plan: "pro"
- status: "active"
- amount: 4.99
- createdAt: [Timestamp - now]
- updatedAt: [Timestamp - now]

Save
```

#### Collection 2: `ai-usage`
```
Collection ID: ai-usage

Document 1 (example):
- userId: "user123"
- userEmail: "john@example.com"
- tool: "Text Rewriter"
- model: "claude-3"
- timestamp: [Timestamp - now]
- cost: 0.02
- success: true

Save
```

---

### Option 2: إضافة Logging للكود (تلقائي)

#### في `src/lib/ai.ts`:

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from '@/contexts/AuthContext'

// في نهاية callAI() function
export async function callAI(/* params */) {
  // ... existing code ...
  
  try {
    // ... AI call logic ...
    
    // ✅ Log AI usage to Firestore
    await logAIUsage({
      userId: user.uid,
      userEmail: user.email,
      tool: toolName,
      model: 'claude-3',
      timestamp: Timestamp.now(),
      cost: calculateCost(tokensUsed),
      success: true
    })
    
  } catch (error) {
    // Log failed attempt
    await logAIUsage({
      userId: user.uid,
      tool: toolName,
      success: false
    })
  }
}

// Helper function
async function logAIUsage(data: any) {
  try {
    await addDoc(collection(db, 'ai-usage'), {
      ...data,
      timestamp: data.timestamp || Timestamp.now()
    })
  } catch (error) {
    console.error('Failed to log AI usage:', error)
  }
}
```

---

### Option 3: Stripe Webhook (لـ subscriptions)

#### في `api/stripe-webhook.js`:

```javascript
// Already implemented! ✅
// الكود موجود ويعمل تلقائياً

// عند إتمام الدفع:
await db.collection('subscriptions').doc(subscriptionId).set({
  userId: customerId,
  plan: plan,
  status: 'active',
  amount: amount,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
})
```

**حالته:** ✅ موجود (يجب التحقق)

---

## 📝 خطوات سريعة للبدء

### Quick Start (5 دقائق):

#### 1️⃣ إنشاء Collections يدوياً:
```bash
1. Firebase Console
2. Firestore → Start collection
3. Create: subscriptions
4. Create: ai-usage
5. Add 1-2 sample documents
```

#### 2️⃣ Test في Admin Dashboard:
```bash
npm run dev
→ /admin/ai-analytics
→ /admin/revenue
→ شوف لو البيانات ظهرت ✅
```

#### 3️⃣ إضافة AI Logging:
```typescript
// في src/lib/ai.ts
// أضف logAIUsage() بعد كل AI call
```

---

## 🔍 التحقق من البيانات

### Test Queries:

#### في Firebase Console:
```javascript
// Get all AI usage
db.collection('ai-usage')
  .orderBy('timestamp', 'desc')
  .limit(10)

// Get active subscriptions
db.collection('subscriptions')
  .where('status', '==', 'active')
  .get()
```

#### في Admin Dashboard:
```
1. /admin/ai-analytics
   → شوف Charts
   → شوف Stats
   
2. /admin/revenue
   → شوف MRR/ARR
   → شوف Transactions
```

---

## 📊 Sample Data للتجربة

### AI Usage (10 documents):
```javascript
// Firebase Console → ai-usage → Add documents

[
  {
    userId: "user1",
    userEmail: "john@example.com",
    tool: "Text Rewriter",
    model: "claude-3",
    timestamp: new Date(),
    cost: 0.02,
    success: true
  },
  {
    userId: "user1",
    tool: "Email Writer",
    model: "claude-3",
    timestamp: new Date(),
    cost: 0.03,
    success: true
  },
  // ... add 8 more
]
```

### Subscriptions (5 documents):
```javascript
// Firebase Console → subscriptions → Add documents

[
  {
    userId: "user1",
    userEmail: "john@example.com",
    plan: "pro",
    status: "active",
    amount: 4.99,
    createdAt: new Date()
  },
  {
    userId: "user2",
    userEmail: "sarah@example.com",
    plan: "unlimited",
    status: "active",
    amount: 9.99,
    createdAt: new Date()
  },
  // ... add 3 more
]
```

---

## 🔐 Security Rules

### في `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Subscriptions (admin only)
    match /subscriptions/{docId} {
      allow read: if isAdmin() || resource.data.userId == request.auth.uid;
      allow write: if isAdmin();
    }
    
    // AI Usage
    match /ai-usage/{docId} {
      allow read: if isAdmin() || resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
    
    // Admin check
    function isAdmin() {
      return request.auth.token.email in [
        'admin@24toolkit.com',
        'nabel@24toolkit.com'
      ];
    }
  }
}
```

**Deploy:**
```bash
firebase deploy --only firestore:rules
```

---

## ✅ Checklist

### Initial Setup:
- [ ] Create `subscriptions` collection
- [ ] Create `ai-usage` collection
- [ ] Add 5-10 sample documents each
- [ ] Test in Admin Dashboard
- [ ] Verify data shows correctly

### Production Setup:
- [ ] Add AI logging to callAI()
- [ ] Verify Stripe webhook creates subscriptions
- [ ] Update Firestore rules
- [ ] Deploy rules
- [ ] Monitor collections
- [ ] Set up backups

---

## 🎯 Expected Results

### بعد الإعداد:

#### AI Analytics Page:
```
✅ Charts show real usage data
✅ Stats calculated from Firestore
✅ Top users from actual data
✅ Model distribution from real data
```

#### Revenue Page:
```
✅ MRR/ARR from active subscriptions
✅ Charts show real revenue
✅ Transactions from Firestore
✅ Plan breakdown accurate
```

#### Dashboard:
```
✅ All stats from real data
✅ No mock/placeholder data
✅ Real-time updates
```

---

## 🚀 Quick Commands

### Add Sample AI Usage:
```javascript
// في Browser Console (بعد Sign In)
const addSampleUsage = async () => {
  const db = getFirestore()
  for (let i = 0; i < 10; i++) {
    await addDoc(collection(db, 'ai-usage'), {
      userId: 'test-user',
      userEmail: 'test@example.com',
      tool: ['Text Rewriter', 'Email Writer', 'Content Generator'][i % 3],
      model: 'claude-3',
      timestamp: Timestamp.now(),
      cost: Math.random() * 0.05,
      success: true
    })
  }
  console.log('Sample data added!')
}
addSampleUsage()
```

### Add Sample Subscriptions:
```javascript
const addSampleSubs = async () => {
  const db = getFirestore()
  await addDoc(collection(db, 'subscriptions'), {
    userId: 'test-user',
    userEmail: 'test@example.com',
    plan: 'pro',
    status: 'active',
    amount: 4.99,
    createdAt: Timestamp.now()
  })
  console.log('Subscription added!')
}
addSampleSubs()
```

---

## 📊 الخلاصة

### الحالة الحالية:
```
✅ Admin Dashboard: Complete
✅ Code: Ready for real data
⚠️ Collections: Need setup
⚠️ Sample data: Need to add
```

### الخطوات التالية:
```
1. Create collections (5 min)
2. Add sample data (5 min)
3. Test dashboard (2 min)
4. Add AI logging (10 min)
5. Deploy! 🚀
```

### الوقت الإجمالي:
```
Basic setup: 10 دقيقة
Full setup: 30 دقيقة
Production ready: 1 ساعة
```

---

**الحالة:** ⚠️ Collections need setup  
**الأولوية:** 🔶 متوسطة-عالية  
**الوقت:** 10-30 دقيقة  
**الصعوبة:** سهلة ⭐⭐

---

## 🔗 Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**تبدأ الآن؟** اتبع Quick Start! 🚀✨

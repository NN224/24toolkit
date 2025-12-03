# 🔒 Firebase App Check Setup Guide

## ما هو Firebase App Check؟

Firebase App Check يحمي موارد Firebase الخاصة بك (Authentication, Firestore, Storage) من الاستخدام غير المصرح به. يتأكد أن الطلبات تأتي من تطبيقك الشرعي فقط، وليس من bots أو scripts ضارة.

---

## 📋 الخطوات المطلوبة

### ✅ 1. إنشاء reCAPTCHA v3 Site Key

#### الخطوة 1: اذهب إلى Google reCAPTCHA Admin Console
👉 https://www.google.com/recaptcha/admin/create

#### الخطوة 2: املأ النموذج

```
Label: 24toolkit
reCAPTCHA type: ✅ reCAPTCHA v3
Domains:
  - 24toolkit.com
  - localhost
Accept reCAPTCHA Terms of Service: ✅
```

#### الخطوة 3: احصل على المفاتيح

بعد الإنشاء، ستحصل على:
- **Site Key** (يبدأ بـ `6Le...`) - ✅ نحتاجه
- **Secret Key** - ❌ لا نحتاجه (Firebase يديره تلقائياً)

#### الخطوة 4: أضف Site Key للـ Environment Variables

```bash
# في .env.local
VITE_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ مهم جداً:**
- استخدم `VITE_` prefix لأنه frontend variable
- أضف نفس المتغير في **Vercel Environment Variables**

---

### ✅ 2. تفعيل App Check في Firebase Console

#### الخطوة 1: اذهب إلى Firebase Console
👉 https://console.firebase.google.com/project/toolkit-34bf6/appcheck

#### الخطوة 2: سجل التطبيق
1. اضغط **"Apps"** tab
2. اختر تطبيق الويب **"24toolkit"**
3. اضغط **"Register"**

#### الخطوة 3: اختر Provider
- Provider: **reCAPTCHA v3**
- Site Key: أدخل الـ Site Key من الخطوة 1

#### الخطوة 4: احفظ

---

### ✅ 3. نشر التحديثات

```bash
# تأكد أن كل شي يشتغل محلياً
npm run dev

# تحقق من Console
# يجب أن ترى: "✅ Firebase App Check initialized"

# انشر للإنتاج
git add .
git commit -m "feat: add Firebase App Check with reCAPTCHA v3"
git push origin main
```

---

### ✅ 4. إضافة Environment Variable في Vercel

#### الخطوة 1: اذهب إلى Vercel Dashboard
👉 https://vercel.com/nnh-ai-studio/24toolkit/settings/environment-variables

#### الخطوة 2: أضف المتغير
```
Name: VITE_RECAPTCHA_SITE_KEY
Value: 6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Environment: Production, Preview, Development
```

#### الخطوة 3: Redeploy
اضغط **"Redeploy"** لتطبيق التغييرات

---

### ✅ 5. اختبار App Check

#### في Development (localhost):
```bash
npm run dev
```

افتح Console وتحقق من:
```
✅ Firebase App Check initialized
```

#### في Production:
1. افتح https://24toolkit.com
2. افتح DevTools > Console
3. تحقق من رسالة App Check
4. جرب Sign In - يجب أن يعمل بدون مشاكل

---

### ✅ 6. تفعيل Enforcement في Firebase

**⚠️ فقط بعد التأكد أن كل شي يشتغل!**

#### الخطوة 1: اذهب إلى Firebase Console
👉 https://console.firebase.google.com/project/toolkit-34bf6/appcheck

#### الخطوة 2: فعّل Enforcement
1. اضغط على **"APIs"** tab
2. لكل خدمة (Authentication, Firestore):
   - اضغط **"Enforce"**
   - تأكد أنه لا توجد "Unregistered apps"
   - اضغط **"Enforce"** مرة أخرى للتأكيد

#### الخطوة 3: راقب الطلبات
- تحقق من **"Metrics"** tab
- يجب أن ترى 100% من الطلبات من "Registered apps"

---

## 🔍 استكشاف الأخطاء

### المشكلة: "App Check not initialized"

**السبب:** `VITE_RECAPTCHA_SITE_KEY` غير موجود

**الحل:**
1. تأكد من إضافة المتغير في `.env.local`
2. أعد تشغيل `npm run dev`
3. تأكد من استخدام `VITE_` prefix

---

### المشكلة: "App Check token is invalid"

**السبب:** Domain غير مسجل في reCAPTCHA

**الحل:**
1. اذهب إلى https://www.google.com/recaptcha/admin
2. أضف domain الصحيح (24toolkit.com)
3. انتظر بضع دقائق للتحديث

---

### المشكلة: "Authentication failed" بعد تفعيل Enforcement

**السبب:** التطبيق لم يُسجل بشكل صحيح في App Check

**الحل:**
1. اذهب إلى Firebase Console > App Check > Apps
2. تأكد من تسجيل التطبيق
3. تأكد من إضافة reCAPTCHA Site Key
4. أعد نشر التطبيق

---

## 📊 ما تم تعديله في الكود

### 1. `src/lib/firebase.ts`
```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Initialize App Check
if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  })
}
```

### 2. `.env.local`
```bash
VITE_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. `.env.example`
تم إضافة توثيق للمتغير الجديد

---

## 🎯 الخلاصة

### ما يجب عمله الآن:

1. ✅ **أنشئ reCAPTCHA v3 Site Key** من Google
2. ✅ **أضف Site Key** للـ `.env.local`
3. ✅ **سجل التطبيق** في Firebase App Check
4. ✅ **اختبر محلياً** أن كل شي يشتغل
5. ✅ **أضف Environment Variable** في Vercel
6. ✅ **انشر** للإنتاج
7. ✅ **اختبر في Production**
8. ✅ **فعّل Enforcement** في Firebase Console

### بعد التفعيل:

- ✅ Firebase محمي من الاستخدام غير المصرح به
- ✅ Bots والـ scripts الضارة محظورة
- ✅ الأمان محسّن بشكل كبير
- ✅ لا تأثير على UX للمستخدمين الشرعيين

---

## 📚 مصادر إضافية

- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Firebase App Check Best Practices](https://firebase.google.com/docs/app-check/web/recaptcha-provider)

---

## 🆘 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Console للأخطاء
2. راجع Firebase Console > App Check > Metrics
3. تأكد من صحة Environment Variables
4. تأكد من تسجيل Domain في reCAPTCHA

---

**آخر تحديث:** 2025-12-03
**الإصدار:** 1.0.0


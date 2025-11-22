# 🔒 تعليمات الأمان - Security Guidelines

## ⚠️ مهم: إدارة API Keys

### ✅ الطريقة الصحيحة

1. **استخدم `.env.local` للمفاتيح الحقيقية:**
```bash
# انسخ من .env.example
cp .env.example .env.local

# ضع مفاتيحك الحقيقية في .env.local
nano .env.local
```

2. **لا تشارك `.env.local` أبداً:**
   - ✅ `.env.local` في `.gitignore`
   - ❌ لا تضع المفاتيح في `.env`
   - ❌ لا تشاركها في Discord/Slack
   - ❌ لا تحفظها في screenshots

3. **للتطوير الجماعي:**
   - شارك `.env.example` فقط
   - كل مطور يُنشئ `.env.local` الخاص به

---

## 🔑 الحصول على API Keys

### Anthropic Claude
```
URL: https://console.anthropic.com/
Format: ANTHROPIC_API_KEY=sk-ant-...
```

### Groq
```
URL: https://console.groq.com/
Format: GROQ_API_KEY=gsk_...
```

### GitHub Token
```
URL: https://github.com/settings/tokens
Scopes: repo, read:user
Format: GITHUB_TOKEN=github_pat_...
```

### Firebase
```
URL: https://console.firebase.google.com/
في: Project Settings > Your apps > Web app
```

---

## 🛡️ حماية Production

### Vercel (موصى به)
```bash
# إضافة المفاتيح في Dashboard
1. Vercel Dashboard > Project Settings
2. Environment Variables
3. أضف المفاتيح من .env.local
```

### Environment Variables
- ✅ استخدم Vercel/Netlify environment variables
- ✅ مفاتيح منفصلة لكل environment (dev, staging, prod)
- ✅ تدوير المفاتيح كل 90 يوم

---

## 🚨 في حالة تسريب مفتاح

### خطوات فورية:
1. **أوقف المفتاح فوراً** في console المزود
2. **أنشئ مفتاح جديد**
3. **حدّث environment variables**
4. **راقب استخدام API** للنشاط غير المعتاد
5. **غيّر جميع المفاتيح الأخرى** (احتياطي)

### منصات المراقبة:
- Anthropic Console: https://console.anthropic.com/settings/keys
- Groq Console: https://console.groq.com/keys
- GitHub Tokens: https://github.com/settings/tokens

---

## 📋 Checklist قبل Deploy

- [ ] جميع المفاتيح في environment variables
- [ ] `.env.local` غير موجود في git
- [ ] `.env` في `.gitignore`
- [ ] تم اختبار التطبيق بدون `.env.local`
- [ ] Rate limiting مفعّل
- [ ] CORS مضبوط بشكل صحيح

---

## 🔍 npm audit Vulnerabilities

### الحالة الحالية
```
4 vulnerabilities (2 moderate, 2 high)
- @vercel/node (esbuild, path-to-regexp, undici)
```

### الحل
هذه vulnerabilities في **devDependencies** فقط:
- ✅ لا تؤثر على production
- ✅ تستخدم فقط في build/development
- ⚠️ لا تستخدم `--force` إلا إذا كنت متأكد

### متى تقلق
- 🔴 إذا كانت في **dependencies** (production)
- 🔴 إذا كانت severity: **critical**
- 🟡 راجع دورياً وحدّث

---

## 🎯 Best Practices

### 1. API Keys
- ✅ مفاتيح منفصلة لـ dev/prod
- ✅ تدوير دوري (كل 3 أشهر)
- ✅ monitoring للاستخدام
- ✅ rate limiting

### 2. Code
- ✅ input validation
- ✅ output sanitization (DOMPurify)
- ✅ error boundaries
- ✅ HTTPS only

### 3. Dependencies
- ✅ `npm audit` كل أسبوع
- ✅ حدّث dependencies بانتظام
- ✅ استخدم lock files

### 4. Monitoring
- ✅ تتبع استخدام API
- ✅ alerts للاستخدام الزائد
- ✅ error tracking (Sentry)

---

## 📞 للإبلاغ عن ثغرة أمنية

**لا تنشر الثغرة علناً!**

اتصل مباشرة:
- Email: [أضف بريدك]
- أو أنشئ private security advisory في GitHub

---

## ✅ تم تطبيق هذه الإجراءات

- [x] .env.local في gitignore
- [x] DOMPurify للـ HTML sanitization
- [x] Rate limiting على جميع endpoints
- [x] Input validation شامل
- [x] Error handling محسّن
- [x] console.log محذوف من production
- [x] Timeout للـ API calls
- [x] CORS مضبوط

**آخر مراجعة:** نوفمبر 2024

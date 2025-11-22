# 📚 دليل استخدام AI Prompts الصارمة

## نظرة عامة

تم إنشاء مكتبة مركزية للـ AI prompts في `/src/lib/ai-prompts.ts` تحتوي على prompts صارمة ومحددة لكل أداة AI.

## ✨ المميزات

### 1. **Prompts صارمة جداً**
- قواعد واضحة ومحددة
- تحكم كامل في format الإخراج
- منع AI hallucination
- جودة متسقة

### 2. **مركزية**
- كل الـ prompts في مكان واحد
- سهولة التحديث والصيانة
- Consistency عبر كل الأدوات

### 3. **Validation مدمج**
```typescript
validatePromptInput(input, minLength, maxLength)
```

---

## 📖 الـ Prompts المتوفرة

### 1. **HASHTAG_GENERATOR**
```typescript
AI_PROMPTS.HASHTAG_GENERATOR(content)
```
**الإخراج:**
- 15-20 hashtags بالضبط
- كل واحد على سطر
- يبدأ بـ #
- mix من popular و niche
- لا توضيحات إضافية

**مثال:**
```typescript
const promptText = AI_PROMPTS.HASHTAG_GENERATOR("Travel photography in Dubai")
// Output:
// #TravelPhotography
// #DubaiTravel
// #DesertVibes
// ...
```

---

### 2. **TRANSLATOR**
```typescript
AI_PROMPTS.TRANSLATOR(text, targetLanguage)
```
**القواعد:**
- ترجمة فقط، بدون مقدمات
- preserve formatting
- لا تترجم URLs أو code
- context-aware

**مثال:**
```typescript
const promptText = AI_PROMPTS.TRANSLATOR("Hello world!", "Arabic")
// Output: مرحباً بالعالم!
```

---

### 3. **EMAIL_WRITER**
```typescript
AI_PROMPTS.EMAIL_WRITER(topic, tone)
```
**الـ Structure:**
```
Subject: [compelling subject]

[Greeting],

[Body paragraphs]

[Closing],
[Signature]
```

**Tones:**
- professional
- friendly
- formal
- casual

---

### 4. **TASK_BUILDER**
```typescript
AI_PROMPTS.TASK_BUILDER(project, duration)
```
**الإخراج:** JSON array فقط
```json
[
  "Create project structure",
  "Design database schema",
  "Implement authentication",
  ...
]
```

---

### 5. **IDEA_ANALYZER**
```typescript
AI_PROMPTS.IDEA_ANALYZER(idea)
```
**الإخراج:** JSON object محدد
```json
{
  "potential": {
    "overview": "...",
    "target_audience": ["...", "..."],
    "key_strengths": ["...", "..."],
    "market_size_estimate": "..."
  },
  "risks": ["...", "...", "..."],
  "suggestions": ["...", "...", "..."]
}
```

---

### 6. **TEXT_SUMMARIZER**
```typescript
AI_PROMPTS.TEXT_SUMMARIZER(text, 'short' | 'medium' | 'long')
```
**الأطوال:**
- `short`: 50-75 كلمة (2-3 جمل)
- `medium`: 100-150 كلمة (فقرة)
- `long`: 200-300 كلمة (2-3 فقرات)

---

### 7. **PARAGRAPH_REWRITER**
```typescript
AI_PROMPTS.PARAGRAPH_REWRITER(text, style)
```
**الأنماط:**
- `professional`: رسمي وممهني
- `casual`: ودي ومحادثة
- `creative`: مبدع وحيوي
- `concise`: مختصر ومباشر

---

### 8. **GRAMMAR_CORRECTOR**
```typescript
AI_PROMPTS.GRAMMAR_CORRECTOR(text)
```
**يصلح:**
- Grammar mistakes
- Spelling errors
- Punctuation
- Verb tense
- Capitalization

**لا يغير:**
- المعنى الأصلي
- أسلوب الكاتب
- بنية الجمل (إلا إذا ضروري)

---

### 9. **CODE_FORMATTER**
```typescript
AI_PROMPTS.CODE_FORMATTER(code, language)
```
**اللغات المدعومة:** أي لغة برمجة

**يطبق:**
- Proper indentation
- Consistent spacing
- Style guidelines
- Fixes obvious syntax errors

---

## 🛠️ كيفية الاستخدام

### الطريقة الصحيحة ✅

```typescript
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { callAI } from '@/lib/ai'

async function generateHashtags(content: string, provider: AIProvider) {
  // 1. Validate input
  try {
    validatePromptInput(content, 5, 5000)
  } catch (error) {
    toast.error(error.message)
    return
  }

  // 2. Use strict prompt
  const promptText = AI_PROMPTS.HASHTAG_GENERATOR(content)

  // 3. Call AI
  const result = await callAI(promptText, provider)
  
  // 4. Process result
  const hashtags = result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('#'))
    
  return hashtags
}
```

### الطريقة الخاطئة ❌

```typescript
// DON'T DO THIS!
const promptText = `Generate hashtags for: ${content}`
// Problem: غير محدد، output غير متوقع
```

---

## 🔄 تطبيق على أدوات موجودة

### مثال: تحديث AITranslator

**قبل:**
```typescript
const promptText = `Translate to ${targetLang}: ${text}`
```

**بعد:**
```typescript
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'

// Validate
validatePromptInput(inputText, 1, 10000)

// Use strict prompt
const promptText = AI_PROMPTS.TRANSLATOR(inputText, targetLang)
```

---

## 📋 Checklist للمطورين

عند تطبيق prompts صارمة:

- [ ] Import `AI_PROMPTS` و `validatePromptInput`
- [ ] استخدام `validatePromptInput()` قبل الـ AI call
- [ ] استخدام الـ prompt الصحيح من المكتبة
- [ ] Handle الـ output بناءً على الـ format المتوقع
- [ ] Test مع inputs مختلفة

---

## 🎯 الأدوات المطلوب تحديثها

### تم ✅
- [x] AIHashtagGenerator

### قيد الانتظار ⏳
- [ ] AITranslator
- [ ] AIEmailWriter
- [ ] AITaskBuilder
- [ ] IdeaAnalyzer
- [ ] TextSummarizer
- [ ] ParagraphRewriter
- [ ] GrammarCorrector
- [ ] CodeFormatter

---

## 💡 نصائح

### 1. **كن محدداً**
Prompts الصارمة تعطي نتائج أفضل من المفتوحة.

### 2. **Test كثير**
جرب الـ prompts مع مدخلات مختلفة.

### 3. **Update بانتظام**
حسّن الـ prompts بناءً على feedback المستخدمين.

### 4. **Document التغييرات**
أي تحديث للـ prompts، وثّقه هنا.

---

## 📞 للمطورين

إذا تحتاج prompt جديد:
1. أضفه في `/src/lib/ai-prompts.ts`
2. اتبع الـ pattern الموجود
3. Test جيداً
4. Document هنا

---

## 🎉 الفوائد

### قبل المكتبة ❌
- Prompts متفرقة في كل ملف
- Inconsistent quality
- صعوبة التحديث
- تكرار

### بعد المكتبة ✅
- مركزية
- جودة متسقة
- سهولة التحديث
- DRY principle

---

**آخر تحديث:** نوفمبر 2024  
**الحالة:** 1/9 أدوات محدّثة

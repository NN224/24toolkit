/**
 * Smart Tool Recommendations System
 * Suggests related tools based on what the user just used
 */

export interface ToolRecommendation {
  toolId: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  path: string
  reason: string
  reasonAr: string
  icon: string
}

/**
 * Tool relationships map
 * Key: current tool ID
 * Value: array of related tool IDs with reasons
 */
export const TOOL_RELATIONSHIPS: Record<string, Array<{
  toolId: string
  reason: string
  reasonAr: string
}>> = {
  // Image Tools Chain
  'image-compressor': [
    { toolId: 'image-format-converter', reason: 'Convert to WebP for even smaller files', reasonAr: 'حول للـ WebP لحجم أصغر' },
    { toolId: 'image-resizer', reason: 'Resize before compressing for best results', reasonAr: 'غيّر الحجم قبل الضغط لنتائج أفضل' },
    { toolId: 'watermark-adder', reason: 'Add watermark to protect your images', reasonAr: 'أضف علامة مائية لحماية صورك' },
  ],
  'image-resizer': [
    { toolId: 'image-compressor', reason: 'Compress the resized image', reasonAr: 'اضغط الصورة بعد تغيير حجمها' },
    { toolId: 'image-cropper', reason: 'Crop to exact dimensions', reasonAr: 'قص لأبعاد محددة' },
    { toolId: 'image-format-converter', reason: 'Convert to optimal format', reasonAr: 'حول لصيغة مثالية' },
  ],
  'image-cropper': [
    { toolId: 'image-resizer', reason: 'Resize the cropped image', reasonAr: 'غيّر حجم الصورة المقصوصة' },
    { toolId: 'image-filter-editor', reason: 'Apply filters to your crop', reasonAr: 'طبّق فلاتر على الصورة' },
    { toolId: 'background-remover', reason: 'Remove background from cropped image', reasonAr: 'أزل الخلفية من الصورة' },
  ],
  'background-remover': [
    { toolId: 'image-format-converter', reason: 'Save as PNG for transparency', reasonAr: 'احفظ كـ PNG للشفافية' },
    { toolId: 'watermark-adder', reason: 'Add your logo', reasonAr: 'أضف شعارك' },
    { toolId: 'image-compressor', reason: 'Compress the final image', reasonAr: 'اضغط الصورة النهائية' },
  ],
  'image-to-text': [
    { toolId: 'ai-translator', reason: 'Translate the extracted text', reasonAr: 'ترجم النص المستخرج' },
    { toolId: 'grammar-corrector', reason: 'Fix any OCR errors', reasonAr: 'صحح أخطاء الـ OCR' },
    { toolId: 'text-summarizer', reason: 'Summarize the extracted text', reasonAr: 'لخص النص المستخرج' },
  ],
  'image-format-converter': [
    { toolId: 'image-compressor', reason: 'Compress the converted image', reasonAr: 'اضغط الصورة المحولة' },
    { toolId: 'image-resizer', reason: 'Resize for web use', reasonAr: 'غيّر الحجم للويب' },
  ],
  
  // AI Text Tools Chain
  'ai-translator': [
    { toolId: 'grammar-corrector', reason: 'Check grammar in translation', reasonAr: 'صحح القواعد في الترجمة' },
    { toolId: 'text-summarizer', reason: 'Summarize the translated text', reasonAr: 'لخص النص المترجم' },
    { toolId: 'paragraph-rewriter', reason: 'Improve the translation style', reasonAr: 'حسّن أسلوب الترجمة' },
  ],
  'text-summarizer': [
    { toolId: 'ai-translator', reason: 'Translate the summary', reasonAr: 'ترجم الملخص' },
    { toolId: 'ai-hashtag-generator', reason: 'Generate hashtags from summary', reasonAr: 'أنشئ هاشتاغات من الملخص' },
    { toolId: 'grammar-corrector', reason: 'Polish the summary', reasonAr: 'صقل الملخص' },
  ],
  'paragraph-rewriter': [
    { toolId: 'grammar-corrector', reason: 'Check the rewritten text', reasonAr: 'صحح النص المعاد كتابته' },
    { toolId: 'ai-translator', reason: 'Translate to another language', reasonAr: 'ترجم لغة أخرى' },
    { toolId: 'word-counter', reason: 'Check word count', reasonAr: 'تحقق من عدد الكلمات' },
  ],
  'grammar-corrector': [
    { toolId: 'paragraph-rewriter', reason: 'Improve writing style', reasonAr: 'حسّن أسلوب الكتابة' },
    { toolId: 'ai-translator', reason: 'Translate the corrected text', reasonAr: 'ترجم النص المصحح' },
    { toolId: 'word-counter', reason: 'Analyze your text', reasonAr: 'حلل نصك' },
  ],
  
  // AI Content Tools
  'ai-email-writer': [
    { toolId: 'grammar-corrector', reason: 'Double-check grammar', reasonAr: 'تحقق من القواعد' },
    { toolId: 'ai-translator', reason: 'Translate for international contacts', reasonAr: 'ترجم للتواصل الدولي' },
    { toolId: 'text-case-converter', reason: 'Fix text formatting', reasonAr: 'صحح تنسيق النص' },
  ],
  'ai-hashtag-generator': [
    { toolId: 'text-case-converter', reason: 'Format hashtags properly', reasonAr: 'نسّق الهاشتاغات' },
    { toolId: 'word-counter', reason: 'Check character count for Twitter', reasonAr: 'تحقق من عدد الأحرف لتويتر' },
    { toolId: 'ai-translator', reason: 'Translate hashtags', reasonAr: 'ترجم الهاشتاغات' },
  ],
  'ai-task-builder': [
    { toolId: 'pomodoro-timer', reason: 'Start working on your tasks', reasonAr: 'ابدأ العمل على مهامك' },
    { toolId: 'daily-planner-template', reason: 'Plan your day with these tasks', reasonAr: 'خطط يومك بهذه المهام' },
    { toolId: 'notepad', reason: 'Take notes while working', reasonAr: 'دوّن ملاحظات أثناء العمل' },
  ],
  'idea-analyzer': [
    { toolId: 'ai-task-builder', reason: 'Turn your idea into action steps', reasonAr: 'حول فكرتك لخطوات عمل' },
    { toolId: 'ai-email-writer', reason: 'Write pitch emails', reasonAr: 'اكتب إيميلات ترويجية' },
    { toolId: 'notepad', reason: 'Save your analysis notes', reasonAr: 'احفظ ملاحظات تحليلك' },
  ],
  
  // Security Tools
  'password-generator': [
    { toolId: 'password-strength-checker', reason: 'Test your password strength', reasonAr: 'اختبر قوة كلمة مرورك' },
    { toolId: 'hash-generator', reason: 'Hash the password for storage', reasonAr: 'شفّر كلمة المرور للتخزين' },
    { toolId: 'text-encryptor', reason: 'Encrypt sensitive data', reasonAr: 'شفّر البيانات الحساسة' },
  ],
  'password-strength-checker': [
    { toolId: 'password-generator', reason: 'Generate a stronger password', reasonAr: 'أنشئ كلمة مرور أقوى' },
    { toolId: 'hash-generator', reason: 'Create a secure hash', reasonAr: 'أنشئ هاش آمن' },
  ],
  'hash-generator': [
    { toolId: 'file-hash-verifier', reason: 'Verify file integrity', reasonAr: 'تحقق من سلامة الملفات' },
    { toolId: 'password-generator', reason: 'Generate secure passwords', reasonAr: 'أنشئ كلمات مرور آمنة' },
  ],
  
  // Developer Tools
  'code-formatter': [
    { toolId: 'json-beautifier', reason: 'Format JSON data', reasonAr: 'نسّق بيانات JSON' },
    { toolId: 'html-formatter', reason: 'Format HTML code', reasonAr: 'نسّق كود HTML' },
    { toolId: 'regex-tester', reason: 'Test your regex patterns', reasonAr: 'اختبر أنماط Regex' },
  ],
  'json-beautifier': [
    { toolId: 'json-csv-converter', reason: 'Convert to CSV', reasonAr: 'حول لـ CSV' },
    { toolId: 'code-formatter', reason: 'Format other code', reasonAr: 'نسّق كود آخر' },
  ],
  'json-csv-converter': [
    { toolId: 'json-beautifier', reason: 'Beautify the JSON', reasonAr: 'جمّل الـ JSON' },
    { toolId: 'word-counter', reason: 'Count data entries', reasonAr: 'عد المدخلات' },
  ],
  'qr-generator': [
    { toolId: 'url-encoder-decoder', reason: 'Encode URLs properly', reasonAr: 'شفّر الروابط بشكل صحيح' },
    { toolId: 'image-compressor', reason: 'Compress the QR image', reasonAr: 'اضغط صورة QR' },
  ],
  'color-picker': [
    { toolId: 'image-color-extractor', reason: 'Extract colors from images', reasonAr: 'استخرج ألوان من الصور' },
    { toolId: 'css-formatter', reason: 'Use colors in CSS', reasonAr: 'استخدم الألوان في CSS' },
  ],
  
  // Text Tools
  'word-counter': [
    { toolId: 'text-summarizer', reason: 'Shorten your text', reasonAr: 'قصّر نصك' },
    { toolId: 'find-replace', reason: 'Edit your text', reasonAr: 'عدّل نصك' },
    { toolId: 'text-case-converter', reason: 'Change text case', reasonAr: 'غيّر حالة النص' },
  ],
  'text-case-converter': [
    { toolId: 'find-replace', reason: 'Find and replace text', reasonAr: 'ابحث واستبدل النص' },
    { toolId: 'word-counter', reason: 'Count your text', reasonAr: 'عد نصك' },
  ],
  'find-replace': [
    { toolId: 'text-diff-checker', reason: 'Compare before/after', reasonAr: 'قارن قبل/بعد' },
    { toolId: 'word-counter', reason: 'Check word count', reasonAr: 'تحقق من عدد الكلمات' },
  ],
  'text-diff-checker': [
    { toolId: 'find-replace', reason: 'Make bulk changes', reasonAr: 'أجرِ تغييرات جماعية' },
    { toolId: 'paragraph-rewriter', reason: 'Rewrite changed sections', reasonAr: 'أعد كتابة الأقسام المتغيرة' },
  ],
  
  // Productivity Tools
  'pomodoro-timer': [
    { toolId: 'daily-planner-template', reason: 'Plan your work sessions', reasonAr: 'خطط جلسات عملك' },
    { toolId: 'notepad', reason: 'Take notes during work', reasonAr: 'دوّن ملاحظات أثناء العمل' },
    { toolId: 'stopwatch', reason: 'Track total time', reasonAr: 'تتبع الوقت الإجمالي' },
  ],
  'stopwatch': [
    { toolId: 'pomodoro-timer', reason: 'Use structured work sessions', reasonAr: 'استخدم جلسات عمل منظمة' },
    { toolId: 'countdown-timer', reason: 'Set time limits', reasonAr: 'حدد حدود زمنية' },
  ],
  'notepad': [
    { toolId: 'word-counter', reason: 'Count your notes', reasonAr: 'عد ملاحظاتك' },
    { toolId: 'text-summarizer', reason: 'Summarize your notes', reasonAr: 'لخص ملاحظاتك' },
    { toolId: 'markdown-previewer', reason: 'Format with Markdown', reasonAr: 'نسّق بـ Markdown' },
  ],
  'daily-planner-template': [
    { toolId: 'ai-task-builder', reason: 'Generate tasks automatically', reasonAr: 'أنشئ مهام تلقائياً' },
    { toolId: 'pomodoro-timer', reason: 'Start working on tasks', reasonAr: 'ابدأ العمل على المهام' },
  ],
  
  // Calculators
  'percentage-calculator': [
    { toolId: 'discount-calculator', reason: 'Calculate discounts', reasonAr: 'احسب الخصومات' },
    { toolId: 'tip-calculator', reason: 'Calculate tips', reasonAr: 'احسب الإكراميات' },
  ],
  'discount-calculator': [
    { toolId: 'percentage-calculator', reason: 'Calculate other percentages', reasonAr: 'احسب نسب أخرى' },
    { toolId: 'currency-converter', reason: 'Convert to other currencies', reasonAr: 'حول لعملات أخرى' },
  ],
  'tip-calculator': [
    { toolId: 'percentage-calculator', reason: 'Custom percentage calculations', reasonAr: 'حسابات نسب مخصصة' },
    { toolId: 'currency-converter', reason: 'Convert currency', reasonAr: 'حول العملة' },
  ],
  'currency-converter': [
    { toolId: 'unit-converter', reason: 'Convert other units', reasonAr: 'حول وحدات أخرى' },
    { toolId: 'percentage-calculator', reason: 'Calculate exchange fees', reasonAr: 'احسب رسوم التحويل' },
  ],
  'bmi-calculator': [
    { toolId: 'unit-converter', reason: 'Convert weight/height units', reasonAr: 'حول وحدات الوزن/الطول' },
    { toolId: 'age-calculator', reason: 'Calculate your age', reasonAr: 'احسب عمرك' },
  ],
  'age-calculator': [
    { toolId: 'countdown-timer', reason: 'Count down to birthday', reasonAr: 'عد تنازلي لعيد الميلاد' },
    { toolId: 'bmi-calculator', reason: 'Check BMI for your age', reasonAr: 'تحقق من BMI لعمرك' },
  ],
}

/**
 * Tool metadata for recommendations
 */
export const TOOL_METADATA: Record<string, {
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  path: string
  icon: string
}> = {
  'image-compressor': {
    title: 'Image Compressor',
    titleAr: 'ضاغط الصور',
    description: 'Reduce image size without losing quality',
    descriptionAr: 'تقليل حجم الصورة بدون فقدان الجودة',
    path: '/tools/image-compressor',
    icon: '🗜️'
  },
  'image-resizer': {
    title: 'Image Resizer',
    titleAr: 'مغيّر حجم الصور',
    description: 'Resize images to specific dimensions',
    descriptionAr: 'تغيير حجم الصور لأبعاد محددة',
    path: '/tools/image-resizer',
    icon: '📐'
  },
  'image-cropper': {
    title: 'Image Cropper',
    titleAr: 'قاص الصور',
    description: 'Crop images to any shape',
    descriptionAr: 'قص الصور لأي شكل',
    path: '/tools/image-cropper',
    icon: '✂️'
  },
  'image-format-converter': {
    title: 'Format Converter',
    titleAr: 'محول الصيغ',
    description: 'Convert between image formats',
    descriptionAr: 'تحويل بين صيغ الصور',
    path: '/tools/image-format-converter',
    icon: '🔄'
  },
  'background-remover': {
    title: 'Background Remover',
    titleAr: 'مزيل الخلفية',
    description: 'Remove image backgrounds',
    descriptionAr: 'إزالة خلفيات الصور',
    path: '/tools/background-remover',
    icon: '🎭'
  },
  'watermark-adder': {
    title: 'Watermark Adder',
    titleAr: 'مضيف العلامة المائية',
    description: 'Add watermarks to images',
    descriptionAr: 'إضافة علامات مائية للصور',
    path: '/tools/watermark-adder',
    icon: '💧'
  },
  'image-filter-editor': {
    title: 'Filter Editor',
    titleAr: 'محرر الفلاتر',
    description: 'Apply filters to images',
    descriptionAr: 'تطبيق فلاتر على الصور',
    path: '/tools/image-filter-editor',
    icon: '🎨'
  },
  'image-to-text': {
    title: 'Image to Text (OCR)',
    titleAr: 'صورة إلى نص',
    description: 'Extract text from images',
    descriptionAr: 'استخراج النص من الصور',
    path: '/tools/image-to-text',
    icon: '📝'
  },
  'ai-translator': {
    title: 'AI Translator',
    titleAr: 'المترجم الذكي',
    description: 'Translate text with AI',
    descriptionAr: 'ترجمة النص بالذكاء الاصطناعي',
    path: '/tools/ai-translator',
    icon: '🌐'
  },
  'text-summarizer': {
    title: 'Text Summarizer',
    titleAr: 'ملخص النصوص',
    description: 'Summarize long texts',
    descriptionAr: 'تلخيص النصوص الطويلة',
    path: '/tools/text-summarizer',
    icon: '📋'
  },
  'paragraph-rewriter': {
    title: 'Paragraph Rewriter',
    titleAr: 'معيد كتابة الفقرات',
    description: 'Rewrite paragraphs',
    descriptionAr: 'إعادة كتابة الفقرات',
    path: '/tools/paragraph-rewriter',
    icon: '✍️'
  },
  'grammar-corrector': {
    title: 'Grammar Corrector',
    titleAr: 'مصحح القواعد',
    description: 'Fix grammar mistakes',
    descriptionAr: 'تصحيح الأخطاء النحوية',
    path: '/tools/grammar-corrector',
    icon: '✓'
  },
  'ai-email-writer': {
    title: 'AI Email Writer',
    titleAr: 'كاتب الإيميلات',
    description: 'Write professional emails',
    descriptionAr: 'كتابة إيميلات احترافية',
    path: '/tools/ai-email-writer',
    icon: '📧'
  },
  'ai-hashtag-generator': {
    title: 'Hashtag Generator',
    titleAr: 'منشئ الهاشتاغات',
    description: 'Generate trending hashtags',
    descriptionAr: 'إنشاء هاشتاغات رائجة',
    path: '/tools/ai-hashtag-generator',
    icon: '#️⃣'
  },
  'ai-task-builder': {
    title: 'AI Task Builder',
    titleAr: 'منشئ المهام',
    description: 'Break down projects into tasks',
    descriptionAr: 'تقسيم المشاريع لمهام',
    path: '/tools/ai-task-builder',
    icon: '📋'
  },
  'idea-analyzer': {
    title: 'Idea Analyzer',
    titleAr: 'محلل الأفكار',
    description: 'Analyze your business ideas',
    descriptionAr: 'تحليل أفكارك التجارية',
    path: '/tools/idea-analyzer',
    icon: '💡'
  },
  'password-generator': {
    title: 'Password Generator',
    titleAr: 'منشئ كلمات المرور',
    description: 'Generate secure passwords',
    descriptionAr: 'إنشاء كلمات مرور آمنة',
    path: '/tools/password-generator',
    icon: '🔐'
  },
  'password-strength-checker': {
    title: 'Password Strength',
    titleAr: 'قوة كلمة المرور',
    description: 'Check password strength',
    descriptionAr: 'فحص قوة كلمة المرور',
    path: '/tools/password-strength-checker',
    icon: '💪'
  },
  'hash-generator': {
    title: 'Hash Generator',
    titleAr: 'منشئ الهاش',
    description: 'Generate MD5/SHA hashes',
    descriptionAr: 'إنشاء هاش MD5/SHA',
    path: '/tools/hash-generator',
    icon: '🔒'
  },
  'file-hash-verifier': {
    title: 'File Hash Verifier',
    titleAr: 'محقق هاش الملفات',
    description: 'Verify file integrity',
    descriptionAr: 'التحقق من سلامة الملفات',
    path: '/tools/file-hash-verifier',
    icon: '✅'
  },
  'text-encryptor': {
    title: 'Text Encryptor',
    titleAr: 'مشفر النصوص',
    description: 'Encrypt sensitive text',
    descriptionAr: 'تشفير النصوص الحساسة',
    path: '/tools/text-encryptor',
    icon: '🔏'
  },
  'code-formatter': {
    title: 'Code Formatter',
    titleAr: 'منسق الكود',
    description: 'Format and beautify code',
    descriptionAr: 'تنسيق وتجميل الكود',
    path: '/tools/code-formatter',
    icon: '💻'
  },
  'json-beautifier': {
    title: 'JSON Beautifier',
    titleAr: 'مجمّل JSON',
    description: 'Format JSON data',
    descriptionAr: 'تنسيق بيانات JSON',
    path: '/tools/json-beautifier',
    icon: '{}'
  },
  'html-formatter': {
    title: 'HTML Formatter',
    titleAr: 'منسق HTML',
    description: 'Format HTML code',
    descriptionAr: 'تنسيق كود HTML',
    path: '/tools/html-formatter',
    icon: '🌐'
  },
  'json-csv-converter': {
    title: 'JSON to CSV',
    titleAr: 'JSON إلى CSV',
    description: 'Convert JSON to CSV',
    descriptionAr: 'تحويل JSON إلى CSV',
    path: '/tools/json-csv-converter',
    icon: '📊'
  },
  'regex-tester': {
    title: 'Regex Tester',
    titleAr: 'اختبار Regex',
    description: 'Test regular expressions',
    descriptionAr: 'اختبار التعبيرات النمطية',
    path: '/tools/regex-tester',
    icon: '🔍'
  },
  'qr-generator': {
    title: 'QR Generator',
    titleAr: 'منشئ QR',
    description: 'Generate QR codes',
    descriptionAr: 'إنشاء رموز QR',
    path: '/tools/qr-generator',
    icon: '📱'
  },
  'color-picker': {
    title: 'Color Picker',
    titleAr: 'منتقي الألوان',
    description: 'Pick and convert colors',
    descriptionAr: 'اختيار وتحويل الألوان',
    path: '/tools/color-picker',
    icon: '🎨'
  },
  'image-color-extractor': {
    title: 'Color Extractor',
    titleAr: 'مستخرج الألوان',
    description: 'Extract colors from images',
    descriptionAr: 'استخراج الألوان من الصور',
    path: '/tools/image-color-extractor',
    icon: '🖼️'
  },
  'url-encoder-decoder': {
    title: 'URL Encoder',
    titleAr: 'مشفر الروابط',
    description: 'Encode/decode URLs',
    descriptionAr: 'تشفير/فك تشفير الروابط',
    path: '/tools/url-encoder-decoder',
    icon: '🔗'
  },
  'word-counter': {
    title: 'Word Counter',
    titleAr: 'عداد الكلمات',
    description: 'Count words and characters',
    descriptionAr: 'عد الكلمات والأحرف',
    path: '/tools/word-counter',
    icon: '🔢'
  },
  'text-case-converter': {
    title: 'Case Converter',
    titleAr: 'محول الحالة',
    description: 'Convert text case',
    descriptionAr: 'تحويل حالة النص',
    path: '/tools/text-case-converter',
    icon: 'Aa'
  },
  'find-replace': {
    title: 'Find & Replace',
    titleAr: 'بحث واستبدال',
    description: 'Find and replace text',
    descriptionAr: 'بحث واستبدال النص',
    path: '/tools/find-replace',
    icon: '🔍'
  },
  'text-diff-checker': {
    title: 'Text Diff',
    titleAr: 'مقارن النصوص',
    description: 'Compare two texts',
    descriptionAr: 'مقارنة نصين',
    path: '/tools/text-diff-checker',
    icon: '📄'
  },
  'pomodoro-timer': {
    title: 'Pomodoro Timer',
    titleAr: 'مؤقت بومودورو',
    description: 'Focus timer technique',
    descriptionAr: 'تقنية التركيز الزمني',
    path: '/tools/pomodoro-timer',
    icon: '🍅'
  },
  'stopwatch': {
    title: 'Stopwatch',
    titleAr: 'ساعة إيقاف',
    description: 'Track elapsed time',
    descriptionAr: 'تتبع الوقت المنقضي',
    path: '/tools/stopwatch',
    icon: '⏱️'
  },
  'countdown-timer': {
    title: 'Countdown Timer',
    titleAr: 'عد تنازلي',
    description: 'Count down to events',
    descriptionAr: 'عد تنازلي للأحداث',
    path: '/tools/countdown-timer',
    icon: '⏳'
  },
  'notepad': {
    title: 'Notepad',
    titleAr: 'مفكرة',
    description: 'Quick notes with auto-save',
    descriptionAr: 'ملاحظات سريعة مع حفظ تلقائي',
    path: '/tools/notepad',
    icon: '📝'
  },
  'daily-planner-template': {
    title: 'Daily Planner',
    titleAr: 'مخطط يومي',
    description: 'Plan your day',
    descriptionAr: 'خطط يومك',
    path: '/tools/daily-planner-template',
    icon: '📅'
  },
  'markdown-previewer': {
    title: 'Markdown Previewer',
    titleAr: 'معاين Markdown',
    description: 'Preview Markdown',
    descriptionAr: 'معاينة Markdown',
    path: '/tools/markdown-previewer',
    icon: '📄'
  },
  'percentage-calculator': {
    title: 'Percentage Calculator',
    titleAr: 'حاسبة النسب',
    description: 'Calculate percentages',
    descriptionAr: 'حساب النسب المئوية',
    path: '/tools/percentage-calculator',
    icon: '%'
  },
  'discount-calculator': {
    title: 'Discount Calculator',
    titleAr: 'حاسبة الخصم',
    description: 'Calculate discounts',
    descriptionAr: 'حساب الخصومات',
    path: '/tools/discount-calculator',
    icon: '🏷️'
  },
  'tip-calculator': {
    title: 'Tip Calculator',
    titleAr: 'حاسبة الإكرامية',
    description: 'Calculate tips',
    descriptionAr: 'حساب الإكراميات',
    path: '/tools/tip-calculator',
    icon: '💵'
  },
  'currency-converter': {
    title: 'Currency Converter',
    titleAr: 'محول العملات',
    description: 'Convert currencies',
    descriptionAr: 'تحويل العملات',
    path: '/tools/currency-converter',
    icon: '💱'
  },
  'unit-converter': {
    title: 'Unit Converter',
    titleAr: 'محول الوحدات',
    description: 'Convert units',
    descriptionAr: 'تحويل الوحدات',
    path: '/tools/unit-converter',
    icon: '📏'
  },
  'bmi-calculator': {
    title: 'BMI Calculator',
    titleAr: 'حاسبة BMI',
    description: 'Calculate BMI',
    descriptionAr: 'حساب مؤشر كتلة الجسم',
    path: '/tools/bmi-calculator',
    icon: '⚖️'
  },
  'age-calculator': {
    title: 'Age Calculator',
    titleAr: 'حاسبة العمر',
    description: 'Calculate your age',
    descriptionAr: 'حساب عمرك',
    path: '/tools/age-calculator',
    icon: '🎂'
  },
}

/**
 * Get recommendations for a tool
 */
export function getRecommendationsForTool(toolId: string): ToolRecommendation[] {
  const relationships = TOOL_RELATIONSHIPS[toolId]
  if (!relationships) return []
  
  return relationships
    .filter(rel => TOOL_METADATA[rel.toolId])
    .map(rel => {
      const meta = TOOL_METADATA[rel.toolId]
      return {
        toolId: rel.toolId,
        title: meta.title,
        titleAr: meta.titleAr,
        description: meta.description,
        descriptionAr: meta.descriptionAr,
        path: meta.path,
        reason: rel.reason,
        reasonAr: rel.reasonAr,
        icon: meta.icon
      }
    })
}

/**
 * Track tool usage for smart recommendations
 */
export function trackToolUsage(toolId: string): void {
  try {
    const history = JSON.parse(localStorage.getItem('toolUsageHistory') || '[]')
    const newEntry = { toolId, timestamp: Date.now() }
    
    // Keep last 50 entries
    const updatedHistory = [newEntry, ...history].slice(0, 50)
    localStorage.setItem('toolUsageHistory', JSON.stringify(updatedHistory))
  } catch (e) {
    console.error('Failed to track tool usage:', e)
  }
}

/**
 * Get recently used tools
 */
export function getRecentTools(): string[] {
  try {
    const history = JSON.parse(localStorage.getItem('toolUsageHistory') || '[]')
    const uniqueTools = [...new Set(history.map((h: any) => h.toolId))]
    return uniqueTools.slice(0, 5) as string[]
  } catch {
    return []
  }
}

/**
 * 24Toolkit ChatBot Knowledge Base
 * Complete information about all tools, services, and contact info
 */

export const TOOLKIT_INFO = {
  name: '24Toolkit',
  description: {
    en: '80+ free online tools including AI-powered utilities, security tools, calculators, image editors, text utilities, and more. All tools work client-side in your browser - fast, private, no signup required.',
    ar: '80+ أداة مجانية على الإنترنت تشمل أدوات مدعومة بالذكاء الاصطناعي، أدوات الأمان، الآلات الحاسبة، محررات الصور، أدوات النصوص، والمزيد. جميع الأدوات تعمل في المتصفح - سريعة، خاصة، بدون تسجيل.'
  },
  url: 'https://www.24toolkit.com',
  features: {
    en: [
      '80+ free tools',
      'AI-powered utilities',
      'Client-side processing (private & secure)',
      'No signup required',
      'Works offline after first load',
      'Mobile-friendly',
      'Dark mode support',
      'Fast and responsive'
    ],
    ar: [
      '80+ أداة مجانية',
      'أدوات مدعومة بالذكاء الاصطناعي',
      'معالجة محلية (خصوصية وأمان)',
      'بدون تسجيل',
      'تعمل بدون إنترنت بعد التحميل الأول',
      'متوافقة مع الهواتف',
      'دعم الوضع الداكن',
      'سريعة ومستجيبة'
    ]
  }
}

export const TOOL_CATEGORIES = {
  ai: {
    name: { en: 'AI Tools', ar: 'أدوات الذكاء الاصطناعي' },
    tools: [
      {
        name: 'AI Translator',
        nameAr: 'مترجم ذكي',
        description: { 
          en: 'Translate text between multiple languages using AI',
          ar: 'ترجمة النصوص بين عدة لغات باستخدام الذكاء الاصطناعي'
        },
        path: '/tools/ai-translator',
        keywords: ['translate', 'translation', 'language', 'ترجمة', 'لغة']
      },
      {
        name: 'AI Email Writer',
        nameAr: 'كاتب البريد الإلكتروني',
        description: {
          en: 'Generate professional emails with AI assistance',
          ar: 'إنشاء رسائل بريد إلكتروني احترافية بمساعدة الذكاء الاصطناعي'
        },
        path: '/tools/ai-email-writer',
        keywords: ['email', 'write', 'compose', 'بريد', 'ايميل', 'رسالة']
      },
      {
        name: 'AI Hashtag Generator',
        nameAr: 'منشئ الهاشتاغ',
        description: {
          en: 'Generate relevant hashtags for social media posts',
          ar: 'إنشاء هاشتاغات ملائمة لمنشورات وسائل التواصل الاجتماعي'
        },
        path: '/tools/ai-hashtag-generator',
        keywords: ['hashtag', 'social media', 'instagram', 'twitter', 'هاشتاغ', 'تواصل']
      },
      {
        name: 'Text Summarizer',
        nameAr: 'ملخص النصوص',
        description: {
          en: 'Summarize long texts into key points using AI',
          ar: 'تلخيص النصوص الطويلة إلى نقاط رئيسية'
        },
        path: '/tools/text-summarizer',
        keywords: ['summarize', 'summary', 'shorten', 'ملخص', 'تلخيص']
      },
      {
        name: 'Paragraph Rewriter',
        nameAr: 'إعادة كتابة الفقرات',
        description: {
          en: 'Rewrite paragraphs while keeping the same meaning',
          ar: 'إعادة كتابة الفقرات مع الحفاظ على نفس المعنى'
        },
        path: '/tools/paragraph-rewriter',
        keywords: ['rewrite', 'paraphrase', 'rephrase', 'إعادة كتابة', 'صياغة']
      },
      {
        name: 'Image Caption Generator',
        nameAr: 'منشئ تعليقات الصور',
        description: {
          en: 'Generate captions for images using AI',
          ar: 'إنشاء تعليقات للصور باستخدام الذكاء الاصطناعي'
        },
        path: '/tools/image-caption-generator',
        keywords: ['caption', 'image', 'describe', 'تعليق', 'وصف', 'صورة']
      },
      {
        name: 'AI Task Builder',
        nameAr: 'منشئ المهام',
        description: {
          en: 'Break down projects into actionable tasks',
          ar: 'تقسيم المشاريع إلى مهام قابلة للتنفيذ'
        },
        path: '/tools/ai-task-builder',
        keywords: ['task', 'project', 'plan', 'مهمة', 'مشروع', 'خطة']
      },
      {
        name: 'Idea Analyzer',
        nameAr: 'محلل الأفكار',
        description: {
          en: 'Analyze and evaluate your ideas with AI',
          ar: 'تحليل وتقييم أفكارك بالذكاء الاصطناعي'
        },
        path: '/tools/idea-analyzer',
        keywords: ['idea', 'analyze', 'evaluate', 'فكرة', 'تحليل', 'تقييم']
      },
      {
        name: 'Grammar Corrector',
        nameAr: 'مصحح القواعد',
        description: {
          en: 'Check and correct grammar mistakes',
          ar: 'فحص وتصحيح الأخطاء النحوية'
        },
        path: '/tools/grammar-corrector',
        keywords: ['grammar', 'spell', 'correct', 'قواعد', 'إملاء', 'تصحيح']
      }
    ]
  },
  security: {
    name: { en: 'Security Tools', ar: 'أدوات الأمان' },
    tools: [
      {
        name: 'Hash Generator',
        nameAr: 'منشئ الهاش',
        description: {
          en: 'Generate MD5, SHA-1, SHA-256 hashes',
          ar: 'إنشاء هاش MD5, SHA-1, SHA-256'
        },
        path: '/tools/hash-generator',
        keywords: ['hash', 'md5', 'sha', 'encrypt', 'هاش', 'تشفير']
      },
      {
        name: 'Password Generator',
        nameAr: 'منشئ كلمات المرور',
        description: {
          en: 'Generate strong random passwords',
          ar: 'إنشاء كلمات مرور قوية وعشوائية'
        },
        path: '/tools/password-generator',
        keywords: ['password', 'secure', 'random', 'كلمة مرور', 'آمن']
      },
      {
        name: 'Password Strength Checker',
        nameAr: 'فاحص قوة كلمة المرور',
        description: {
          en: 'Check how strong your password is',
          ar: 'فحص قوة كلمة المرور الخاصة بك'
        },
        path: '/tools/password-strength-checker',
        keywords: ['password', 'strength', 'check', 'security', 'قوة', 'فحص']
      },
      {
        name: 'SSL Checker',
        nameAr: 'فاحص SSL',
        description: {
          en: 'Check SSL certificate information',
          ar: 'فحص معلومات شهادة SSL'
        },
        path: '/tools/ssl-checker',
        keywords: ['ssl', 'certificate', 'https', 'security', 'شهادة', 'أمان']
      }
    ]
  },
  calculators: {
    name: { en: 'Calculators', ar: 'الآلات الحاسبة' },
    tools: [
      {
        name: 'Percentage Calculator',
        nameAr: 'حاسبة النسبة المئوية',
        description: {
          en: 'Calculate percentages, increases, decreases',
          ar: 'حساب النسب المئوية والزيادات والنقصان'
        },
        path: '/tools/percentage-calculator',
        keywords: ['percentage', 'percent', 'calculate', 'نسبة', 'مئوية', 'حساب']
      },
      {
        name: 'Age Calculator',
        nameAr: 'حاسبة العمر',
        description: {
          en: 'Calculate age from date of birth',
          ar: 'حساب العمر من تاريخ الميلاد'
        },
        path: '/tools/age-calculator',
        keywords: ['age', 'birthday', 'date', 'عمر', 'ميلاد', 'تاريخ']
      },
      {
        name: 'BMI Calculator',
        nameAr: 'حاسبة مؤشر كتلة الجسم',
        description: {
          en: 'Calculate Body Mass Index',
          ar: 'حساب مؤشر كتلة الجسم'
        },
        path: '/tools/bmi-calculator',
        keywords: ['bmi', 'body', 'mass', 'health', 'وزن', 'صحة', 'جسم']
      },
      {
        name: 'Tip Calculator',
        nameAr: 'حاسبة الإكرامية',
        description: {
          en: 'Calculate tips and split bills',
          ar: 'حساب الإكرامية وتقسيم الفواتير'
        },
        path: '/tools/tip-calculator',
        keywords: ['tip', 'restaurant', 'bill', 'split', 'إكرامية', 'فاتورة']
      },
      {
        name: 'Discount Calculator',
        nameAr: 'حاسبة الخصم',
        description: {
          en: 'Calculate discounts and final prices',
          ar: 'حساب الخصومات والأسعار النهائية'
        },
        path: '/tools/discount-calculator',
        keywords: ['discount', 'sale', 'price', 'خصم', 'تخفيض', 'سعر']
      },
      {
        name: 'Currency Converter',
        nameAr: 'محول العملات',
        description: {
          en: 'Convert between different currencies',
          ar: 'تحويل بين العملات المختلفة'
        },
        path: '/tools/currency-converter',
        keywords: ['currency', 'money', 'exchange', 'convert', 'عملة', 'تحويل']
      }
    ]
  },
  image: {
    name: { en: 'Image Tools', ar: 'أدوات الصور' },
    tools: [
      {
        name: 'Image Compressor',
        nameAr: 'ضاغط الصور',
        description: {
          en: 'Reduce image file size without losing quality',
          ar: 'تقليل حجم ملف الصورة دون فقدان الجودة'
        },
        path: '/tools/image-compressor',
        keywords: ['compress', 'reduce', 'size', 'image', 'ضغط', 'تقليل', 'صورة']
      },
      {
        name: 'Image Resizer',
        nameAr: 'تغيير حجم الصور',
        description: {
          en: 'Resize images to specific dimensions',
          ar: 'تغيير حجم الصور لأبعاد محددة'
        },
        path: '/tools/image-resizer',
        keywords: ['resize', 'scale', 'dimensions', 'تغيير', 'حجم', 'أبعاد']
      },
      {
        name: 'Image Cropper',
        nameAr: 'قص الصور',
        description: {
          en: 'Crop and trim images',
          ar: 'قص وتشذيب الصور'
        },
        path: '/tools/image-cropper',
        keywords: ['crop', 'trim', 'cut', 'قص', 'تشذيب']
      },
      {
        name: 'Background Remover',
        nameAr: 'إزالة الخلفية',
        description: {
          en: 'Remove background from images',
          ar: 'إزالة الخلفية من الصور'
        },
        path: '/tools/background-remover',
        keywords: ['background', 'remove', 'transparent', 'خلفية', 'إزالة', 'شفاف']
      },
      {
        name: 'Image Filter Editor',
        nameAr: 'محرر فلاتر الصور',
        description: {
          en: 'Apply filters and effects to images',
          ar: 'تطبيق الفلاتر والتأثيرات على الصور'
        },
        path: '/tools/image-filter-editor',
        keywords: ['filter', 'effect', 'edit', 'فلتر', 'تأثير', 'تحرير']
      },
      {
        name: 'Watermark Adder',
        nameAr: 'إضافة العلامة المائية',
        description: {
          en: 'Add watermarks to protect your images',
          ar: 'إضافة علامة مائية لحماية صورك'
        },
        path: '/tools/watermark-adder',
        keywords: ['watermark', 'protect', 'brand', 'علامة', 'حماية']
      },
      {
        name: 'Image Format Converter',
        nameAr: 'محول صيغ الصور',
        description: {
          en: 'Convert images between formats (JPG, PNG, WebP)',
          ar: 'تحويل الصور بين الصيغ المختلفة'
        },
        path: '/tools/image-format-converter',
        keywords: ['convert', 'format', 'jpg', 'png', 'webp', 'تحويل', 'صيغة']
      },
      {
        name: 'Image to Text (OCR)',
        nameAr: 'صورة إلى نص',
        description: {
          en: 'Extract text from images using OCR',
          ar: 'استخراج النص من الصور'
        },
        path: '/tools/image-to-text',
        keywords: ['ocr', 'text', 'extract', 'scan', 'استخراج', 'نص', 'مسح']
      },
      {
        name: 'Meme Generator',
        nameAr: 'منشئ الميمز',
        description: {
          en: 'Create memes with custom text',
          ar: 'إنشاء ميمز بنص مخصص'
        },
        path: '/tools/meme-generator',
        keywords: ['meme', 'funny', 'create', 'ميم', 'طريف']
      }
    ]
  },
  text: {
    name: { en: 'Text Tools', ar: 'أدوات النصوص' },
    tools: [
      {
        name: 'Word Counter',
        nameAr: 'عداد الكلمات',
        description: {
          en: 'Count words, characters, and reading time',
          ar: 'عد الكلمات والأحرف ووقت القراءة'
        },
        path: '/tools/word-counter',
        keywords: ['word', 'count', 'character', 'عد', 'كلمة', 'حرف']
      },
      {
        name: 'Text Case Converter',
        nameAr: 'محول حالة النص',
        description: {
          en: 'Convert text to uppercase, lowercase, title case',
          ar: 'تحويل النص لأحرف كبيرة أو صغيرة'
        },
        path: '/tools/text-case-converter',
        keywords: ['case', 'upper', 'lower', 'capitalize', 'أحرف', 'تحويل']
      },
      {
        name: 'Find and Replace',
        nameAr: 'بحث واستبدال',
        description: {
          en: 'Find and replace text in bulk',
          ar: 'بحث واستبدال النص بالجملة'
        },
        path: '/tools/find-replace',
        keywords: ['find', 'replace', 'search', 'بحث', 'استبدال', 'بديل']
      },
      {
        name: 'Text Diff Checker',
        nameAr: 'مقارن النصوص',
        description: {
          en: 'Compare two texts and find differences',
          ar: 'مقارنة نصين وإيجاد الاختلافات'
        },
        path: '/tools/text-diff-checker',
        keywords: ['diff', 'compare', 'difference', 'مقارنة', 'فرق', 'اختلاف']
      }
    ]
  },
  developer: {
    name: { en: 'Developer Tools', ar: 'أدوات المطورين' },
    tools: [
      {
        name: 'Code Formatter',
        nameAr: 'منسق الكود',
        description: {
          en: 'Format and beautify code (JS, CSS, HTML, JSON)',
          ar: 'تنسيق وتجميل الكود'
        },
        path: '/tools/code-formatter',
        keywords: ['code', 'format', 'beautify', 'كود', 'تنسيق', 'برمجة']
      },
      {
        name: 'JSON to CSV Converter',
        nameAr: 'محول JSON إلى CSV',
        description: {
          en: 'Convert JSON data to CSV format',
          ar: 'تحويل بيانات JSON إلى CSV'
        },
        path: '/tools/json-csv-converter',
        keywords: ['json', 'csv', 'convert', 'data', 'تحويل', 'بيانات']
      },
      {
        name: 'Color Picker',
        nameAr: 'منتقي الألوان',
        description: {
          en: 'Pick colors and get HEX, RGB, HSL codes',
          ar: 'اختيار الألوان والحصول على أكواد HEX و RGB'
        },
        path: '/tools/color-picker',
        keywords: ['color', 'picker', 'hex', 'rgb', 'لون', 'اختيار']
      },
      {
        name: 'QR Code Generator',
        nameAr: 'منشئ رمز QR',
        description: {
          en: 'Generate QR codes from text or URLs',
          ar: 'إنشاء رموز QR من النص أو الروابط'
        },
        path: '/tools/qr-generator',
        keywords: ['qr', 'code', 'generate', 'barcode', 'رمز', 'باركود']
      },
      {
        name: 'Unit Converter',
        nameAr: 'محول الوحدات',
        description: {
          en: 'Convert between different units',
          ar: 'تحويل بين الوحدات المختلفة'
        },
        path: '/tools/unit-converter',
        keywords: ['unit', 'convert', 'measurement', 'وحدة', 'تحويل', 'قياس']
      }
    ]
  },
  productivity: {
    name: { en: 'Productivity Tools', ar: 'أدوات الإنتاجية' },
    tools: [
      {
        name: 'Pomodoro Timer',
        nameAr: 'مؤقت بومودورو',
        description: {
          en: 'Focus timer using Pomodoro technique',
          ar: 'مؤقت تركيز بتقنية بومودورو'
        },
        path: '/tools/pomodoro-timer',
        keywords: ['pomodoro', 'timer', 'focus', 'productivity', 'تركيز', 'إنتاجية']
      },
      {
        name: 'Stopwatch',
        nameAr: 'ساعة إيقاف',
        description: {
          en: 'Simple stopwatch with lap tracking',
          ar: 'ساعة إيقاف بسيطة مع تتبع اللفات'
        },
        path: '/tools/stopwatch',
        keywords: ['stopwatch', 'timer', 'track', 'ساعة', 'مؤقت']
      },
      {
        name: 'Notepad',
        nameAr: 'مفكرة',
        description: {
          en: 'Quick notes with auto-save',
          ar: 'ملاحظات سريعة مع الحفظ التلقائي'
        },
        path: '/tools/notepad',
        keywords: ['note', 'notepad', 'write', 'ملاحظة', 'مفكرة', 'كتابة']
      },
      {
        name: 'Daily Planner',
        nameAr: 'مخطط يومي',
        description: {
          en: 'Plan your daily tasks and schedule',
          ar: 'خطط مهامك وجدولك اليومي'
        },
        path: '/tools/daily-planner-template',
        keywords: ['planner', 'schedule', 'task', 'daily', 'مخطط', 'جدول', 'مهام']
      }
    ]
  }
}

export const CONTACT_INFO = {
  email: {
    en: 'For support or inquiries, email us at: support@24toolkit.com',
    ar: 'للدعم أو الاستفسارات، راسلنا على: support@24toolkit.com'
  },
  social: {
    twitter: '@24Toolkit',
    github: 'github.com/NN224/24toolkit'
  },
  pages: {
    about: {
      en: 'Learn more about us at /about',
      ar: 'اعرف المزيد عنا في /about'
    },
    privacy: {
      en: 'Privacy Policy at /privacy-policy',
      ar: 'سياسة الخصوصية في /privacy-policy'
    },
    terms: {
      en: 'Terms of Service at /terms-of-service',
      ar: 'شروط الخدمة في /terms-of-service'
    },
    contact: {
      en: 'Contact page at /contact',
      ar: 'صفحة التواصل في /contact'
    }
  }
}

export const FAQ = {
  en: [
    {
      q: 'Is 24Toolkit really free?',
      a: 'Yes! All 80+ tools are completely free to use. No hidden fees, no subscriptions, no signup required.'
    },
    {
      q: 'Do I need to create an account?',
      a: 'No! All tools work without any registration. Just visit and start using.'
    },
    {
      q: 'Is my data safe?',
      a: 'Absolutely! All tools process data locally in your browser. We never send your data to our servers. Your privacy is our priority.'
    },
    {
      q: 'Can I use it offline?',
      a: 'Yes! After the first load, most tools work offline thanks to PWA technology.'
    },
    {
      q: 'What browsers are supported?',
      a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and mobile browsers.'
    },
    {
      q: 'How do I report a bug?',
      a: 'Email us at support@24toolkit.com or visit /contact page.'
    }
  ],
  ar: [
    {
      q: 'هل 24Toolkit مجاني حقاً؟',
      a: 'نعم! جميع الـ 80+ أداة مجانية تماماً. بدون رسوم خفية، بدون اشتراكات، بدون تسجيل.'
    },
    {
      q: 'هل أحتاج لإنشاء حساب؟',
      a: 'لا! جميع الأدوات تعمل بدون أي تسجيل. فقط زر واستخدم.'
    },
    {
      q: 'هل بياناتي آمنة؟',
      a: 'بالتأكيد! جميع الأدوات تعالج البيانات محلياً في متصفحك. نحن لا نرسل بياناتك لخوادمنا أبداً. خصوصيتك أولويتنا.'
    },
    {
      q: 'هل يمكنني استخدامه بدون إنترنت؟',
      a: 'نعم! بعد التحميل الأول، معظم الأدوات تعمل بدون إنترنت بفضل تقنية PWA.'
    },
    {
      q: 'ما هي المتصفحات المدعومة؟',
      a: 'جميع المتصفحات الحديثة: Chrome, Firefox, Safari, Edge، ومتصفحات الهواتف.'
    },
    {
      q: 'كيف أبلغ عن خطأ؟',
      a: 'راسلنا على support@24toolkit.com أو زر صفحة /contact'
    }
  ]
}

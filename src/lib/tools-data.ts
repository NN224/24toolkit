import {
  TextT,
  LockKey,
  QrCode,
  ArrowsLeftRight,
  ImageSquare,
  Sparkle,
  SpeakerHigh,
  FilePdf,
  Palette,
  TextAlignLeft,
  Calculator,
  Brain,
  PencilLine,
  Code,
  Image,
  ChatCircleDots,
  TextAa,
  ArrowsDownUp,
  ChartBar,
  MagnifyingGlass,
  Smiley,
  GitDiff,
  ArrowsClockwise,
  CheckCircle,
  BookOpen,
  ListNumbers,
  BracketsAngle,
  FileMagnifyingGlass,
  Lock,
  Link as LinkIcon,
  Fingerprint,
  Clock,
  Key,
  ShieldCheck,
  FileDoc,
  Scissors,
  Eraser,
  SlidersHorizontal,
  Sticker,
  ImageBroken,
  ArrowsOut,
  Drop,
  Percent,
  Receipt,
  CurrencyDollar,
  NetworkSlash,
  CalendarBlank,
  Globe,
  Envelope,
  Hash,
  Timer,
  Notepad,
  ListBullets,
  Lightbulb,
  ListChecks,
  Lightning
} from '@phosphor-icons/react'

export interface Tool {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  icon: any
  path: string
  color: string
  category: string
  isAI?: boolean
}

export const allTools: Tool[] = [
  {
    id: 'multi-tool-chat',
    title: 'Multi-Tool AI Chat',
    titleAr: 'دردشة ذكية متعددة الأدوات',
    description: 'Chat with AI that uses multiple tools automatically',
    descriptionAr: 'تحدث مع ذكاء اصطناعي يستخدم أدوات متعددة تلقائياً',
    icon: ChatCircleDots,
    path: '/tools/multi-tool-chat',
    color: 'from-purple-500 to-sky-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'smart-history',
    title: 'Smart History',
    titleAr: 'السجل الذكي',
    description: 'View and reuse your past AI tool results',
    descriptionAr: 'عرض وإعادة استخدام نتائج أدوات الذكاء الاصطناعي السابقة',
    icon: Clock,
    path: '/tools/smart-history',
    color: 'from-sky-500 to-purple-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-prompt-presets',
    title: 'AI Prompt Presets',
    titleAr: 'قوالب الأوامر الذكية',
    description: 'Ready-made templates to save time with AI tools',
    descriptionAr: 'قوالب جاهزة لتوفير الوقت مع أدوات الذكاء الاصطناعي',
    icon: Lightning,
    path: '/tools/ai-prompt-presets',
    color: 'from-yellow-500 to-orange-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-usage-dashboard',
    title: 'AI Usage Dashboard',
    titleAr: 'لوحة استخدام الذكاء الاصطناعي',
    description: 'Track your AI usage with insights and personalized recommendations',
    descriptionAr: 'تتبع استخدامك للذكاء الاصطناعي مع رؤى وتوصيات مخصصة',
    icon: ChartBar,
    path: '/tools/ai-usage-dashboard',
    color: 'from-purple-600 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-tool-chains',
    title: 'AI Tool Chains',
    titleAr: 'سلاسل أدوات الذكاء الاصطناعي',
    description: 'Connect multiple AI tools in automated workflows',
    descriptionAr: 'ربط أدوات ذكاء اصطناعي متعددة في تدفقات عمل آلية',
    icon: Lightning,
    path: '/tools/ai-tool-chains',
    color: 'from-purple-600 to-sky-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-task-builder',
    title: 'AI Task Builder',
    titleAr: 'منشئ المهام بالذكاء الاصطناعي',
    description: 'Turn any goal into a step-by-step plan with AI.',
    descriptionAr: 'حول أي هدف إلى خطة خطوة بخطوة مع الذكاء الاصطناعي.',
    icon: ListChecks,
    path: '/tools/ai-task-builder',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-idea-analyzer',
    title: 'AI Idea Analyzer',
    titleAr: 'محلل الأفكار بالذكاء الاصطناعي',
    description: 'Get instant feedback on your next big idea from an AI expert.',
    descriptionAr: 'احصل على ملاحظات فورية حول فكرتك الكبيرة التالية من خبير ذكاء اصطناعي.',
    icon: Lightbulb,
    path: '/tools/idea-analyzer',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'text-summarizer',
    title: 'AI Text Summarizer',
    titleAr: 'ملخص النصوص بالذكاء الاصطناعي',
    description: 'Transform long articles into concise summaries',
    descriptionAr: 'حول المقالات الطويلة إلى ملخصات موجزة',
    icon: Brain,
    path: '/tools/text-summarizer',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'paragraph-rewriter',
    title: 'AI Paragraph Rewriter',
    titleAr: 'معيد كتابة الفقرات بالذكاء الاصطناعي',
    description: 'Rephrase text while maintaining meaning',
    descriptionAr: 'أعد صياغة النص مع الحفاظ على المعنى',
    icon: PencilLine,
    path: '/tools/paragraph-rewriter',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'code-formatter',
    title: 'AI Code Formatter',
    titleAr: 'منسق الكود بالذكاء الاصطناعي',
    description: 'Beautify and explain code with AI',
    descriptionAr: 'جمّل واشرح الكود بالذكاء الاصطناعي',
    icon: Code,
    path: '/tools/code-formatter',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'image-caption-generator',
    title: 'AI Image Caption',
    titleAr: 'منشئ التعليقات التوضيحية للصور',
    description: 'Generate descriptions for images',
    descriptionAr: 'توليد أوصاف للصور',
    icon: Image,
    path: '/tools/image-caption-generator',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'grammar-corrector',
    title: 'AI Grammar Corrector',
    titleAr: 'مصحح القواعد بالذكاء الاصطناعي',
    description: 'Fix grammar, spelling, and style errors',
    descriptionAr: 'إصلاح أخطاء القواعد والإملاء والأسلوب',
    icon: CheckCircle,
    path: '/tools/grammar-corrector',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-translator',
    title: 'AI Translator',
    titleAr: 'المترجم الذكي',
    description: 'Translate text between multiple languages',
    descriptionAr: 'ترجمة النصوص بين عدة لغات',
    icon: Globe,
    path: '/tools/ai-translator',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-email-writer',
    title: 'AI Email Writer',
    titleAr: 'كاتب البريد الإلكتروني بالذكاء الاصطناعي',
    description: 'Generate professional emails with AI',
    descriptionAr: 'توليد رسائل بريد إلكتروني احترافية بالذكاء الاصطناعي',
    icon: Envelope,
    path: '/tools/ai-email-writer',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-hashtag-generator',
    title: 'AI Hashtag Generator',
    titleAr: 'منشئ الهاشتاغ بالذكاء الاصطناعي',
    description: 'Create trending hashtags for social media',
    descriptionAr: 'إنشاء هاشتاغات رائجة لوسائل التواصل الاجتماعي',
    icon: Hash,
    path: '/tools/ai-hashtag-generator',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    titleAr: 'عداد الكلمات',
    description: 'Count words, characters, and reading time',
    descriptionAr: 'عد الكلمات والأحرف ووقت القراءة',
    icon: TextT,
    path: '/tools/word-counter',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    titleAr: 'محول حالة النص',
    description: 'Convert text between multiple case formats',
    descriptionAr: 'تحويل النص بين صيغ حالة متعددة',
    icon: TextAa,
    path: '/tools/text-case-converter',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'remove-line-breaks',
    title: 'Remove Line Breaks',
    titleAr: 'إزالة فواصل الأسطر',
    description: 'Clean up text by removing extra spaces',
    descriptionAr: 'تنظيف النص بإزالة المسافات الزائدة',
    icon: ArrowsDownUp,
    path: '/tools/remove-line-breaks',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'word-frequency-analyzer',
    title: 'Word Frequency Analyzer',
    titleAr: 'محلل تكرار الكلمات',
    description: 'Analyze most frequently used words',
    descriptionAr: 'تحليل الكلمات الأكثر استخداماً',
    icon: ChartBar,
    path: '/tools/word-frequency-analyzer',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'find-replace',
    title: 'Find & Replace',
    titleAr: 'البحث والاستبدال',
    description: 'Search and replace text with regex support',
    descriptionAr: 'البحث واستبدال النص مع دعم التعبيرات النمطية',
    icon: MagnifyingGlass,
    path: '/tools/find-replace',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'emoji-tool',
    title: 'Emoji Tool',
    titleAr: 'أداة الإيموجي',
    description: 'Add or remove emojis from text',
    descriptionAr: 'إضافة أو إزالة الإيموجي من النص',
    icon: Smiley,
    path: '/tools/emoji-tool',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'text-diff-checker',
    title: 'Text Diff Checker',
    titleAr: 'مقارن النصوص',
    description: 'Compare two texts with highlighting',
    descriptionAr: 'مقارنة نصين مع تمييز الاختلافات',
    icon: GitDiff,
    path: '/tools/text-diff-checker',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'text-reverser',
    title: 'Text Reverser',
    titleAr: 'عاكس النص',
    description: 'Reverse text in multiple modes',
    descriptionAr: 'عكس النص بطرق متعددة',
    icon: ArrowsClockwise,
    path: '/tools/text-reverser',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'palindrome-checker',
    title: 'Palindrome Checker',
    titleAr: 'التحقق من المتناظر',
    description: 'Check if text is a palindrome',
    descriptionAr: 'التحقق مما إذا كان النص متناظراً',
    icon: CheckCircle,
    path: '/tools/palindrome-checker',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'sentence-counter',
    title: 'Sentence Counter',
    titleAr: 'عداد الجمل',
    description: 'Count sentences with detailed analysis',
    descriptionAr: 'عد الجمل مع تحليل مفصل',
    icon: ListNumbers,
    path: '/tools/sentence-counter',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter',
    titleAr: 'منسق HTML',
    description: 'Beautify and format HTML code',
    descriptionAr: 'تجميل وتنسيق كود HTML',
    icon: BracketsAngle,
    path: '/tools/html-formatter',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    titleAr: 'مختبر التعبيرات النمطية',
    description: 'Test regular expressions live',
    descriptionAr: 'اختبار التعبيرات النمطية مباشرة',
    icon: FileMagnifyingGlass,
    path: '/tools/regex-tester',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'json-beautifier',
    title: 'JSON Beautifier',
    titleAr: 'منسق JSON',
    description: 'Format and validate JSON data',
    descriptionAr: 'تنسيق والتحقق من صحة بيانات JSON',
    icon: Code,
    path: '/tools/json-beautifier',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'base64-tool',
    title: 'Base64 Encoder/Decoder',
    titleAr: 'مشفر/فك تشفير Base64',
    description: 'Encode and decode Base64 strings',
    descriptionAr: 'تشفير وفك تشفير سلاسل Base64',
    icon: Lock,
    path: '/tools/base64-tool',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'url-encoder-decoder',
    title: 'URL Encoder/Decoder',
    titleAr: 'مشفر/فك تشفير URL',
    description: 'Encode and decode URLs',
    descriptionAr: 'تشفير وفك تشفير عناوين URL',
    icon: LinkIcon,
    path: '/tools/url-encoder-decoder',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    titleAr: 'مولد UUID',
    description: 'Generate unique identifiers',
    descriptionAr: 'توليد معرفات فريدة',
    icon: Fingerprint,
    path: '/tools/uuid-generator',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    titleAr: 'محول الطوابع الزمنية',
    description: 'Convert between timestamps and dates',
    descriptionAr: 'التحويل بين الطوابع الزمنية والتواريخ',
    icon: Clock,
    path: '/tools/timestamp-converter',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    titleAr: 'فك تشفير JWT',
    description: 'Decode and inspect JWT tokens',
    descriptionAr: 'فك تشفير وفحص رموز JWT',
    icon: Key,
    path: '/tools/jwt-decoder',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'markdown-previewer',
    title: 'Markdown Previewer',
    titleAr: 'عارض Markdown',
    description: 'Preview markdown in real-time',
    descriptionAr: 'معاينة Markdown في الوقت الفعلي',
    icon: BookOpen,
    path: '/tools/markdown-previewer',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'json-csv-converter',
    title: 'JSON ⇄ CSV',
    titleAr: 'محول JSON ⇄ CSV',
    description: 'Convert between JSON and CSV formats',
    descriptionAr: 'التحويل بين صيغ JSON و CSV',
    icon: ArrowsLeftRight,
    path: '/tools/json-csv-converter',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    titleAr: 'مغيّر حجم الصور',
    description: 'Resize images with custom dimensions',
    descriptionAr: 'تغيير حجم الصور بأبعاد مخصصة',
    icon: ArrowsOut,
    path: '/tools/image-resizer',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    titleAr: 'قاص الصور',
    description: 'Crop images with drag-and-drop',
    descriptionAr: 'قص الصور بالسحب والإفلات',
    icon: Scissors,
    path: '/tools/image-cropper',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'background-remover',
    title: 'Background Remover',
    titleAr: 'مزيل الخلفية',
    description: 'Remove image backgrounds automatically',
    descriptionAr: 'إزالة خلفيات الصور تلقائياً',
    icon: ImageBroken,
    path: '/tools/background-remover',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-filter-editor',
    title: 'Image Filter Editor',
    titleAr: 'محرر فلاتر الصور',
    description: 'Apply filters and effects to images',
    descriptionAr: 'تطبيق فلاتر وتأثيرات على الصور',
    icon: SlidersHorizontal,
    path: '/tools/image-filter-editor',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'watermark-adder',
    title: 'Watermark Adder',
    titleAr: 'مضيف العلامة المائية',
    description: 'Add text or image watermarks',
    descriptionAr: 'إضافة علامات مائية نصية أو صورية',
    icon: Drop,
    path: '/tools/watermark-adder',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'meme-generator',
    title: 'Meme Generator',
    titleAr: 'مولد الميمات',
    description: 'Create memes with custom text',
    descriptionAr: 'إنشاء ميمات بنص مخصص',
    icon: Sticker,
    path: '/tools/meme-generator',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-format-converter',
    title: 'Image Format Converter',
    titleAr: 'محول صيغ الصور',
    description: 'Convert between image formats',
    descriptionAr: 'التحويل بين صيغ الصور',
    icon: ImageSquare,
    path: '/tools/image-format-converter',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-rotator',
    title: 'Image Rotator',
    titleAr: 'دوار الصور',
    description: 'Rotate and flip images',
    descriptionAr: 'تدوير وقلب الصور',
    icon: ArrowsClockwise,
    path: '/tools/image-rotator',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-color-extractor',
    title: 'Image Color Extractor',
    titleAr: 'مستخرج ألوان الصور',
    description: 'Extract color palette from images',
    descriptionAr: 'استخراج لوحة ألوان من الصور',
    icon: Palette,
    path: '/tools/image-color-extractor',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    titleAr: 'ضاغط الصور',
    description: 'Reduce image file sizes',
    descriptionAr: 'تقليل أحجام ملفات الصور',
    icon: ImageSquare,
    path: '/tools/image-compressor',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-to-text',
    title: 'Image to Text (OCR)',
    titleAr: 'صورة إلى نص (OCR)',
    description: 'Extract text from images',
    descriptionAr: 'استخراج النص من الصور',
    icon: TextAlignLeft,
    path: '/tools/image-to-text',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    titleAr: 'مولد التجزئة',
    description: 'Generate cryptographic hashes',
    descriptionAr: 'توليد تجزئات تشفيرية',
    icon: Fingerprint,
    path: '/tools/hash-generator',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'password-strength-checker',
    title: 'Password Strength Checker',
    titleAr: 'متحقق قوة كلمة المرور',
    description: 'Analyze password security',
    descriptionAr: 'تحليل أمان كلمة المرور',
    icon: ShieldCheck,
    path: '/tools/password-strength-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'file-hash-verifier',
    title: 'File Hash Verifier',
    titleAr: 'متحقق تجزئة الملفات',
    description: 'Verify file integrity with hashes',
    descriptionAr: 'التحقق من سلامة الملفات بالتجزئات',
    icon: FileDoc,
    path: '/tools/file-hash-verifier',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'url-phishing-checker',
    title: 'URL Phishing Checker',
    titleAr: 'متحقق التصيد الاحتيالي',
    description: 'Check URLs for phishing indicators',
    descriptionAr: 'التحقق من عناوين URL لمؤشرات التصيد الاحتيالي',
    icon: NetworkSlash,
    path: '/tools/url-phishing-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'aes-encryptor',
    title: 'AES Encryptor',
    titleAr: 'مشفر AES',
    description: 'Encrypt and decrypt text with AES',
    descriptionAr: 'تشفير وفك تشفير النص باستخدام AES',
    icon: Lock,
    path: '/tools/aes-encryptor',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'secure-password-generator',
    title: 'Secure Password Generator',
    titleAr: 'مولد كلمات مرور آمنة',
    description: 'Generate cryptographically secure passwords',
    descriptionAr: 'توليد كلمات مرور آمنة تشفيرياً',
    icon: Key,
    path: '/tools/secure-password-generator',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'ssl-checker',
    title: 'SSL Certificate Checker',
    titleAr: 'متحقق شهادة SSL',
    description: 'Verify SSL certificate details',
    descriptionAr: 'التحقق من تفاصيل شهادة SSL',
    icon: ShieldCheck,
    path: '/tools/ssl-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'text-encryptor',
    title: 'Text Encryptor',
    titleAr: 'مشفر النص',
    description: 'Simple text encryption and decryption',
    descriptionAr: 'تشفير وفك تشفير نص بسيط',
    icon: Lock,
    path: '/tools/text-encryptor',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'ip-blacklist-checker',
    title: 'IP Blacklist Checker',
    titleAr: 'متحقق القائمة السوداء لـ IP',
    description: 'Check if IP is blacklisted',
    descriptionAr: 'التحقق مما إذا كان IP في القائمة السوداء',
    icon: NetworkSlash,
    path: '/tools/ip-blacklist-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    titleAr: 'حاسبة النسب المئوية',
    description: 'Calculate percentages easily',
    descriptionAr: 'حساب النسب المئوية بسهولة',
    icon: Percent,
    path: '/tools/percentage-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    titleAr: 'حاسبة العمر',
    description: 'Calculate age from birth date',
    descriptionAr: 'حساب العمر من تاريخ الميلاد',
    icon: CalendarBlank,
    path: '/tools/age-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    titleAr: 'حاسبة مؤشر كتلة الجسم',
    description: 'Calculate Body Mass Index',
    descriptionAr: 'حساب مؤشر كتلة الجسم',
    icon: Calculator,
    path: '/tools/bmi-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'tip-calculator',
    title: 'Tip Calculator',
    titleAr: 'حاسبة البقشيش',
    description: 'Calculate tips and split bills',
    descriptionAr: 'حساب البقشيش وتقسيم الفواتير',
    icon: Receipt,
    path: '/tools/tip-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'discount-calculator',
    title: 'Discount Calculator',
    titleAr: 'حاسبة الخصومات',
    description: 'Calculate discounts and final prices',
    descriptionAr: 'حساب الخصومات والأسعار النهائية',
    icon: CurrencyDollar,
    path: '/tools/discount-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    titleAr: 'محول العملات',
    description: 'Convert between currencies',
    descriptionAr: 'التحويل بين العملات',
    icon: CurrencyDollar,
    path: '/tools/currency-converter',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    titleAr: 'محول الوحدات',
    description: 'Convert between various units',
    descriptionAr: 'التحويل بين وحدات مختلفة',
    icon: ArrowsLeftRight,
    path: '/tools/unit-converter',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    titleAr: 'مولد كلمات المرور',
    description: 'Generate secure random passwords',
    descriptionAr: 'توليد كلمات مرور عشوائية آمنة',
    icon: LockKey,
    path: '/tools/password-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    titleAr: 'مولد رمز QR',
    description: 'Create QR codes instantly',
    descriptionAr: 'إنشاء رموز QR فوراً',
    icon: QrCode,
    path: '/tools/qr-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    titleAr: 'منتقي الألوان',
    description: 'Pick and generate color palettes',
    descriptionAr: 'اختيار وتوليد لوحات ألوان',
    icon: Palette,
    path: '/tools/color-picker',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'random-quote-generator',
    title: 'Random Quote Generator',
    titleAr: 'مولد الاقتباسات العشوائية',
    description: 'Get inspiring random quotes',
    descriptionAr: 'الحصول على اقتباسات عشوائية ملهمة',
    icon: Sparkle,
    path: '/tools/random-quote-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'random-name-generator',
    title: 'Random Name Generator',
    titleAr: 'مولد الأسماء العشوائية',
    description: 'Generate random names',
    descriptionAr: 'توليد أسماء عشوائية',
    icon: Sparkle,
    path: '/tools/random-name-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    titleAr: 'مولد Lorem Ipsum',
    description: 'Generate placeholder text',
    descriptionAr: 'توليد نص تجريبي',
    icon: TextT,
    path: '/tools/lorem-ipsum-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'random-number-picker',
    title: 'Random Number Picker',
    titleAr: 'منتقي الأرقام العشوائية',
    description: 'Pick random numbers',
    descriptionAr: 'اختيار أرقام عشوائية',
    icon: Sparkle,
    path: '/tools/random-number-picker',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'dice-roller-coin-flipper',
    title: 'Dice Roller & Coin Flipper',
    titleAr: 'رمي النرد وقلب العملة',
    description: 'Roll dice and flip coins',
    descriptionAr: 'رمي النرد وقلب العملة',
    icon: Sparkle,
    path: '/tools/dice-roller-coin-flipper',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'countdown-timer',
    title: 'Countdown Timer',
    titleAr: 'مؤقت العد التنازلي',
    description: 'Create custom countdown timers',
    descriptionAr: 'إنشاء مؤقتات عد تنازلي مخصصة',
    icon: Timer,
    path: '/tools/countdown-timer',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'stopwatch',
    title: 'Stopwatch',
    titleAr: 'ساعة الإيقاف',
    description: 'Precise time tracking',
    descriptionAr: 'تتبع الوقت بدقة',
    icon: Clock,
    path: '/tools/stopwatch',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    titleAr: 'مؤقت بومودورو',
    description: 'Focus timer with work/break intervals',
    descriptionAr: 'مؤقت تركيز مع فترات عمل/راحة',
    icon: Timer,
    path: '/tools/pomodoro-timer',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'notepad',
    title: 'Notepad',
    titleAr: 'المفكرة',
    description: 'Quick note taking',
    descriptionAr: 'تدوين ملاحظات سريع',
    icon: Notepad,
    path: '/tools/notepad',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'daily-planner',
    title: 'Daily Planner',
    titleAr: 'مخطط يومي',
    description: 'Plan your day with templates',
    descriptionAr: 'خطط يومك باستخدام قوالب',
    icon: ListBullets,
    path: '/tools/daily-planner-template',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'text-to-speech',
    title: 'Text to Speech',
    titleAr: 'تحويل النص إلى كلام',
    description: 'Convert text to natural speech',
    descriptionAr: 'تحويل النص إلى كلام طبيعي',
    icon: SpeakerHigh,
    path: '/tools/text-to-speech',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    titleAr: 'مولد علامات Meta',
    description: 'Generate SEO meta tags',
    descriptionAr: 'توليد علامات Meta لتحسين محركات البحث',
    icon: Code,
    path: '/tools/meta-tag-generator',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'ip-address-finder',
    title: 'IP Address Finder',
    titleAr: 'البحث عن عنوان IP',
    description: 'Find your IP address and location',
    descriptionAr: 'العثور على عنوان IP وموقعك',
    icon: Globe,
    path: '/tools/ip-address-finder',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'http-header-analyzer',
    title: 'HTTP Header Analyzer',
    titleAr: 'محلل رؤوس HTTP',
    description: 'Analyze HTTP headers',
    descriptionAr: 'تحليل رؤوس HTTP',
    icon: FileMagnifyingGlass,
    path: '/tools/http-header-analyzer',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'http-redirect-checker',
    title: 'HTTP Redirect Checker',
    titleAr: 'متحقق إعادة التوجيه HTTP',
    description: 'Check HTTP redirects',
    descriptionAr: 'التحقق من إعادة التوجيه HTTP',
    icon: LinkIcon,
    path: '/tools/http-redirect-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'random-string-generator',
    title: 'Random String Generator',
    titleAr: 'مولد السلاسل العشوائية',
    description: 'Generate random strings',
    descriptionAr: 'توليد سلاسل عشوائية',
    icon: Sparkle,
    path: '/tools/random-string-generator',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    titleAr: 'تحويل PDF إلى Word',
    description: 'Convert PDF to editable Word',
    descriptionAr: 'تحويل PDF إلى Word قابل للتعديل',
    icon: FilePdf,
    path: '/tools/pdf-to-word',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  }
]

export const categories = {
  ai: { 
    title: 'AI-Powered Tools', 
    titleAr: 'أدوات مدعومة بالذكاء الاصطناعي',
    emoji: '🤖', 
    color: 'from-purple-500 to-pink-500', 
    description: 'Intelligent tools powered by AI',
    descriptionAr: 'أدوات ذكية مدعومة بالذكاء الاصطناعي'
  },
  text: { 
    title: 'Text Utilities', 
    titleAr: 'أدوات النص',
    emoji: '📝', 
    color: 'from-blue-500 to-cyan-500', 
    description: 'Transform and analyze text',
    descriptionAr: 'تحويل وتحليل النص'
  },
  dev: { 
    title: 'Developer Tools', 
    titleAr: 'أدوات المطورين',
    emoji: '💻', 
    color: 'from-green-500 to-emerald-500', 
    description: 'Tools for developers',
    descriptionAr: 'أدوات للمطورين'
  },
  image: { 
    title: 'Image Tools', 
    titleAr: 'أدوات الصور',
    emoji: '🎨', 
    color: 'from-orange-500 to-red-500', 
    description: 'Edit and transform images',
    descriptionAr: 'تحرير وتحويل الصور'
  },
  security: { 
    title: 'Security Tools', 
    titleAr: 'أدوات الأمان',
    emoji: '🔐', 
    color: 'from-violet-500 to-purple-500', 
    description: 'Encryption and security utilities',
    descriptionAr: 'أدوات التشفير والأمان'
  },
  calc: { 
    title: 'Calculators', 
    titleAr: 'الحاسبات',
    emoji: '🧮', 
    color: 'from-teal-500 to-cyan-500', 
    description: 'Quick calculations and conversions',
    descriptionAr: 'حسابات وتحويلات سريعة'
  },
  fun: { 
    title: 'Fun & Productivity', 
    titleAr: 'المتعة والإنتاجية',
    emoji: '✨', 
    color: 'from-pink-500 to-rose-500', 
    description: 'Creative and productivity tools',
    descriptionAr: 'أدوات إبداعية وإنتاجية'
  }
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []
  
  return allTools.filter(tool => {
    const titleMatch = tool.title.toLowerCase().includes(lowerQuery)
    const descMatch = tool.description.toLowerCase().includes(lowerQuery)
    const categoryMatch = categories[tool.category as keyof typeof categories].title.toLowerCase().includes(lowerQuery)
    
    return titleMatch || descMatch || categoryMatch
  })
}

export function getToolsByCategory(category: string): Tool[] {
  return allTools.filter(tool => tool.category === category)
}

/**
 * Get translated tool title based on current language
 */
export function getToolTitle(tool: Tool, lang: string = 'en'): string {
  return lang === 'ar' && tool.titleAr ? tool.titleAr : tool.title
}

/**
 * Get translated tool description based on current language
 */
export function getToolDescription(tool: Tool, lang: string = 'en'): string {
  return lang === 'ar' && tool.descriptionAr ? tool.descriptionAr : tool.description
}

/**
 * Get translated category title based on current language
 */
export function getCategoryTitle(categoryKey: keyof typeof categories, lang: string = 'en'): string {
  const category = categories[categoryKey]
  return lang === 'ar' && category.titleAr ? category.titleAr : category.title
}

/**
 * Get translated category description based on current language
 */
export function getCategoryDescription(categoryKey: keyof typeof categories, lang: string = 'en'): string {
  const category = categories[categoryKey]
  return lang === 'ar' && category.descriptionAr ? category.descriptionAr : category.description
}

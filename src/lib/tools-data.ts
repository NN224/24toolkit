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
  description: string
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
    description: 'Chat with AI that uses multiple tools automatically',
    icon: ChatCircleDots,
    path: '/tools/multi-tool-chat',
    color: 'from-purple-500 to-sky-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'smart-history',
    title: 'Smart History',
    description: 'View and reuse your past AI tool results',
    icon: Clock,
    path: '/tools/smart-history',
    color: 'from-sky-500 to-purple-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-prompt-presets',
    title: 'AI Prompt Presets',
    description: 'Ready-made templates to save time with AI tools',
    icon: Lightning,
    path: '/tools/ai-prompt-presets',
    color: 'from-yellow-500 to-orange-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-usage-dashboard',
    title: 'AI Usage Dashboard',
    description: 'Track your AI usage with insights and personalized recommendations',
    icon: ChartBar,
    path: '/tools/ai-usage-dashboard',
    color: 'from-purple-600 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-tool-chains',
    title: 'AI Tool Chains',
    description: 'Connect multiple AI tools in automated workflows',
    icon: Lightning,
    path: '/tools/ai-tool-chains',
    color: 'from-purple-600 to-sky-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-task-builder',
    title: 'AI Task Builder',
    description: 'Turn any goal into a step-by-step plan with AI.',
    icon: ListChecks,
    path: '/tools/ai-task-builder',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-idea-analyzer',
    title: 'AI Idea Analyzer',
    description: 'Get instant feedback on your next big idea from an AI expert.',
    icon: Lightbulb,
    path: '/tools/idea-analyzer',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'text-summarizer',
    title: 'AI Text Summarizer',
    description: 'Transform long articles into concise summaries',
    icon: Brain,
    path: '/tools/text-summarizer',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'paragraph-rewriter',
    title: 'AI Paragraph Rewriter',
    description: 'Rephrase text while maintaining meaning',
    icon: PencilLine,
    path: '/tools/paragraph-rewriter',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'code-formatter',
    title: 'AI Code Formatter',
    description: 'Beautify and explain code with AI',
    icon: Code,
    path: '/tools/code-formatter',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'image-caption-generator',
    title: 'AI Image Caption',
    description: 'Generate descriptions for images',
    icon: Image,
    path: '/tools/image-caption-generator',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'grammar-corrector',
    title: 'AI Grammar Corrector',
    description: 'Fix grammar, spelling, and style errors',
    icon: CheckCircle,
    path: '/tools/grammar-corrector',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-translator',
    title: 'AI Translator',
    description: 'Translate text between multiple languages',
    icon: Globe,
    path: '/tools/ai-translator',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-email-writer',
    title: 'AI Email Writer',
    description: 'Generate professional emails with AI',
    icon: Envelope,
    path: '/tools/ai-email-writer',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'ai-hashtag-generator',
    title: 'AI Hashtag Generator',
    description: 'Create trending hashtags for social media',
    icon: Hash,
    path: '/tools/ai-hashtag-generator',
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    isAI: true
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, and reading time',
    icon: TextT,
    path: '/tools/word-counter',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between multiple case formats',
    icon: TextAa,
    path: '/tools/text-case-converter',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'remove-line-breaks',
    title: 'Remove Line Breaks',
    description: 'Clean up text by removing extra spaces',
    icon: ArrowsDownUp,
    path: '/tools/remove-line-breaks',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'word-frequency-analyzer',
    title: 'Word Frequency Analyzer',
    description: 'Analyze most frequently used words',
    icon: ChartBar,
    path: '/tools/word-frequency-analyzer',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'find-replace',
    title: 'Find & Replace',
    description: 'Search and replace text with regex support',
    icon: MagnifyingGlass,
    path: '/tools/find-replace',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'emoji-tool',
    title: 'Emoji Tool',
    description: 'Add or remove emojis from text',
    icon: Smiley,
    path: '/tools/emoji-tool',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'text-diff-checker',
    title: 'Text Diff Checker',
    description: 'Compare two texts with highlighting',
    icon: GitDiff,
    path: '/tools/text-diff-checker',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'text-reverser',
    title: 'Text Reverser',
    description: 'Reverse text in multiple modes',
    icon: ArrowsClockwise,
    path: '/tools/text-reverser',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'palindrome-checker',
    title: 'Palindrome Checker',
    description: 'Check if text is a palindrome',
    icon: CheckCircle,
    path: '/tools/palindrome-checker',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'sentence-counter',
    title: 'Sentence Counter',
    description: 'Count sentences with detailed analysis',
    icon: ListNumbers,
    path: '/tools/sentence-counter',
    color: 'from-blue-500 to-cyan-500',
    category: 'text'
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter',
    description: 'Beautify and format HTML code',
    icon: BracketsAngle,
    path: '/tools/html-formatter',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test regular expressions live',
    icon: FileMagnifyingGlass,
    path: '/tools/regex-tester',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'json-beautifier',
    title: 'JSON Beautifier',
    description: 'Format and validate JSON data',
    icon: Code,
    path: '/tools/json-beautifier',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'base64-tool',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: Lock,
    path: '/tools/base64-tool',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'url-encoder-decoder',
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs',
    icon: LinkIcon,
    path: '/tools/url-encoder-decoder',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate unique identifiers',
    icon: Fingerprint,
    path: '/tools/uuid-generator',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert between timestamps and dates',
    icon: Clock,
    path: '/tools/timestamp-converter',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens',
    icon: Key,
    path: '/tools/jwt-decoder',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'markdown-previewer',
    title: 'Markdown Previewer',
    description: 'Preview markdown in real-time',
    icon: BookOpen,
    path: '/tools/markdown-previewer',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'json-csv-converter',
    title: 'JSON ⇄ CSV',
    description: 'Convert between JSON and CSV formats',
    icon: ArrowsLeftRight,
    path: '/tools/json-csv-converter',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images with custom dimensions',
    icon: ArrowsOut,
    path: '/tools/image-resizer',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images with drag-and-drop',
    icon: Scissors,
    path: '/tools/image-cropper',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'background-remover',
    title: 'Background Remover',
    description: 'Remove image backgrounds automatically',
    icon: ImageBroken,
    path: '/tools/background-remover',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-filter-editor',
    title: 'Image Filter Editor',
    description: 'Apply filters and effects to images',
    icon: SlidersHorizontal,
    path: '/tools/image-filter-editor',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'watermark-adder',
    title: 'Watermark Adder',
    description: 'Add text or image watermarks',
    icon: Drop,
    path: '/tools/watermark-adder',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'meme-generator',
    title: 'Meme Generator',
    description: 'Create memes with custom text',
    icon: Sticker,
    path: '/tools/meme-generator',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-format-converter',
    title: 'Image Format Converter',
    description: 'Convert between image formats',
    icon: ImageSquare,
    path: '/tools/image-format-converter',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-rotator',
    title: 'Image Rotator',
    description: 'Rotate and flip images',
    icon: ArrowsClockwise,
    path: '/tools/image-rotator',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-color-extractor',
    title: 'Image Color Extractor',
    description: 'Extract color palette from images',
    icon: Palette,
    path: '/tools/image-color-extractor',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file sizes',
    icon: ImageSquare,
    path: '/tools/image-compressor',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'image-to-text',
    title: 'Image to Text (OCR)',
    description: 'Extract text from images',
    icon: TextAlignLeft,
    path: '/tools/image-to-text',
    color: 'from-orange-500 to-red-500',
    category: 'image'
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate cryptographic hashes',
    icon: Fingerprint,
    path: '/tools/hash-generator',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'password-strength-checker',
    title: 'Password Strength Checker',
    description: 'Analyze password security',
    icon: ShieldCheck,
    path: '/tools/password-strength-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'file-hash-verifier',
    title: 'File Hash Verifier',
    description: 'Verify file integrity with hashes',
    icon: FileDoc,
    path: '/tools/file-hash-verifier',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'url-phishing-checker',
    title: 'URL Phishing Checker',
    description: 'Check URLs for phishing indicators',
    icon: NetworkSlash,
    path: '/tools/url-phishing-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'aes-encryptor',
    title: 'AES Encryptor',
    description: 'Encrypt and decrypt text with AES',
    icon: Lock,
    path: '/tools/aes-encryptor',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'secure-password-generator',
    title: 'Secure Password Generator',
    description: 'Generate cryptographically secure passwords',
    icon: Key,
    path: '/tools/secure-password-generator',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'ssl-checker',
    title: 'SSL Certificate Checker',
    description: 'Verify SSL certificate details',
    icon: ShieldCheck,
    path: '/tools/ssl-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'text-encryptor',
    title: 'Text Encryptor',
    description: 'Simple text encryption and decryption',
    icon: Lock,
    path: '/tools/text-encryptor',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'ip-blacklist-checker',
    title: 'IP Blacklist Checker',
    description: 'Check if IP is blacklisted',
    icon: NetworkSlash,
    path: '/tools/ip-blacklist-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages easily',
    icon: Percent,
    path: '/tools/percentage-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate age from birth date',
    icon: CalendarBlank,
    path: '/tools/age-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate Body Mass Index',
    icon: Calculator,
    path: '/tools/bmi-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'tip-calculator',
    title: 'Tip Calculator',
    description: 'Calculate tips and split bills',
    icon: Receipt,
    path: '/tools/tip-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'discount-calculator',
    title: 'Discount Calculator',
    description: 'Calculate discounts and final prices',
    icon: CurrencyDollar,
    path: '/tools/discount-calculator',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between currencies',
    icon: CurrencyDollar,
    path: '/tools/currency-converter',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between various units',
    icon: ArrowsLeftRight,
    path: '/tools/unit-converter',
    color: 'from-teal-500 to-cyan-500',
    category: 'calc'
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure random passwords',
    icon: LockKey,
    path: '/tools/password-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create QR codes instantly',
    icon: QrCode,
    path: '/tools/qr-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick and generate color palettes',
    icon: Palette,
    path: '/tools/color-picker',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'random-quote-generator',
    title: 'Random Quote Generator',
    description: 'Get inspiring random quotes',
    icon: Sparkle,
    path: '/tools/random-quote-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'random-name-generator',
    title: 'Random Name Generator',
    description: 'Generate random names',
    icon: Sparkle,
    path: '/tools/random-name-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    icon: TextT,
    path: '/tools/lorem-ipsum-generator',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'random-number-picker',
    title: 'Random Number Picker',
    description: 'Pick random numbers',
    icon: Sparkle,
    path: '/tools/random-number-picker',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'dice-roller-coin-flipper',
    title: 'Dice Roller & Coin Flipper',
    description: 'Roll dice and flip coins',
    icon: Sparkle,
    path: '/tools/dice-roller-coin-flipper',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'countdown-timer',
    title: 'Countdown Timer',
    description: 'Create custom countdown timers',
    icon: Timer,
    path: '/tools/countdown-timer',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'stopwatch',
    title: 'Stopwatch',
    description: 'Precise time tracking',
    icon: Clock,
    path: '/tools/stopwatch',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    description: 'Focus timer with work/break intervals',
    icon: Timer,
    path: '/tools/pomodoro-timer',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'notepad',
    title: 'Notepad',
    description: 'Quick note taking',
    icon: Notepad,
    path: '/tools/notepad',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'daily-planner',
    title: 'Daily Planner',
    description: 'Plan your day with templates',
    icon: ListBullets,
    path: '/tools/daily-planner-template',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'text-to-speech',
    title: 'Text to Speech',
    description: 'Convert text to natural speech',
    icon: SpeakerHigh,
    path: '/tools/text-to-speech',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  },
  {
    id: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    description: 'Generate SEO meta tags',
    icon: Code,
    path: '/tools/meta-tag-generator',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'ip-address-finder',
    title: 'IP Address Finder',
    description: 'Find your IP address and location',
    icon: Globe,
    path: '/tools/ip-address-finder',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'http-header-analyzer',
    title: 'HTTP Header Analyzer',
    description: 'Analyze HTTP headers',
    icon: FileMagnifyingGlass,
    path: '/tools/http-header-analyzer',
    color: 'from-green-500 to-emerald-500',
    category: 'dev'
  },
  {
    id: 'http-redirect-checker',
    title: 'HTTP Redirect Checker',
    description: 'Check HTTP redirects',
    icon: LinkIcon,
    path: '/tools/http-redirect-checker',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'random-string-generator',
    title: 'Random String Generator',
    description: 'Generate random strings',
    icon: Sparkle,
    path: '/tools/random-string-generator',
    color: 'from-violet-500 to-purple-500',
    category: 'security'
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF to editable Word',
    icon: FilePdf,
    path: '/tools/pdf-to-word',
    color: 'from-pink-500 to-rose-500',
    category: 'fun'
  }
]

export const categories = {
  ai: { title: 'AI-Powered Tools', emoji: '🤖', color: 'from-purple-500 to-pink-500', description: 'Intelligent tools powered by AI' },
  text: { title: 'Text Utilities', emoji: '📝', color: 'from-blue-500 to-cyan-500', description: 'Transform and analyze text' },
  dev: { title: 'Developer Tools', emoji: '💻', color: 'from-green-500 to-emerald-500', description: 'Tools for developers' },
  image: { title: 'Image Tools', emoji: '🎨', color: 'from-orange-500 to-red-500', description: 'Edit and transform images' },
  security: { title: 'Security Tools', emoji: '🔐', color: 'from-violet-500 to-purple-500', description: 'Encryption and security utilities' },
  calc: { title: 'Calculators', emoji: '🧮', color: 'from-teal-500 to-cyan-500', description: 'Quick calculations and conversions' },
  fun: { title: 'Fun & Productivity', emoji: '✨', color: 'from-pink-500 to-rose-500', description: 'Creative and productivity tools' }
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

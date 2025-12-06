export interface PageMetadata {
  title: string
  description: string
  keywords?: string
  h1?: string
}

export const seoMetadata: Record<string, PageMetadata> = {
  // Main Pages
  home: {
    title: '24Toolkit - 80+ Free AI Tools, Security Tools, Calculators & More | Online Toolkit',
    description: '24Toolkit provides 80+ free tools including AI-powered tools, security tools, calculators, developer tools, image tools & text utilities. All tools work client-side in your browser. No sign-up required.',
    keywords: 'AI tools, security tools, calculators, developer tools, image tools, text utilities, free online tools, web tools'
  },
  about: {
    title: 'About 24Toolkit - Free Online Tools for Everyone',
    description: 'Learn about 24Toolkit, your complete online toolkit with 80+ free, fast, and AI-powered tools for developers, creators, and everyday users. All tools run in your browser for maximum privacy.',
    keywords: 'about 24toolkit, online tools, free tools, web utilities'
  },
  contact: {
    title: 'Contact 24Toolkit - Get in Touch',
    description: 'Contact 24Toolkit for support, feedback, or partnership opportunities. We\'re here to help you get the most out of our free online tools.',
    keywords: 'contact, support, feedback, 24toolkit'
  },
  privacyPolicy: {
    title: 'Privacy Policy - 24Toolkit',
    description: 'Read 24Toolkit\'s privacy policy to understand how we protect your data. All tools run client-side in your browser for maximum privacy and security.',
    keywords: 'privacy policy, data protection, security'
  },
  termsOfService: {
    title: 'Terms of Service - 24Toolkit',
    description: 'Review 24Toolkit\'s terms of service for using our free online tools. Learn about your rights and responsibilities when using our platform.',
    keywords: 'terms of service, user agreement, legal'
  },
  sitemap: {
    title: 'Sitemap - Browse All 80+ Tools on 24Toolkit',
    description: 'Browse the complete sitemap of 24Toolkit with all 80+ free tools organized by category: AI tools, text utilities, developer tools, image tools, security tools, calculators, and more.',
    keywords: 'sitemap, all tools, tool categories'
  },

  // AI Tools
  'multi-tool-chat': {
    title: 'Multi-Tool AI Chat | Best AI Tool on 24Toolkit',
    description: 'Chat with an intelligent AI assistant that automatically uses multiple tools for translation, summarization, email writing & more. Free AI chat.',
    keywords: 'AI chat, smart assistant, multi-tool AI, AI chatbot, intelligent assistant',
    h1: 'Multi-Tool AI Chat – AI Tool Overview'
  },
  'smart-history': {
    title: 'Smart History | Best AI Tool on 24Toolkit',
    description: 'Access your complete history of AI tool usage. Search, favorite, and reuse previous AI results. Never lose AI-generated content again.',
    keywords: 'AI history, tool history, usage history, saved results, AI archive',
    h1: 'Smart History – AI Tool Overview'
  },
  'ai-prompt-presets': {
    title: 'AI Prompt Presets | Best AI Tool on 24Toolkit',
    description: 'Ready-made prompt templates to save time and get better AI results. Templates for emails, content, social media, translation & code.',
    keywords: 'AI prompts, prompt templates, AI presets, prompt library, AI templates',
    h1: 'AI Prompt Presets – AI Tool Overview'
  },
  'ai-usage-dashboard': {
    title: 'AI Usage Dashboard | Best AI Tool on 24Toolkit',
    description: 'Track AI tool usage with detailed insights, statistics & personalized recommendations. Monitor favorite tools, success rates & usage patterns.',
    keywords: 'AI dashboard, usage analytics, AI insights, AI statistics, usage tracking',
    h1: 'AI Usage Dashboard – AI Tool Overview'
  },
  'ai-tool-chains': {
    title: 'AI Tool Chains | Best AI Tool on 24Toolkit',
    description: 'Create automated workflows by chaining multiple AI tools together. Translate, summarize, expand content & more. Free AI workflow automation.',
    keywords: 'AI tool chains, AI workflow, automated workflows, AI automation, multi-tool AI',
    h1: 'AI Tool Chains – AI Tool Overview'
  },
  'ai-task-builder': {
    title: 'AI Task Builder | Best AI Tool on 24Toolkit',
    description: 'Transform any goal into a structured, actionable step-by-step plan using AI. Break down complex projects into manageable tasks easily.',
    keywords: 'AI task builder, project planning, goal setting, task planning, AI planner',
    h1: 'AI Task Builder – AI Tool Overview'
  },
  'ai-idea-analyzer': {
    title: 'AI Idea Analyzer | Best AI Tool on 24Toolkit',
    description: 'Get instant AI-powered feedback on your ideas. Analyze business concepts, projects with expert AI insights & actionable recommendations.',
    keywords: 'idea analyzer, AI feedback, business ideas, idea validation, AI consultant',
    h1: 'AI Idea Analyzer – AI Tool Overview'
  },
  'text-summarizer': {
    title: 'AI Text Summarizer | Best AI Tool on 24Toolkit',
    description: 'Summarize long articles, documents & texts into concise summaries with AI. Extract key points instantly with free text summarization.',
    keywords: 'text summarizer, AI summarizer, article summary, text summary, content summarization',
    h1: 'AI Text Summarizer – AI Tool Overview'
  },
  'paragraph-rewriter': {
    title: 'AI Paragraph Rewriter | Best AI Tool on 24Toolkit',
    description: 'Rephrase and rewrite paragraphs while maintaining meaning using AI. Create unique, readable content instantly with free AI rewriter.',
    keywords: 'paragraph rewriter, text rewriter, AI rewriter, rephrase text, content rewriting',
    h1: 'AI Paragraph Rewriter – AI Tool Overview'
  },
  'code-formatter': {
    title: 'AI Code Formatter | Best AI Tool on 24Toolkit',
    description: 'Format, beautify & explain code with AI assistance. Supports multiple programming languages with free AI-powered explanations.',
    keywords: 'code formatter, AI code formatter, beautify code, code beautifier, code explanation',
    h1: 'AI Code Formatter – AI Tool Overview'
  },
  'image-caption-generator': {
    title: 'AI Image Caption Generator | Best AI Tool on 24Toolkit',
    description: 'Generate descriptive captions for images using AI. Perfect for social media, accessibility & SEO optimization with free AI captions.',
    keywords: 'image caption, AI caption generator, image description, alt text generator, photo captions',
    h1: 'AI Image Caption Generator – AI Tool Overview'
  },
  'grammar-corrector': {
    title: 'AI Grammar Corrector | Best AI Tool on 24Toolkit',
    description: 'Fix grammar, spelling, punctuation & style errors with AI. Improve your writing instantly with free AI-powered grammar checking.',
    keywords: 'grammar corrector, spell checker, grammar checker, AI grammar, writing assistant',
    h1: 'AI Grammar Corrector – AI Tool Overview'
  },
  'ai-translator': {
    title: 'AI Translator | Best AI Tool on 24Toolkit',
    description: 'Translate text between multiple languages with AI-powered translation. Fast, accurate & free language translation for instant results.',
    keywords: 'AI translator, language translator, text translation, multi-language translator',
    h1: 'AI Translator – AI Tool Overview'
  },
  'ai-email-writer': {
    title: 'AI Email Writer | Best AI Tool on 24Toolkit',
    description: 'Generate professional emails for any purpose with AI. Free email writer for business, personal & marketing communications instantly.',
    keywords: 'AI email writer, email generator, professional emails, email assistant, email composition',
    h1: 'AI Email Writer – AI Tool Overview'
  },
  'ai-hashtag-generator': {
    title: 'AI Hashtag Generator | Best AI Tool on 24Toolkit',
    description: 'Create trending, relevant hashtags for social media posts with AI. Free hashtag generator for Instagram, Twitter, TikTok & more platforms.',
    keywords: 'hashtag generator, AI hashtags, social media hashtags, trending hashtags, Instagram hashtags',
    h1: 'AI Hashtag Generator – AI Tool Overview'
  },

  // Text Tools
  'word-counter': {
    title: 'Word Counter | Free Tool on 24Toolkit',
    description: 'Count words, characters, sentences, paragraphs & estimate reading time instantly. Accurate, free word counter with detailed text statistics.',
    keywords: 'word counter, character counter, word count, reading time, text statistics',
    h1: 'Word Counter – Free Online Tool'
  },
  'text-case-converter': {
    title: 'Text Case Converter | Free Tool on 24Toolkit',
    description: 'Convert text between uppercase, lowercase, title case, sentence case & more formats. Free case converter with multiple text formatting options.',
    keywords: 'case converter, text case, uppercase, lowercase, title case, text formatting',
    h1: 'Text Case Converter – Free Online Tool'
  },
  'remove-line-breaks': {
    title: 'Remove Line Breaks | Free Tool on 24Toolkit',
    description: 'Remove line breaks, extra spaces & clean up text formatting instantly. Free tool to format and organize your text quickly & efficiently.',
    keywords: 'remove line breaks, clean text, remove spaces, text cleaner, format text',
    h1: 'Remove Line Breaks – Free Online Tool'
  },
  'word-frequency-analyzer': {
    title: 'Word Frequency Analyzer | Free Tool on 24Toolkit',
    description: 'Analyze text to find the most frequently used words instantly. Free word frequency counter with detailed statistics & visualizations.',
    keywords: 'word frequency, text analysis, word count, text statistics, word usage',
    h1: 'Word Frequency Analyzer – Free Online Tool'
  },
  'find-replace': {
    title: 'Find & Replace | Free Tool on 24Toolkit',
    description: 'Search and replace text with regex support. Free find & replace tool with advanced pattern matching capabilities for text editing.',
    keywords: 'find replace, search replace, regex, text editor, pattern matching',
    h1: 'Find & Replace – Free Online Tool'
  },
  'emoji-tool': {
    title: 'Emoji Tool | Free Tool on 24Toolkit',
    description: 'Add or remove emojis from text easily. Free emoji tool with emoji picker, search & text formatting options for creative content.',
    keywords: 'emoji tool, add emojis, remove emojis, emoji picker, text emojis',
    h1: 'Emoji Tool – Free Online Tool'
  },
  'text-diff-checker': {
    title: 'Text Diff Checker | Free Tool on 24Toolkit',
    description: 'Compare two texts and see differences with color highlighting. Free text diff tool for comparing documents, code or any text content.',
    keywords: 'text diff, compare text, text comparison, diff checker, text differences',
    h1: 'Text Diff Checker – Free Online Tool'
  },
  'text-reverser': {
    title: 'Text Reverser | Free Tool on 24Toolkit',
    description: 'Reverse text, words or letters with multiple reversal modes. Free text reverser for creating mirror text, backwards text & fun effects.',
    keywords: 'text reverser, reverse text, mirror text, backwards text, flip text',
    h1: 'Text Reverser – Free Online Tool'
  },
  'palindrome-checker': {
    title: 'Palindrome Checker | Free Tool on 24Toolkit',
    description: 'Check if a word, phrase or number is a palindrome instantly. Free palindrome checker that automatically ignores spaces & punctuation.',
    keywords: 'palindrome checker, check palindrome, palindrome detector, word games',
    h1: 'Palindrome Checker – Free Online Tool'
  },
  'sentence-counter': {
    title: 'Sentence Counter | Free Tool on 24Toolkit',
    description: 'Count sentences with detailed analysis including average sentence length. Free sentence counter tool perfect for writers & editors.',
    keywords: 'sentence counter, count sentences, sentence analysis, text statistics',
    h1: 'Sentence Counter – Free Online Tool'
  },

  // Developer Tools
  'html-formatter': {
    title: 'HTML Formatter | Free Developer Tool on 24Toolkit',
    description: 'Beautify & format HTML code with proper indentation instantly. Free HTML formatter that makes your code clean, readable & well-structured.',
    keywords: 'HTML formatter, HTML beautifier, format HTML, beautify HTML, HTML code',
    h1: 'HTML Formatter – Free Developer Tool'
  },
  'regex-tester': {
    title: 'Regex Tester | Free Developer Tool on 24Toolkit',
    description: 'Test regular expressions with live matching & highlighting. Free regex tester with pattern explanation, examples & instant validation.',
    keywords: 'regex tester, regular expression, regex test, pattern matching, regex validator',
    h1: 'Regex Tester – Free Developer Tool'
  },
  'json-beautifier': {
    title: 'JSON Beautifier | Free Developer Tool on 24Toolkit',
    description: 'Format, beautify & validate JSON data with syntax highlighting. Free JSON formatter with error detection & instant validation.',
    keywords: 'JSON beautifier, JSON formatter, format JSON, validate JSON, JSON validator',
    h1: 'JSON Beautifier – Free Developer Tool'
  },
  'base64-tool': {
    title: 'Base64 Encoder/Decoder | Free Developer Tool on 24Toolkit',
    description: 'Encode & decode Base64 strings quickly and easily. Free Base64 tool for text and file encoding with instant conversion results.',
    keywords: 'Base64 encoder, Base64 decoder, encode Base64, decode Base64, Base64 converter',
    h1: 'Base64 Encoder/Decoder – Free Developer Tool'
  },
  'url-encoder-decoder': {
    title: 'URL Encoder/Decoder | Free Developer Tool on 24Toolkit',
    description: 'Encode & decode URLs and query parameters instantly. Free URL encoder for safe URL formatting, decoding & conversion.',
    keywords: 'URL encoder, URL decoder, encode URL, decode URL, URL converter',
    h1: 'URL Encoder/Decoder – Free Developer Tool'
  },
  'uuid-generator': {
    title: 'UUID Generator | Free Developer Tool on 24Toolkit',
    description: 'Generate UUID/GUID unique identifiers for your applications instantly. Free UUID generator with multiple versions (v1, v4) support.',
    keywords: 'UUID generator, GUID generator, unique ID, generate UUID, identifier generator',
    h1: 'UUID Generator – Free Developer Tool'
  },
  'timestamp-converter': {
    title: 'Timestamp Converter | Free Developer Tool on 24Toolkit',
    description: 'Convert between Unix timestamps & human-readable dates instantly. Free timestamp converter with timezone support & epoch conversion.',
    keywords: 'timestamp converter, Unix timestamp, date converter, epoch converter, time converter',
    h1: 'Timestamp Converter – Free Developer Tool'
  },
  'jwt-decoder': {
    title: 'JWT Decoder | Free Developer Tool on 24Toolkit',
    description: 'Decode & inspect JWT tokens to view header, payload & signature. Free JWT decoder for debugging authentication & token analysis.',
    keywords: 'JWT decoder, decode JWT, JWT token, JSON Web Token, JWT inspector',
    h1: 'JWT Decoder – Free Developer Tool'
  },
  'markdown-previewer': {
    title: 'Markdown Previewer | Free Developer Tool on 24Toolkit',
    description: 'Preview markdown with live rendering & syntax highlighting. Free markdown editor & previewer with GitHub-flavored markdown support.',
    keywords: 'markdown previewer, markdown editor, markdown preview, markdown renderer',
    h1: 'Markdown Previewer – Free Developer Tool'
  },
  'json-csv-converter': {
    title: 'JSON to CSV Converter | Free Developer Tool on 24Toolkit',
    description: 'Convert between JSON & CSV formats instantly. Free bidirectional converter for data transformation, export & format conversion.',
    keywords: 'JSON to CSV, CSV to JSON, JSON converter, CSV converter, data converter',
    h1: 'JSON to CSV Converter – Free Developer Tool'
  },
  'meta-tag-generator': {
    title: 'Meta Tag Generator | Free Developer Tool on 24Toolkit',
    description: 'Generate SEO-friendly meta tags including title, description, Open Graph & Twitter Card tags. Free meta tag generator for better SEO.',
    keywords: 'meta tag generator, SEO tags, Open Graph tags, Twitter Card, meta tags',
    h1: 'Meta Tag Generator – Free Developer Tool'
  },
  'ip-address-finder': {
    title: 'IP Address Finder | Free Developer Tool on 24Toolkit',
    description: 'Find your public IP address, location, ISP & network information instantly. Free IP address lookup tool with detailed information.',
    keywords: 'IP address finder, find IP, IP lookup, my IP address, IP location',
    h1: 'IP Address Finder – Free Developer Tool'
  },
  'http-header-analyzer': {
    title: 'HTTP Header Analyzer | Free Developer Tool on 24Toolkit',
    description: 'Analyze HTTP headers from any website including status codes, caching, security headers & more. Free HTTP header checker tool.',
    keywords: 'HTTP headers, header analyzer, HTTP analyzer, check headers, HTTP response',
    h1: 'HTTP Header Analyzer – Free Developer Tool'
  },

  // Image Tools
  'image-resizer': {
    title: 'Image Resizer | Free Image Tool on 24Toolkit',
    description: 'Resize images to custom dimensions while maintaining quality. Free image resizer with multiple size options & aspect ratio control.',
    keywords: 'image resizer, resize image, image dimensions, scale image, image size',
    h1: 'Image Resizer – Free Image Tool'
  },
  'image-cropper': {
    title: 'Image Cropper | Free Image Tool on 24Toolkit',
    description: 'Crop images easily with drag-and-drop interface. Free image cropper with zoom, rotate & aspect ratio options for perfect results.',
    keywords: 'image cropper, crop image, image crop tool, photo cropper, cut image',
    h1: 'Image Cropper – Free Image Tool'
  },
  'background-remover': {
    title: 'Background Remover | Free Image Tool on 24Toolkit',
    description: 'Remove image backgrounds automatically with AI. Free background remover for creating transparent PNG images instantly & easily.',
    keywords: 'background remover, remove background, transparent background, bg remover, cut out image',
    h1: 'Background Remover – Free Image Tool'
  },
  'image-filter-editor': {
    title: 'Image Filter Editor | Free Image Tool on 24Toolkit',
    description: 'Apply filters, effects & adjustments to images instantly. Free image editor with brightness, contrast, saturation & more options.',
    keywords: 'image filter, photo editor, image effects, edit image, photo filters',
    h1: 'Image Filter Editor – Free Image Tool'
  },
  'watermark-adder': {
    title: 'Watermark Adder | Free Image Tool on 24Toolkit',
    description: 'Add text or image watermarks to protect your photos. Free watermark tool with custom positioning, opacity & style options.',
    keywords: 'watermark adder, add watermark, image watermark, photo watermark, protect images',
    h1: 'Watermark Adder – Free Image Tool'
  },
  'meme-generator': {
    title: 'Meme Generator | Free Image Tool on 24Toolkit',
    description: 'Create memes with custom text, fonts & images. Free meme generator with popular meme templates & custom upload support.',
    keywords: 'meme generator, create memes, meme maker, funny memes, meme creator',
    h1: 'Meme Generator – Free Image Tool'
  },
  'image-format-converter': {
    title: 'Image Format Converter | Free Image Tool on 24Toolkit',
    description: 'Convert images between JPG, PNG, WebP, GIF & more formats instantly. Free image converter with batch processing support.',
    keywords: 'image converter, format converter, JPG to PNG, PNG to JPG, image format',
    h1: 'Image Format Converter – Free Image Tool'
  },
  'image-rotator': {
    title: 'Image Rotator | Free Image Tool on 24Toolkit',
    description: 'Rotate images by any angle & flip horizontally or vertically. Free image rotation tool with instant preview & download.',
    keywords: 'image rotator, rotate image, flip image, rotate photo, image rotation',
    h1: 'Image Rotator – Free Image Tool'
  },
  'image-color-extractor': {
    title: 'Image Color Extractor | Free Image Tool on 24Toolkit',
    description: 'Extract dominant colors & color palettes from images. Free color picker tool with hex, RGB & HSL codes for designers.',
    keywords: 'color extractor, color palette, image colors, color picker, extract colors',
    h1: 'Image Color Extractor – Free Image Tool'
  },
  'image-compressor': {
    title: 'Image Compressor | Free Image Tool on 24Toolkit',
    description: 'Compress images to reduce file size while maintaining quality. Free image compressor for JPG, PNG & WebP format optimization.',
    keywords: 'image compressor, compress image, reduce file size, optimize image, image optimization',
    h1: 'Image Compressor – Free Image Tool'
  },
  'image-to-text': {
    title: 'Image to Text (OCR) | Free Image Tool on 24Toolkit',
    description: 'Extract text from images using OCR technology. Free image to text converter recognizing text in photos & scanned documents.',
    keywords: 'image to text, OCR, extract text, text recognition, image text extractor',
    h1: 'Image to Text (OCR) – Free Image Tool'
  },

  // Security Tools
  'hash-generator': {
    title: 'Hash Generator | Free Security Tool on 24Toolkit',
    description: 'Generate cryptographic hashes including MD5, SHA-1, SHA-256 & more. Free hash generator for text and files with instant results.',
    keywords: 'hash generator, MD5, SHA-256, SHA-1, cryptographic hash, hash function',
    h1: 'Hash Generator – Free Security Tool'
  },
  'password-strength-checker': {
    title: 'Password Strength Checker | Free Security Tool on 24Toolkit',
    description: 'Check password strength & get security recommendations. Free password analyzer evaluating complexity, vulnerability & strength.',
    keywords: 'password strength, password checker, password security, strong password, password analyzer',
    h1: 'Password Strength Checker – Free Security Tool'
  },
  'file-hash-verifier': {
    title: 'File Hash Verifier | Free Security Tool on 24Toolkit',
    description: 'Verify file integrity by comparing file hashes instantly. Free file hash checker for MD5, SHA-1 & SHA-256 verification.',
    keywords: 'file hash, verify hash, hash verifier, file integrity, checksum',
    h1: 'File Hash Verifier – Free Security Tool'
  },
  'url-phishing-checker': {
    title: 'URL Phishing Checker | Free Security Tool on 24Toolkit',
    description: 'Check URLs for phishing & suspicious indicators instantly. Free URL scanner detecting potential security threats & malicious links.',
    keywords: 'phishing checker, URL scanner, phishing detection, suspicious link, URL security',
    h1: 'URL Phishing Checker – Free Security Tool'
  },
  'aes-encryptor': {
    title: 'AES Encryptor | Free Security Tool on 24Toolkit',
    description: 'Encrypt & decrypt text using AES encryption instantly. Free AES tool with 128, 192 & 256-bit encryption support for security.',
    keywords: 'AES encryption, AES encryptor, encrypt text, decrypt text, AES cipher',
    h1: 'AES Encryptor – Free Security Tool'
  },
  'secure-password-generator': {
    title: 'Secure Password Generator | Free Security Tool on 24Toolkit',
    description: 'Generate cryptographically secure passwords with custom requirements. Free password generator with strength options & randomization.',
    keywords: 'secure password, password generator, strong password, random password, generate password',
    h1: 'Secure Password Generator – Free Security Tool'
  },
  'ssl-checker': {
    title: 'SSL Certificate Checker | Free Security Tool on 24Toolkit',
    description: 'Check SSL certificate details including expiration, issuer & security info. Free SSL checker for website security verification.',
    keywords: 'SSL checker, SSL certificate, HTTPS checker, SSL verification, certificate checker',
    h1: 'SSL Certificate Checker – Free Security Tool'
  },
  'text-encryptor': {
    title: 'Text Encryptor | Free Security Tool on 24Toolkit',
    description: 'Encrypt & decrypt text with simple password-based encryption. Free text encryptor for secure message sharing & privacy protection.',
    keywords: 'text encryption, encrypt text, decrypt text, text encryptor, secure text',
    h1: 'Text Encryptor – Free Security Tool'
  },
  'ip-blacklist-checker': {
    title: 'IP Blacklist Checker | Free Security Tool on 24Toolkit',
    description: 'Check if an IP address is blacklisted on major spam databases. Free IP blacklist lookup for email & server security verification.',
    keywords: 'IP blacklist, blacklist checker, IP reputation, spam checker, IP lookup',
    h1: 'IP Blacklist Checker – Free Security Tool'
  },
  'http-redirect-checker': {
    title: 'HTTP Redirect Checker | Free Security Tool on 24Toolkit',
    description: 'Check HTTP redirects & trace redirect chains instantly. Free redirect checker for SEO optimization & troubleshooting redirects.',
    keywords: 'redirect checker, HTTP redirect, 301 redirect, redirect chain, URL redirect',
    h1: 'HTTP Redirect Checker – Free Security Tool'
  },
  'random-string-generator': {
    title: 'Random String Generator | Free Security Tool on 24Toolkit',
    description: 'Generate random strings with custom length & character sets. Free random string generator for tokens, passwords & unique IDs.',
    keywords: 'random string, string generator, random text, generate string, random characters',
    h1: 'Random String Generator – Free Security Tool'
  },

  // Calculators
  'percentage-calculator': {
    title: 'Percentage Calculator | Free Calculator on 24Toolkit',
    description: 'Calculate percentages, percentage increase/decrease & percentage of numbers easily. Free percentage calculator with multiple operations.',
    keywords: 'percentage calculator, calculate percentage, percent calculator, percentage increase',
    h1: 'Percentage Calculator – Free Calculator'
  },
  'age-calculator': {
    title: 'Age Calculator | Free Calculator on 24Toolkit',
    description: 'Calculate age in years, months, days & hours from birth date. Free age calculator with exact age calculation & next birthday.',
    keywords: 'age calculator, calculate age, birth date calculator, how old am I, age from date',
    h1: 'Age Calculator – Free Calculator'
  },
  'bmi-calculator': {
    title: 'BMI Calculator | Free Calculator on 24Toolkit',
    description: 'Calculate Body Mass Index (BMI) & get health category instantly. Free BMI calculator with metric & imperial unit support.',
    keywords: 'BMI calculator, body mass index, BMI, calculate BMI, health calculator',
    h1: 'BMI Calculator – Free Calculator'
  },
  'tip-calculator': {
    title: 'Tip Calculator | Free Calculator on 24Toolkit',
    description: 'Calculate tips & split bills easily with custom percentages. Free tip calculator for restaurants with bill splitting features.',
    keywords: 'tip calculator, calculate tip, split bill, tip percentage, bill splitter',
    h1: 'Tip Calculator – Free Calculator'
  },
  'discount-calculator': {
    title: 'Discount Calculator | Free Calculator on 24Toolkit',
    description: 'Calculate discounts, final prices & savings amount instantly. Free discount calculator with percentage & amount off calculations.',
    keywords: 'discount calculator, calculate discount, sale price, discount percentage, savings calculator',
    h1: 'Discount Calculator – Free Calculator'
  },
  'currency-converter': {
    title: 'Currency Converter | Free Calculator on 24Toolkit',
    description: 'Convert between major world currencies with real-time exchange rates. Free currency converter supporting 150+ global currencies.',
    keywords: 'currency converter, exchange rate, convert currency, money converter, forex',
    h1: 'Currency Converter – Free Calculator'
  },
  'unit-converter': {
    title: 'Unit Converter | Free Calculator on 24Toolkit',
    description: 'Convert between length, weight, temperature, volume & more units. Free unit converter with multiple measurement categories.',
    keywords: 'unit converter, convert units, measurement converter, length converter, weight converter',
    h1: 'Unit Converter – Free Calculator'
  },

  // Fun & Productivity Tools
  'password-generator': {
    title: 'Password Generator | Free Tool on 24Toolkit',
    description: 'Generate strong, random passwords with custom options instantly. Free password generator with length, characters & strength settings.',
    keywords: 'password generator, random password, strong password, generate password, secure password',
    h1: 'Password Generator – Free Online Tool'
  },
  'qr-generator': {
    title: 'QR Code Generator | Free Tool on 24Toolkit',
    description: 'Create QR codes for URLs, text, WiFi & more instantly. Free QR code generator with download options & customization features.',
    keywords: 'QR code generator, create QR code, QR code maker, generate QR code, QR generator',
    h1: 'QR Code Generator – Free Online Tool'
  },
  'color-picker': {
    title: 'Color Picker | Free Tool on 24Toolkit',
    description: 'Pick colors & generate color palettes with hex, RGB & HSL codes. Free color picker tool for designers & developers.',
    keywords: 'color picker, color palette, hex color, RGB color, color generator',
    h1: 'Color Picker – Free Online Tool'
  },
  'random-quote-generator': {
    title: 'Random Quote Generator | Free Tool on 24Toolkit',
    description: 'Get inspiring, motivational & funny random quotes instantly. Free quote generator with thousands of quotes from famous people.',
    keywords: 'random quote, quote generator, inspirational quotes, motivational quotes, famous quotes',
    h1: 'Random Quote Generator – Free Online Tool'
  },
  'random-name-generator': {
    title: 'Random Name Generator | Free Tool on 24Toolkit',
    description: 'Generate random names for characters, usernames or projects instantly. Free name generator with first & last name combinations.',
    keywords: 'random name, name generator, random name generator, character names, username generator',
    h1: 'Random Name Generator – Free Online Tool'
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator | Free Tool on 24Toolkit',
    description: 'Generate Lorem Ipsum placeholder text for designs & mockups instantly. Free Lorem Ipsum generator with custom length options.',
    keywords: 'lorem ipsum, placeholder text, dummy text, lorem generator, filler text',
    h1: 'Lorem Ipsum Generator – Free Online Tool'
  },
  'random-number-picker': {
    title: 'Random Number Picker | Free Tool on 24Toolkit',
    description: 'Pick random numbers within a custom range instantly. Free random number generator for games, raffles & decision making.',
    keywords: 'random number, number picker, random number generator, pick number, number generator',
    h1: 'Random Number Picker – Free Online Tool'
  },
  'dice-roller-coin-flipper': {
    title: 'Dice Roller & Coin Flipper | Free Tool on 24Toolkit',
    description: 'Roll dice & flip coins virtually with instant results. Free dice roller & coin flipper for games & random decisions.',
    keywords: 'dice roller, coin flipper, roll dice, flip coin, random dice',
    h1: 'Dice Roller & Coin Flipper – Free Online Tool'
  },
  'countdown-timer': {
    title: 'Countdown Timer | Free Tool on 24Toolkit',
    description: 'Create custom countdown timers for events, deadlines or goals. Free countdown timer with alarm & notification features.',
    keywords: 'countdown timer, timer, countdown, event timer, deadline timer',
    h1: 'Countdown Timer – Free Online Tool'
  },
  'stopwatch': {
    title: 'Stopwatch | Free Tool on 24Toolkit',
    description: 'Accurate stopwatch for precise time tracking with lap times. Free stopwatch with start, stop, reset & lap recording functions.',
    keywords: 'stopwatch, timer, time tracker, lap timer, precise timer',
    h1: 'Stopwatch – Free Online Tool'
  },
  'pomodoro-timer': {
    title: 'Pomodoro Timer | Free Tool on 24Toolkit',
    description: 'Pomodoro timer for focused work sessions with break intervals. Free productivity timer based on the Pomodoro Technique method.',
    keywords: 'pomodoro timer, focus timer, productivity timer, work timer, pomodoro technique',
    h1: 'Pomodoro Timer – Free Online Tool'
  },
  'notepad': {
    title: 'Notepad | Free Tool on 24Toolkit',
    description: 'Simple, fast notepad for quick note taking online. Free online notepad with auto-save functionality & export options.',
    keywords: 'notepad, online notepad, notes, quick notes, text editor',
    h1: 'Notepad – Free Online Tool'
  },
  'daily-planner-template': {
    title: 'Daily Planner | Free Tool on 24Toolkit',
    description: 'Plan your day with customizable daily planner templates. Free daily planner for productivity & time management optimization.',
    keywords: 'daily planner, day planner, planner template, productivity planner, schedule planner',
    h1: 'Daily Planner – Free Online Tool'
  },
  'text-to-speech': {
    title: 'Text to Speech | Free Tool on 24Toolkit',
    description: 'Convert text to natural-sounding speech with multiple voices. Free text to speech tool with adjustable speed & voice options.',
    keywords: 'text to speech, TTS, speech synthesis, read text aloud, voice generator',
    h1: 'Text to Speech – Free Online Tool'
  },
  'pdf-to-word': {
    title: 'PDF to Word | Free Tool on 24Toolkit',
    description: 'Convert PDF files to editable Word documents instantly. Free PDF to Word converter preserving formatting & layout perfectly.',
    keywords: 'PDF to Word, convert PDF, PDF converter, PDF to DOCX, document converter',
    h1: 'PDF to Word – Free Online Tool'
  }
}

export function getPageMetadata(pageKey: string): PageMetadata {
  return seoMetadata[pageKey] || seoMetadata.home
}

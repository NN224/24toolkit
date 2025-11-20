export interface PageMetadata {
  title: string
  description: string
  keywords?: string
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
  'ai-task-builder': {
    title: 'AI Task Builder - Turn Goals into Step-by-Step Plans | 24Toolkit',
    description: 'Use AI to transform any goal into a structured, actionable step-by-step plan. Free AI task builder that helps you break down complex projects into manageable tasks.',
    keywords: 'AI task builder, project planning, goal setting, task planning, AI planner'
  },
  'idea-analyzer': {
    title: 'AI Idea Analyzer - Get Instant Feedback on Your Ideas | 24Toolkit',
    description: 'Get instant AI-powered feedback on your next big idea. Analyze business ideas, projects, or concepts with expert AI insights and actionable recommendations.',
    keywords: 'idea analyzer, AI feedback, business ideas, idea validation, AI consultant'
  },
  'text-summarizer': {
    title: 'AI Text Summarizer - Transform Long Articles into Summaries | 24Toolkit',
    description: 'Summarize long articles, documents, and texts into concise summaries with AI. Free text summarization tool that extracts key points instantly.',
    keywords: 'text summarizer, AI summarizer, article summary, text summary, content summarization'
  },
  'paragraph-rewriter': {
    title: 'AI Paragraph Rewriter - Rephrase Text with AI | 24Toolkit',
    description: 'Rephrase and rewrite paragraphs while maintaining meaning with AI. Free paragraph rewriter that creates unique, readable content instantly.',
    keywords: 'paragraph rewriter, text rewriter, AI rewriter, rephrase text, content rewriting'
  },
  'code-formatter': {
    title: 'AI Code Formatter - Beautify and Explain Code | 24Toolkit',
    description: 'Format, beautify, and explain code with AI assistance. Supports multiple programming languages. Free code formatter with AI-powered explanations.',
    keywords: 'code formatter, AI code formatter, beautify code, code beautifier, code explanation'
  },
  'image-caption-generator': {
    title: 'AI Image Caption Generator - Create Descriptions for Images | 24Toolkit',
    description: 'Generate descriptive captions for images using AI. Free image caption generator for social media, accessibility, and SEO optimization.',
    keywords: 'image caption, AI caption generator, image description, alt text generator, photo captions'
  },
  'grammar-corrector': {
    title: 'AI Grammar Corrector - Fix Grammar, Spelling & Style Errors | 24Toolkit',
    description: 'Fix grammar, spelling, punctuation, and style errors with AI. Free grammar checker that improves your writing instantly.',
    keywords: 'grammar corrector, spell checker, grammar checker, AI grammar, writing assistant'
  },
  'ai-translator': {
    title: 'AI Translator - Translate Text Between Multiple Languages | 24Toolkit',
    description: 'Translate text between multiple languages with AI-powered translation. Free, fast, and accurate language translation tool.',
    keywords: 'AI translator, language translator, text translation, multi-language translator'
  },
  'ai-email-writer': {
    title: 'AI Email Writer - Generate Professional Emails with AI | 24Toolkit',
    description: 'Generate professional emails for any purpose with AI. Free email writer for business, personal, and marketing emails.',
    keywords: 'AI email writer, email generator, professional emails, email assistant, email composition'
  },
  'ai-hashtag-generator': {
    title: 'AI Hashtag Generator - Create Trending Hashtags for Social Media | 24Toolkit',
    description: 'Create trending, relevant hashtags for social media posts with AI. Free hashtag generator for Instagram, Twitter, TikTok, and more.',
    keywords: 'hashtag generator, AI hashtags, social media hashtags, trending hashtags, Instagram hashtags'
  },

  // Text Tools
  'word-counter': {
    title: 'Word Counter - Count Words, Characters & Reading Time | 24Toolkit',
    description: 'Free word counter tool to count words, characters, sentences, paragraphs, and estimate reading time. Accurate and instant text statistics.',
    keywords: 'word counter, character counter, word count, reading time, text statistics'
  },
  'text-case-converter': {
    title: 'Text Case Converter - Convert Text Between Multiple Cases | 24Toolkit',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, and more. Free case converter with multiple formatting options.',
    keywords: 'case converter, text case, uppercase, lowercase, title case, text formatting'
  },
  'remove-line-breaks': {
    title: 'Remove Line Breaks - Clean Up Text by Removing Extra Spaces | 24Toolkit',
    description: 'Remove line breaks, extra spaces, and clean up text formatting. Free tool to format text quickly and efficiently.',
    keywords: 'remove line breaks, clean text, remove spaces, text cleaner, format text'
  },
  'word-frequency-analyzer': {
    title: 'Word Frequency Analyzer - Analyze Most Used Words | 24Toolkit',
    description: 'Analyze text to find the most frequently used words. Free word frequency counter with detailed statistics and visualization.',
    keywords: 'word frequency, text analysis, word count, text statistics, word usage'
  },
  'find-replace': {
    title: 'Find & Replace - Search and Replace Text with Regex | 24Toolkit',
    description: 'Search and replace text with support for regular expressions. Free find and replace tool with advanced pattern matching.',
    keywords: 'find replace, search replace, regex, text editor, pattern matching'
  },
  'emoji-tool': {
    title: 'Emoji Tool - Add or Remove Emojis from Text | 24Toolkit',
    description: 'Add or remove emojis from text easily. Free emoji tool with emoji picker and text formatting options.',
    keywords: 'emoji tool, add emojis, remove emojis, emoji picker, text emojis'
  },
  'text-diff-checker': {
    title: 'Text Diff Checker - Compare Two Texts with Highlighting | 24Toolkit',
    description: 'Compare two texts and see differences with color highlighting. Free text diff tool for comparing documents, code, or any text.',
    keywords: 'text diff, compare text, text comparison, diff checker, text differences'
  },
  'text-reverser': {
    title: 'Text Reverser - Reverse Text in Multiple Modes | 24Toolkit',
    description: 'Reverse text, words, or letters with multiple reversal modes. Free text reverser tool for creating mirror text and fun effects.',
    keywords: 'text reverser, reverse text, mirror text, backwards text, flip text'
  },
  'palindrome-checker': {
    title: 'Palindrome Checker - Check if Text is a Palindrome | 24Toolkit',
    description: 'Check if a word, phrase, or number is a palindrome. Free palindrome checker that ignores spaces and punctuation.',
    keywords: 'palindrome checker, check palindrome, palindrome detector, word games'
  },
  'sentence-counter': {
    title: 'Sentence Counter - Count Sentences with Detailed Analysis | 24Toolkit',
    description: 'Count sentences in text with detailed analysis including average sentence length. Free sentence counter for writers and editors.',
    keywords: 'sentence counter, count sentences, sentence analysis, text statistics'
  },

  // Developer Tools
  'html-formatter': {
    title: 'HTML Formatter - Beautify and Format HTML Code | 24Toolkit',
    description: 'Beautify and format HTML code with proper indentation. Free HTML formatter that makes your code clean and readable.',
    keywords: 'HTML formatter, HTML beautifier, format HTML, beautify HTML, HTML code'
  },
  'regex-tester': {
    title: 'Regex Tester - Test Regular Expressions Live | 24Toolkit',
    description: 'Test regular expressions with live matching and highlighting. Free regex tester with pattern explanation and examples.',
    keywords: 'regex tester, regular expression, regex test, pattern matching, regex validator'
  },
  'json-beautifier': {
    title: 'JSON Beautifier - Format and Validate JSON Data | 24Toolkit',
    description: 'Format, beautify, and validate JSON data with syntax highlighting. Free JSON formatter with error detection.',
    keywords: 'JSON beautifier, JSON formatter, format JSON, validate JSON, JSON validator'
  },
  'base64-tool': {
    title: 'Base64 Encoder/Decoder - Encode and Decode Base64 | 24Toolkit',
    description: 'Encode and decode Base64 strings quickly and easily. Free Base64 tool for text and file encoding.',
    keywords: 'Base64 encoder, Base64 decoder, encode Base64, decode Base64, Base64 converter'
  },
  'url-encoder-decoder': {
    title: 'URL Encoder/Decoder - Encode and Decode URLs | 24Toolkit',
    description: 'Encode and decode URLs and query parameters. Free URL encoder for safe URL formatting and decoding.',
    keywords: 'URL encoder, URL decoder, encode URL, decode URL, URL converter'
  },
  'uuid-generator': {
    title: 'UUID Generator - Generate Unique Identifiers | 24Toolkit',
    description: 'Generate UUID/GUID unique identifiers for your applications. Free UUID generator with multiple versions (v1, v4).',
    keywords: 'UUID generator, GUID generator, unique ID, generate UUID, identifier generator'
  },
  'timestamp-converter': {
    title: 'Timestamp Converter - Convert Between Timestamps and Dates | 24Toolkit',
    description: 'Convert between Unix timestamps and human-readable dates. Free timestamp converter with timezone support.',
    keywords: 'timestamp converter, Unix timestamp, date converter, epoch converter, time converter'
  },
  'jwt-decoder': {
    title: 'JWT Decoder - Decode and Inspect JWT Tokens | 24Toolkit',
    description: 'Decode and inspect JWT tokens to view header, payload, and signature. Free JWT decoder for debugging authentication.',
    keywords: 'JWT decoder, decode JWT, JWT token, JSON Web Token, JWT inspector'
  },
  'markdown-previewer': {
    title: 'Markdown Previewer - Preview Markdown in Real-Time | 24Toolkit',
    description: 'Preview markdown with live rendering and syntax highlighting. Free markdown editor and previewer with GitHub-flavored markdown support.',
    keywords: 'markdown previewer, markdown editor, markdown preview, markdown renderer'
  },
  'json-csv-converter': {
    title: 'JSON to CSV Converter - Convert Between JSON and CSV | 24Toolkit',
    description: 'Convert between JSON and CSV formats instantly. Free bidirectional converter for data transformation and export.',
    keywords: 'JSON to CSV, CSV to JSON, JSON converter, CSV converter, data converter'
  },
  'meta-tag-generator': {
    title: 'Meta Tag Generator - Generate SEO Meta Tags | 24Toolkit',
    description: 'Generate SEO-friendly meta tags including title, description, Open Graph, and Twitter Card tags. Free meta tag generator for better SEO.',
    keywords: 'meta tag generator, SEO tags, Open Graph tags, Twitter Card, meta tags'
  },
  'ip-address-finder': {
    title: 'IP Address Finder - Find Your IP Address and Location | 24Toolkit',
    description: 'Find your public IP address, location, ISP, and network information. Free IP address lookup tool with detailed information.',
    keywords: 'IP address finder, find IP, IP lookup, my IP address, IP location'
  },
  'http-header-analyzer': {
    title: 'HTTP Header Analyzer - Analyze HTTP Headers | 24Toolkit',
    description: 'Analyze HTTP headers from any website including status codes, caching, security headers, and more. Free HTTP header checker.',
    keywords: 'HTTP headers, header analyzer, HTTP analyzer, check headers, HTTP response'
  },

  // Image Tools
  'image-resizer': {
    title: 'Image Resizer - Resize Images with Custom Dimensions | 24Toolkit',
    description: 'Resize images to custom dimensions while maintaining quality. Free image resizer with multiple size options and aspect ratio control.',
    keywords: 'image resizer, resize image, image dimensions, scale image, image size'
  },
  'image-cropper': {
    title: 'Image Cropper - Crop Images with Drag-and-Drop | 24Toolkit',
    description: 'Crop images easily with drag-and-drop interface. Free image cropper with zoom, rotate, and aspect ratio options.',
    keywords: 'image cropper, crop image, image crop tool, photo cropper, cut image'
  },
  'background-remover': {
    title: 'Background Remover - Remove Image Backgrounds Automatically | 24Toolkit',
    description: 'Remove image backgrounds automatically with AI. Free background remover for creating transparent PNG images.',
    keywords: 'background remover, remove background, transparent background, bg remover, cut out image'
  },
  'image-filter-editor': {
    title: 'Image Filter Editor - Apply Filters and Effects to Images | 24Toolkit',
    description: 'Apply filters, effects, and adjustments to images. Free image editor with brightness, contrast, saturation, and more.',
    keywords: 'image filter, photo editor, image effects, edit image, photo filters'
  },
  'watermark-adder': {
    title: 'Watermark Adder - Add Text or Image Watermarks | 24Toolkit',
    description: 'Add text or image watermarks to protect your photos. Free watermark tool with custom positioning and opacity.',
    keywords: 'watermark adder, add watermark, image watermark, photo watermark, protect images'
  },
  'meme-generator': {
    title: 'Meme Generator - Create Memes with Custom Text | 24Toolkit',
    description: 'Create memes with custom text, fonts, and images. Free meme generator with popular meme templates and custom uploads.',
    keywords: 'meme generator, create memes, meme maker, funny memes, meme creator'
  },
  'image-format-converter': {
    title: 'Image Format Converter - Convert Between Image Formats | 24Toolkit',
    description: 'Convert images between JPG, PNG, WebP, GIF, and more formats. Free image converter with batch processing.',
    keywords: 'image converter, format converter, JPG to PNG, PNG to JPG, image format'
  },
  'image-rotator': {
    title: 'Image Rotator - Rotate and Flip Images | 24Toolkit',
    description: 'Rotate images by any angle and flip horizontally or vertically. Free image rotation tool with instant preview.',
    keywords: 'image rotator, rotate image, flip image, rotate photo, image rotation'
  },
  'image-color-extractor': {
    title: 'Image Color Extractor - Extract Color Palette from Images | 24Toolkit',
    description: 'Extract dominant colors and color palettes from images. Free color picker tool with hex, RGB, and HSL codes.',
    keywords: 'color extractor, color palette, image colors, color picker, extract colors'
  },
  'image-compressor': {
    title: 'Image Compressor - Reduce Image File Sizes | 24Toolkit',
    description: 'Compress images to reduce file size while maintaining quality. Free image compressor for JPG, PNG, and WebP formats.',
    keywords: 'image compressor, compress image, reduce file size, optimize image, image optimization'
  },
  'image-to-text': {
    title: 'Image to Text (OCR) - Extract Text from Images | 24Toolkit',
    description: 'Extract text from images using OCR technology. Free image to text converter that recognizes text in photos and scanned documents.',
    keywords: 'image to text, OCR, extract text, text recognition, image text extractor'
  },

  // Security Tools
  'hash-generator': {
    title: 'Hash Generator - Generate Cryptographic Hashes | 24Toolkit',
    description: 'Generate cryptographic hashes including MD5, SHA-1, SHA-256, and more. Free hash generator for text and files.',
    keywords: 'hash generator, MD5, SHA-256, SHA-1, cryptographic hash, hash function'
  },
  'password-strength-checker': {
    title: 'Password Strength Checker - Analyze Password Security | 24Toolkit',
    description: 'Check password strength and get security recommendations. Free password analyzer that evaluates complexity and vulnerability.',
    keywords: 'password strength, password checker, password security, strong password, password analyzer'
  },
  'file-hash-verifier': {
    title: 'File Hash Verifier - Verify File Integrity with Hashes | 24Toolkit',
    description: 'Verify file integrity by comparing file hashes. Free file hash checker for MD5, SHA-1, SHA-256 verification.',
    keywords: 'file hash, verify hash, hash verifier, file integrity, checksum'
  },
  'url-phishing-checker': {
    title: 'URL Phishing Checker - Check URLs for Phishing Indicators | 24Toolkit',
    description: 'Check URLs for phishing and suspicious indicators. Free URL scanner that detects potential security threats.',
    keywords: 'phishing checker, URL scanner, phishing detection, suspicious link, URL security'
  },
  'aes-encryptor': {
    title: 'AES Encryptor - Encrypt and Decrypt Text with AES | 24Toolkit',
    description: 'Encrypt and decrypt text using AES encryption. Free AES tool with 128, 192, and 256-bit encryption support.',
    keywords: 'AES encryption, AES encryptor, encrypt text, decrypt text, AES cipher'
  },
  'secure-password-generator': {
    title: 'Secure Password Generator - Generate Strong Passwords | 24Toolkit',
    description: 'Generate cryptographically secure passwords with custom requirements. Free password generator with strength options.',
    keywords: 'secure password, password generator, strong password, random password, generate password'
  },
  'ssl-checker': {
    title: 'SSL Certificate Checker - Verify SSL Certificate Details | 24Toolkit',
    description: 'Check SSL certificate details including expiration, issuer, and security info. Free SSL checker for website security.',
    keywords: 'SSL checker, SSL certificate, HTTPS checker, SSL verification, certificate checker'
  },
  'text-encryptor': {
    title: 'Text Encryptor - Simple Text Encryption and Decryption | 24Toolkit',
    description: 'Encrypt and decrypt text with simple password-based encryption. Free text encryptor for secure message sharing.',
    keywords: 'text encryption, encrypt text, decrypt text, text encryptor, secure text'
  },
  'ip-blacklist-checker': {
    title: 'IP Blacklist Checker - Check if IP is Blacklisted | 24Toolkit',
    description: 'Check if an IP address is blacklisted on major spam databases. Free IP blacklist lookup for email and server security.',
    keywords: 'IP blacklist, blacklist checker, IP reputation, spam checker, IP lookup'
  },
  'http-redirect-checker': {
    title: 'HTTP Redirect Checker - Check HTTP Redirects | 24Toolkit',
    description: 'Check HTTP redirects and trace redirect chains. Free redirect checker for SEO and troubleshooting.',
    keywords: 'redirect checker, HTTP redirect, 301 redirect, redirect chain, URL redirect'
  },
  'random-string-generator': {
    title: 'Random String Generator - Generate Random Strings | 24Toolkit',
    description: 'Generate random strings with custom length and character sets. Free random string generator for tokens, passwords, and IDs.',
    keywords: 'random string, string generator, random text, generate string, random characters'
  },

  // Calculators
  'percentage-calculator': {
    title: 'Percentage Calculator - Calculate Percentages Easily | 24Toolkit',
    description: 'Calculate percentages, percentage increase/decrease, and percentage of numbers. Free percentage calculator with multiple operations.',
    keywords: 'percentage calculator, calculate percentage, percent calculator, percentage increase'
  },
  'age-calculator': {
    title: 'Age Calculator - Calculate Age from Birth Date | 24Toolkit',
    description: 'Calculate age in years, months, days, hours from birth date. Free age calculator with exact age and next birthday.',
    keywords: 'age calculator, calculate age, birth date calculator, how old am I, age from date'
  },
  'bmi-calculator': {
    title: 'BMI Calculator - Calculate Body Mass Index | 24Toolkit',
    description: 'Calculate Body Mass Index (BMI) and get health category. Free BMI calculator with metric and imperial units.',
    keywords: 'BMI calculator, body mass index, BMI, calculate BMI, health calculator'
  },
  'tip-calculator': {
    title: 'Tip Calculator - Calculate Tips and Split Bills | 24Toolkit',
    description: 'Calculate tips and split bills easily. Free tip calculator with custom percentages and bill splitting.',
    keywords: 'tip calculator, calculate tip, split bill, tip percentage, bill splitter'
  },
  'discount-calculator': {
    title: 'Discount Calculator - Calculate Discounts and Final Prices | 24Toolkit',
    description: 'Calculate discounts, final prices, and savings amount. Free discount calculator with percentage and amount off.',
    keywords: 'discount calculator, calculate discount, sale price, discount percentage, savings calculator'
  },
  'currency-converter': {
    title: 'Currency Converter - Convert Between Currencies | 24Toolkit',
    description: 'Convert between major world currencies with real-time exchange rates. Free currency converter with 150+ currencies.',
    keywords: 'currency converter, exchange rate, convert currency, money converter, forex'
  },
  'unit-converter': {
    title: 'Unit Converter - Convert Between Various Units | 24Toolkit',
    description: 'Convert between length, weight, temperature, volume, and more units. Free unit converter with multiple categories.',
    keywords: 'unit converter, convert units, measurement converter, length converter, weight converter'
  },

  // Fun & Productivity Tools
  'password-generator': {
    title: 'Password Generator - Generate Secure Random Passwords | 24Toolkit',
    description: 'Generate strong, random passwords with custom options. Free password generator with length, characters, and strength settings.',
    keywords: 'password generator, random password, strong password, generate password, secure password'
  },
  'qr-generator': {
    title: 'QR Code Generator - Create QR Codes Instantly | 24Toolkit',
    description: 'Create QR codes for URLs, text, WiFi, and more. Free QR code generator with download options and customization.',
    keywords: 'QR code generator, create QR code, QR code maker, generate QR code, QR generator'
  },
  'color-picker': {
    title: 'Color Picker - Pick and Generate Color Palettes | 24Toolkit',
    description: 'Pick colors and generate color palettes with hex, RGB, and HSL codes. Free color picker for designers and developers.',
    keywords: 'color picker, color palette, hex color, RGB color, color generator'
  },
  'random-quote-generator': {
    title: 'Random Quote Generator - Get Inspiring Random Quotes | 24Toolkit',
    description: 'Get inspiring, motivational, and funny random quotes. Free quote generator with thousands of quotes from famous people.',
    keywords: 'random quote, quote generator, inspirational quotes, motivational quotes, famous quotes'
  },
  'random-name-generator': {
    title: 'Random Name Generator - Generate Random Names | 24Toolkit',
    description: 'Generate random names for characters, usernames, or projects. Free name generator with first and last names.',
    keywords: 'random name, name generator, random name generator, character names, username generator'
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator - Generate Placeholder Text | 24Toolkit',
    description: 'Generate Lorem Ipsum placeholder text for designs and mockups. Free Lorem Ipsum generator with custom length.',
    keywords: 'lorem ipsum, placeholder text, dummy text, lorem generator, filler text'
  },
  'random-number-picker': {
    title: 'Random Number Picker - Pick Random Numbers | 24Toolkit',
    description: 'Pick random numbers within a custom range. Free random number generator for games, raffles, and decisions.',
    keywords: 'random number, number picker, random number generator, pick number, number generator'
  },
  'dice-roller-coin-flipper': {
    title: 'Dice Roller & Coin Flipper - Roll Dice and Flip Coins | 24Toolkit',
    description: 'Roll dice and flip coins virtually. Free dice roller and coin flipper for games and random decisions.',
    keywords: 'dice roller, coin flipper, roll dice, flip coin, random dice'
  },
  'countdown-timer': {
    title: 'Countdown Timer - Create Custom Countdown Timers | 24Toolkit',
    description: 'Create custom countdown timers for events, deadlines, or goals. Free countdown timer with alarm and notifications.',
    keywords: 'countdown timer, timer, countdown, event timer, deadline timer'
  },
  'stopwatch': {
    title: 'Stopwatch - Precise Time Tracking | 24Toolkit',
    description: 'Accurate stopwatch for precise time tracking with lap times. Free stopwatch with start, stop, and reset functions.',
    keywords: 'stopwatch, timer, time tracker, lap timer, precise timer'
  },
  'pomodoro-timer': {
    title: 'Pomodoro Timer - Focus Timer with Work/Break Intervals | 24Toolkit',
    description: 'Pomodoro timer for focused work sessions with break intervals. Free productivity timer based on the Pomodoro Technique.',
    keywords: 'pomodoro timer, focus timer, productivity timer, work timer, pomodoro technique'
  },
  'notepad': {
    title: 'Notepad - Quick Note Taking | 24Toolkit',
    description: 'Simple, fast notepad for quick note taking. Free online notepad with auto-save and export options.',
    keywords: 'notepad, online notepad, notes, quick notes, text editor'
  },
  'daily-planner-template': {
    title: 'Daily Planner - Plan Your Day with Templates | 24Toolkit',
    description: 'Plan your day with customizable daily planner templates. Free daily planner for productivity and time management.',
    keywords: 'daily planner, day planner, planner template, productivity planner, schedule planner'
  },
  'text-to-speech': {
    title: 'Text to Speech - Convert Text to Natural Speech | 24Toolkit',
    description: 'Convert text to natural-sounding speech with multiple voices. Free text to speech tool with adjustable speed and voice options.',
    keywords: 'text to speech, TTS, speech synthesis, read text aloud, voice generator'
  },
  'pdf-to-word': {
    title: 'PDF to Word - Convert PDF to Editable Word Documents | 24Toolkit',
    description: 'Convert PDF files to editable Word documents. Free PDF to Word converter that preserves formatting and layout.',
    keywords: 'PDF to Word, convert PDF, PDF converter, PDF to DOCX, document converter'
  }
}

export function getPageMetadata(pageKey: string): PageMetadata {
  return seoMetadata[pageKey] || seoMetadata.home
}

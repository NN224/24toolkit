import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React, { Suspense, useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Layout from '@/components/Layout'
import ScrollToTop from '@/components/ScrollToTop'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { CookieConsent } from '@/components/CookieConsent'
import { UserProgress } from '@/components/UserProgress'
import { AuthProvider } from '@/contexts/AuthContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { UpgradeModal } from '@/components/UpgradeModal'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'

// Admin components (lazy loaded)
const AdminRoutes = React.lazy(() => import('@/pages/admin/AdminRoutes'))
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import TermsOfServicePage from '@/pages/TermsOfServicePage'
import ContactPage from '@/pages/ContactPage'
import SitemapPage from '@/pages/SitemapPage'
import SettingsPage from '@/pages/SettingsPage'
import SignInPage from '@/pages/SignInPage'
import PricingPage from '@/pages/PricingPage'

/*
 * React 19 Compatibility Notes:
 * 
 * This app uses React 19 (^19.0.0). Some dependencies may have peer dependency warnings:
 * 
 * 1. recharts (^2.15.1) - Charts library
 *    - May show peer dep warning for React 18, but works with React 19 at runtime.
 *    - Wrapped in ErrorBoundary to gracefully handle any render issues.
 * 
 * 2. react-day-picker (^9.6.7) - Date picker component
 *    - v9.x has React 19 support. Should work without issues.
 * 
 * 3. react-easy-crop (^5.5.3) - Image cropping
 *    - May need monitoring for React 19 compatibility.
 * 
 * If encountering crashes, check browser console and consider:
 * - Using stable React 18 for production until deps catch up
 * - Adding try-catch in affected components
 * - Pinning problematic dep versions
 */

// Lazy load all tool pages for optimal bundle splitting
const WordCounter = React.lazy(() => import('@/pages/tools/WordCounter'))
const PasswordGenerator = React.lazy(() => import('@/pages/tools/PasswordGenerator'))
const QRGenerator = React.lazy(() => import('@/pages/tools/QRGenerator'))
const JSONCSVConverter = React.lazy(() => import('@/pages/tools/JSONCSVConverter'))
const ImageCompressor = React.lazy(() => import('@/pages/tools/ImageCompressor'))
const TextToSpeech = React.lazy(() => import('@/pages/tools/TextToSpeech'))
const PDFToWord = React.lazy(() => import('@/pages/tools/PDFToWord'))
const ColorPicker = React.lazy(() => import('@/pages/tools/ColorPicker'))
const ImageToText = React.lazy(() => import('@/pages/tools/ImageToText'))
const UnitConverter = React.lazy(() => import('@/pages/tools/UnitConverter'))
const TextSummarizer = React.lazy(() => import('@/pages/tools/TextSummarizer'))
const ParagraphRewriter = React.lazy(() => import('@/pages/tools/ParagraphRewriter'))
const CodeFormatter = React.lazy(() => import('@/pages/tools/CodeFormatter'))
const ImageCaptionGenerator = React.lazy(() => import('@/pages/tools/ImageCaptionGenerator'))
const AITaskBuilder = React.lazy(() => import('@/pages/tools/AITaskBuilder'))
const AIToolChains = React.lazy(() => import('@/pages/tools/AIToolChains'))
const AIUsageDashboard = React.lazy(() => import('@/pages/tools/AIUsageDashboard'))
const AIPromptPresets = React.lazy(() => import('@/pages/tools/AIPromptPresets'))
const SmartHistory = React.lazy(() => import('@/pages/tools/SmartHistory'))
const MultiToolChat = React.lazy(() => import('@/pages/tools/MultiToolChat'))
const AIIdeaAnalyzer = React.lazy(() => import('@/pages/tools/AIIdeaAnalyzer'))
const TextCaseConverter = React.lazy(() => import('@/pages/tools/TextCaseConverter'))
const RemoveLineBreaks = React.lazy(() => import('@/pages/tools/RemoveLineBreaks'))
const WordFrequencyAnalyzer = React.lazy(() => import('@/pages/tools/WordFrequencyAnalyzer'))
const FindReplace = React.lazy(() => import('@/pages/tools/FindReplace'))
const EmojiTool = React.lazy(() => import('@/pages/tools/EmojiTool'))
const TextDiffChecker = React.lazy(() => import('@/pages/tools/TextDiffChecker'))
const TextReverser = React.lazy(() => import('@/pages/tools/TextReverser'))
const PalindromeChecker = React.lazy(() => import('@/pages/tools/PalindromeChecker'))
const GrammarCorrector = React.lazy(() => import('@/pages/tools/GrammarCorrector'))
const SentenceCounter = React.lazy(() => import('@/pages/tools/SentenceCounter'))
const HTMLFormatter = React.lazy(() => import('@/pages/tools/HTMLFormatter'))
const RegexTester = React.lazy(() => import('@/pages/tools/RegexTester'))
const JSONBeautifier = React.lazy(() => import('@/pages/tools/JSONBeautifier'))
const Base64Tool = React.lazy(() => import('@/pages/tools/Base64Tool'))
const URLEncoderDecoder = React.lazy(() => import('@/pages/tools/URLEncoderDecoder'))
const UUIDGenerator = React.lazy(() => import('@/pages/tools/UUIDGenerator'))
const TimestampConverter = React.lazy(() => import('@/pages/tools/TimestampConverter'))
const JWTDecoder = React.lazy(() => import('@/pages/tools/JWTDecoder'))
const TextEncryptor = React.lazy(() => import('@/pages/tools/TextEncryptor'))
const MarkdownPreviewer = React.lazy(() => import('@/pages/tools/MarkdownPreviewer'))
const ImageResizer = React.lazy(() => import('@/pages/tools/ImageResizer'))
const ImageCropper = React.lazy(() => import('@/pages/tools/ImageCropper'))
const BackgroundRemover = React.lazy(() => import('@/pages/tools/BackgroundRemover'))
const ImageFilterEditor = React.lazy(() => import('@/pages/tools/ImageFilterEditor'))
const WatermarkAdder = React.lazy(() => import('@/pages/tools/WatermarkAdder'))
const MemeGenerator = React.lazy(() => import('@/pages/tools/MemeGenerator'))
const ImageFormatConverter = React.lazy(() => import('@/pages/tools/ImageFormatConverter'))
const ImageRotator = React.lazy(() => import('@/pages/tools/ImageRotator'))
const ImageColorExtractor = React.lazy(() => import('@/pages/tools/ImageColorExtractor'))
const ImageCompressorV2 = React.lazy(() => import('@/pages/tools/ImageCompressorV2'))
const PercentageCalculator = React.lazy(() => import('@/pages/tools/PercentageCalculator'))
const AgeCalculator = React.lazy(() => import('@/pages/tools/AgeCalculator'))
const BMICalculator = React.lazy(() => import('@/pages/tools/BMICalculator'))
const TipCalculator = React.lazy(() => import('@/pages/tools/TipCalculator'))
const DiscountCalculator = React.lazy(() => import('@/pages/tools/DiscountCalculator'))
const CurrencyConverter = React.lazy(() => import('@/pages/tools/CurrencyConverter'))
const AITranslator = React.lazy(() => import('@/pages/tools/AITranslator'))
const AIEmailWriter = React.lazy(() => import('@/pages/tools/AIEmailWriter'))
const AIHashtagGenerator = React.lazy(() => import('@/pages/tools/AIHashtagGenerator'))
const MetaTagGenerator = React.lazy(() => import('@/pages/tools/MetaTagGenerator'))
const IPAddressFinder = React.lazy(() => import('@/pages/tools/IPAddressFinder'))
const HTTPHeaderAnalyzer = React.lazy(() => import('@/pages/tools/HTTPHeaderAnalyzer'))
const HashGenerator = React.lazy(() => import('@/pages/tools/HashGenerator'))
const PasswordStrengthChecker = React.lazy(() => import('@/pages/tools/PasswordStrengthChecker'))
const FileHashVerifier = React.lazy(() => import('@/pages/tools/FileHashVerifier'))
const URLPhishingChecker = React.lazy(() => import('@/pages/tools/URLPhishingChecker'))
const AESEncryptor = React.lazy(() => import('@/pages/tools/AESEncryptor'))
const SecurePasswordGenerator = React.lazy(() => import('@/pages/tools/SecurePasswordGenerator'))
const SSLChecker = React.lazy(() => import('@/pages/tools/SSLChecker'))
const RandomStringGenerator = React.lazy(() => import('@/pages/tools/RandomStringGenerator'))
const IPBlacklistChecker = React.lazy(() => import('@/pages/tools/IPBlacklistChecker'))
const HTTPRedirectChecker = React.lazy(() => import('@/pages/tools/HTTPRedirectChecker'))
const RandomQuoteGenerator = React.lazy(() => import('@/pages/tools/RandomQuoteGenerator'))
const RandomNameGenerator = React.lazy(() => import('@/pages/tools/RandomNameGenerator'))
const LoremIpsumGenerator = React.lazy(() => import('@/pages/tools/LoremIpsumGenerator'))
const RandomNumberPicker = React.lazy(() => import('@/pages/tools/RandomNumberPicker'))
const DiceRollerCoinFlipper = React.lazy(() => import('@/pages/tools/DiceRollerCoinFlipper'))
const CountdownTimer = React.lazy(() => import('@/pages/tools/CountdownTimer'))
const Stopwatch = React.lazy(() => import('@/pages/tools/Stopwatch'))
const Notepad = React.lazy(() => import('@/pages/tools/Notepad'))
const DailyPlannerTemplate = React.lazy(() => import('@/pages/tools/DailyPlannerTemplate'))
const PomodoroTimer = React.lazy(() => import('@/pages/tools/PomodoroTimer'))

// Beautiful loading fallback component with skeleton
const LoadingFallback = ({ name = 'tool' }: { name?: string }) => (
  <div className="p-8 animate-scale-pop">
    <div className="max-w-3xl mx-auto">
      {/* Header skeleton */}
      <div className="text-center mb-8 space-y-4">
        <div className="skeleton w-64 h-10 mx-auto rounded-lg" />
        <div className="skeleton w-96 h-6 mx-auto rounded-lg" />
      </div>
      
      {/* Card skeleton */}
      <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
        <div className="skeleton w-48 h-6 rounded-lg" />
        <div className="skeleton w-full h-32 rounded-lg" />
        <div className="skeleton w-32 h-10 rounded-lg" />
      </div>
      
      <p className="text-center mt-6 text-muted-foreground text-sm">
        ✨ Loading {name}...
      </p>
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
      <BrowserRouter>
        <GoogleAnalytics />
        <CookieConsent />
        <UserProgress />
        <ScrollToTop />
        <UpgradeModal />
        <ErrorBoundary>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="sitemap" element={<SitemapPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="tools/word-counter" element={<Suspense fallback={<LoadingFallback name="Word Counter" />}><WordCounter /></Suspense>} />
          <Route path="tools/password-generator" element={<Suspense fallback={<LoadingFallback name="Password Generator" />}><PasswordGenerator /></Suspense>} />
          <Route path="tools/qr-generator" element={<Suspense fallback={<LoadingFallback name="QR Generator" />}><QRGenerator /></Suspense>} />
          <Route path="tools/json-csv-converter" element={<Suspense fallback={<LoadingFallback name="JSON/CSV Converter" />}><JSONCSVConverter /></Suspense>} />
          <Route
            path="tools/image-compressor"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading Image Compressor...</div>}>
                  <ImageCompressor />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="tools/text-to-speech" element={<ProtectedRoute><Suspense fallback={<LoadingFallback name="Text to Speech" />}><TextToSpeech /></Suspense></ProtectedRoute>} />
          <Route path="tools/pdf-to-word" element={<ProtectedRoute><Suspense fallback={<LoadingFallback name="PDF to Word" />}><PDFToWord /></Suspense></ProtectedRoute>} />
          <Route path="tools/color-picker" element={<Suspense fallback={<LoadingFallback name="Color Picker" />}><ColorPicker /></Suspense>} />
          <Route
            path="tools/image-to-text"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading Image to Text...</div>}>
                  <ImageToText />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="tools/unit-converter" element={<Suspense fallback={<LoadingFallback name="Unit Converter" />}><UnitConverter /></Suspense>} />
          <Route path="tools/text-summarizer" element={<ProtectedRoute><Suspense fallback={<LoadingFallback name="Text Summarizer" />}><TextSummarizer /></Suspense></ProtectedRoute>} />
          <Route path="tools/paragraph-rewriter" element={<ProtectedRoute><Suspense fallback={<LoadingFallback name="Paragraph Rewriter" />}><ParagraphRewriter /></Suspense></ProtectedRoute>} />
          <Route path="tools/code-formatter" element={<ProtectedRoute><Suspense fallback={<LoadingFallback name="Code Formatter" />}><CodeFormatter /></Suspense></ProtectedRoute>} />
          <Route
            path="tools/image-caption-generator"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading Image Caption Generator...</div>}>
                  <ImageCaptionGenerator />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-task-builder"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Task Builder...</div>}>
                  <AITaskBuilder />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-tool-chains"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Tool Chains...</div>}>
                  <AIToolChains />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-usage-dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Usage Dashboard...</div>}>
                  <AIUsageDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-prompt-presets"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Prompt Presets...</div>}>
                  <AIPromptPresets />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/smart-history"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading Smart History...</div>}>
                  <SmartHistory />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/multi-tool-chat"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading Multi-Tool Chat...</div>}>
                  <MultiToolChat />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-idea-analyzer"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading Idea Analyzer...</div>}>
                  <AIIdeaAnalyzer />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="tools/text-case-converter" element={<Suspense fallback={<LoadingFallback name="Text Case Converter" />}><TextCaseConverter /></Suspense>} />
          <Route path="tools/remove-line-breaks" element={<Suspense fallback={<LoadingFallback name="Remove Line Breaks" />}><RemoveLineBreaks /></Suspense>} />
          <Route path="tools/word-frequency-analyzer" element={<Suspense fallback={<LoadingFallback name="Word Frequency Analyzer" />}><WordFrequencyAnalyzer /></Suspense>} />
          <Route path="tools/find-replace" element={<Suspense fallback={<LoadingFallback name="Find & Replace" />}><FindReplace /></Suspense>} />
          <Route path="tools/emoji-tool" element={<Suspense fallback={<LoadingFallback name="Emoji Tool" />}><EmojiTool /></Suspense>} />
          <Route path="tools/text-diff-checker" element={<Suspense fallback={<LoadingFallback name="Text Diff Checker" />}><TextDiffChecker /></Suspense>} />
          <Route path="tools/text-reverser" element={<Suspense fallback={<LoadingFallback name="Text Reverser" />}><TextReverser /></Suspense>} />
          <Route path="tools/palindrome-checker" element={<Suspense fallback={<LoadingFallback name="Palindrome Checker" />}><PalindromeChecker /></Suspense>} />
          <Route path="tools/grammar-corrector" element={<ProtectedRoute><Suspense fallback={<LoadingFallback name="Grammar Corrector" />}><GrammarCorrector /></Suspense></ProtectedRoute>} />
          <Route path="tools/sentence-counter" element={<Suspense fallback={<LoadingFallback name="Sentence Counter" />}><SentenceCounter /></Suspense>} />
          <Route path="tools/html-formatter" element={<Suspense fallback={<LoadingFallback name="HTML Formatter" />}><HTMLFormatter /></Suspense>} />
          <Route path="tools/regex-tester" element={<Suspense fallback={<LoadingFallback name="Regex Tester" />}><RegexTester /></Suspense>} />
          <Route path="tools/json-beautifier" element={<Suspense fallback={<LoadingFallback name="JSON Beautifier" />}><JSONBeautifier /></Suspense>} />
          <Route path="tools/base64-tool" element={<Suspense fallback={<LoadingFallback name="Base64 Tool" />}><Base64Tool /></Suspense>} />
          <Route path="tools/url-encoder-decoder" element={<Suspense fallback={<LoadingFallback name="URL Encoder/Decoder" />}><URLEncoderDecoder /></Suspense>} />
          <Route path="tools/uuid-generator" element={<Suspense fallback={<LoadingFallback name="UUID Generator" />}><UUIDGenerator /></Suspense>} />
          <Route path="tools/timestamp-converter" element={<Suspense fallback={<LoadingFallback name="Timestamp Converter" />}><TimestampConverter /></Suspense>} />
          <Route path="tools/jwt-decoder" element={<Suspense fallback={<LoadingFallback name="JWT Decoder" />}><JWTDecoder /></Suspense>} />
          <Route path="tools/text-encryptor" element={<Suspense fallback={<LoadingFallback name="Text Encryptor" />}><TextEncryptor /></Suspense>} />
          <Route path="tools/markdown-previewer" element={<Suspense fallback={<LoadingFallback name="Markdown Previewer" />}><MarkdownPreviewer /></Suspense>} />
          <Route
            path="tools/image-resizer"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Resizer...</div>}>
                <ImageResizer />
              </Suspense>
            }
          />
          <Route
            path="tools/image-cropper"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Cropper...</div>}>
                <ImageCropper />
              </Suspense>
            }
          />
          <Route
            path="tools/background-remover"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading tool...</div>}>
                <BackgroundRemover />
              </Suspense>
            }
          />
          <Route
            path="tools/image-filter-editor"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Filter Editor...</div>}>
                <ImageFilterEditor />
              </Suspense>
            }
          />
          <Route
            path="tools/watermark-adder"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Watermark Adder...</div>}>
                <WatermarkAdder />
              </Suspense>
            }
          />
          <Route
            path="tools/meme-generator"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Meme Generator...</div>}>
                <MemeGenerator />
              </Suspense>
            }
          />
          <Route
            path="tools/image-format-converter"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Format Converter...</div>}>
                <ImageFormatConverter />
              </Suspense>
            }
          />
          <Route
            path="tools/image-rotator"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Rotator...</div>}>
                <ImageRotator />
              </Suspense>
            }
          />
          <Route
            path="tools/image-color-extractor"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Color Extractor...</div>}>
                <ImageColorExtractor />
              </Suspense>
            }
          />
          <Route
            path="tools/image-compressor-v2"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Compressor v2...</div>}>
                <ImageCompressorV2 />
              </Suspense>
            }
          />
          <Route path="tools/percentage-calculator" element={<Suspense fallback={<LoadingFallback name="Percentage Calculator" />}><PercentageCalculator /></Suspense>} />
          <Route path="tools/age-calculator" element={<Suspense fallback={<LoadingFallback name="Age Calculator" />}><AgeCalculator /></Suspense>} />
          <Route path="tools/bmi-calculator" element={<Suspense fallback={<LoadingFallback name="BMI Calculator" />}><BMICalculator /></Suspense>} />
          <Route path="tools/tip-calculator" element={<Suspense fallback={<LoadingFallback name="Tip Calculator" />}><TipCalculator /></Suspense>} />
          <Route path="tools/discount-calculator" element={<Suspense fallback={<LoadingFallback name="Discount Calculator" />}><DiscountCalculator /></Suspense>} />
          <Route path="tools/currency-converter" element={<Suspense fallback={<LoadingFallback name="Currency Converter" />}><CurrencyConverter /></Suspense>} />
          <Route
            path="tools/ai-translator"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Translator...</div>}>
                  <AITranslator />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-email-writer"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Email Writer...</div>}>
                  <AIEmailWriter />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="tools/ai-hashtag-generator"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading AI Hashtag Generator...</div>}>
                  <AIHashtagGenerator />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="tools/meta-tag-generator" element={<Suspense fallback={<LoadingFallback name="Meta Tag Generator" />}><MetaTagGenerator /></Suspense>} />
          <Route path="tools/ip-address-finder" element={<Suspense fallback={<LoadingFallback name="IP Address Finder" />}><IPAddressFinder /></Suspense>} />
          <Route path="tools/http-header-analyzer" element={<Suspense fallback={<LoadingFallback name="HTTP Header Analyzer" />}><HTTPHeaderAnalyzer /></Suspense>} />
          <Route path="tools/hash-generator" element={<Suspense fallback={<LoadingFallback name="Hash Generator" />}><HashGenerator /></Suspense>} />
          <Route path="tools/password-strength-checker" element={<Suspense fallback={<LoadingFallback name="Password Strength Checker" />}><PasswordStrengthChecker /></Suspense>} />
          <Route path="tools/file-hash-verifier" element={<Suspense fallback={<LoadingFallback name="File Hash Verifier" />}><FileHashVerifier /></Suspense>} />
          <Route path="tools/url-phishing-checker" element={<Suspense fallback={<LoadingFallback name="URL Phishing Checker" />}><URLPhishingChecker /></Suspense>} />
          <Route path="tools/aes-encryptor" element={<Suspense fallback={<LoadingFallback name="AES Encryptor" />}><AESEncryptor /></Suspense>} />
          <Route path="tools/secure-password-generator" element={<Suspense fallback={<LoadingFallback name="Secure Password Generator" />}><SecurePasswordGenerator /></Suspense>} />
          <Route path="tools/ssl-checker" element={<Suspense fallback={<LoadingFallback name="SSL Checker" />}><SSLChecker /></Suspense>} />
          <Route path="tools/random-string-generator" element={<Suspense fallback={<LoadingFallback name="Random String Generator" />}><RandomStringGenerator /></Suspense>} />
          <Route path="tools/ip-blacklist-checker" element={<Suspense fallback={<LoadingFallback name="IP Blacklist Checker" />}><IPBlacklistChecker /></Suspense>} />
          <Route path="tools/http-redirect-checker" element={<Suspense fallback={<LoadingFallback name="HTTP Redirect Checker" />}><HTTPRedirectChecker /></Suspense>} />
          <Route path="tools/random-quote-generator" element={<Suspense fallback={<LoadingFallback name="Random Quote Generator" />}><RandomQuoteGenerator /></Suspense>} />
          <Route path="tools/random-name-generator" element={<Suspense fallback={<LoadingFallback name="Random Name Generator" />}><RandomNameGenerator /></Suspense>} />
          <Route path="tools/lorem-ipsum-generator" element={<Suspense fallback={<LoadingFallback name="Lorem Ipsum Generator" />}><LoremIpsumGenerator /></Suspense>} />
          <Route path="tools/random-number-picker" element={<Suspense fallback={<LoadingFallback name="Random Number Picker" />}><RandomNumberPicker /></Suspense>} />
          <Route path="tools/dice-roller-coin-flipper" element={<Suspense fallback={<LoadingFallback name="Dice Roller & Coin Flipper" />}><DiceRollerCoinFlipper /></Suspense>} />
          <Route path="tools/countdown-timer" element={<Suspense fallback={<LoadingFallback name="Countdown Timer" />}><CountdownTimer /></Suspense>} />
          <Route path="tools/stopwatch" element={<Suspense fallback={<LoadingFallback name="Stopwatch" />}><Stopwatch /></Suspense>} />
          <Route path="tools/notepad" element={<Suspense fallback={<LoadingFallback name="Notepad" />}><Notepad /></Suspense>} />
          <Route path="tools/daily-planner-template" element={<Suspense fallback={<LoadingFallback name="Daily Planner" />}><DailyPlannerTemplate /></Suspense>} />
          <Route path="tools/pomodoro-timer" element={<Suspense fallback={<LoadingFallback name="Pomodoro Timer" />}><PomodoroTimer /></Suspense>} />
          
          {/* Admin Routes */}
          <Route path="admin/*" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center">Loading Admin Panel...</div></div>}>
              <AdminRoutes />
            </Suspense>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
        </ErrorBoundary>
        <Toaster position="top-center" />
      </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App
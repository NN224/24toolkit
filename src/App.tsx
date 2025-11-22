import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React, { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Layout from '@/components/Layout'
import ScrollToTop from '@/components/ScrollToTop'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { CookieConsent } from '@/components/CookieConsent'
import { UserProgress } from '@/components/UserProgress'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import TermsOfServicePage from '@/pages/TermsOfServicePage'
import ContactPage from '@/pages/ContactPage'
import SitemapPage from '@/pages/SitemapPage'
import WordCounter from '@/pages/tools/WordCounter'
import PasswordGenerator from '@/pages/tools/PasswordGenerator'
import QRGenerator from '@/pages/tools/QRGenerator'
import JSONCSVConverter from '@/pages/tools/JSONCSVConverter'
const ImageCompressor = React.lazy(() => import('@/pages/tools/ImageCompressor'))
import TextToSpeech from '@/pages/tools/TextToSpeech'
import PDFToWord from '@/pages/tools/PDFToWord'
import ColorPicker from '@/pages/tools/ColorPicker'
const ImageToText = React.lazy(() => import('@/pages/tools/ImageToText'))
import UnitConverter from '@/pages/tools/UnitConverter'
import TextSummarizer from '@/pages/tools/TextSummarizer'
import ParagraphRewriter from '@/pages/tools/ParagraphRewriter'
import CodeFormatter from '@/pages/tools/CodeFormatter'
const ImageCaptionGenerator = React.lazy(() => import('@/pages/tools/ImageCaptionGenerator'))
const AITaskBuilder = React.lazy(() => import('@/pages/tools/AITaskBuilder'))
const IdeaAnalyzer = React.lazy(() => import('@/pages/tools/IdeaAnalyzer'))
import TextCaseConverter from '@/pages/tools/TextCaseConverter'
import RemoveLineBreaks from '@/pages/tools/RemoveLineBreaks'
import WordFrequencyAnalyzer from '@/pages/tools/WordFrequencyAnalyzer'
import FindReplace from '@/pages/tools/FindReplace'
import EmojiTool from '@/pages/tools/EmojiTool'
import TextDiffChecker from '@/pages/tools/TextDiffChecker'
import TextReverser from '@/pages/tools/TextReverser'
import PalindromeChecker from '@/pages/tools/PalindromeChecker'
import GrammarCorrector from '@/pages/tools/GrammarCorrector'
import SentenceCounter from '@/pages/tools/SentenceCounter'
import HTMLFormatter from '@/pages/tools/HTMLFormatter'
import RegexTester from '@/pages/tools/RegexTester'
import JSONBeautifier from '@/pages/tools/JSONBeautifier'
import Base64Tool from '@/pages/tools/Base64Tool'
import URLEncoderDecoder from '@/pages/tools/URLEncoderDecoder'
import UUIDGenerator from '@/pages/tools/UUIDGenerator'
import TimestampConverter from '@/pages/tools/TimestampConverter'
import JWTDecoder from '@/pages/tools/JWTDecoder'
import TextEncryptor from '@/pages/tools/TextEncryptor'
import MarkdownPreviewer from '@/pages/tools/MarkdownPreviewer'
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
import PercentageCalculator from '@/pages/tools/PercentageCalculator'
import AgeCalculator from '@/pages/tools/AgeCalculator'
import BMICalculator from '@/pages/tools/BMICalculator'
import TipCalculator from '@/pages/tools/TipCalculator'
import DiscountCalculator from '@/pages/tools/DiscountCalculator'
import CurrencyConverter from '@/pages/tools/CurrencyConverter'
const AITranslator = React.lazy(() => import('@/pages/tools/AITranslator'))
const AIEmailWriter = React.lazy(() => import('@/pages/tools/AIEmailWriter'))
const AIHashtagGenerator = React.lazy(() => import('@/pages/tools/AIHashtagGenerator'))
import MetaTagGenerator from '@/pages/tools/MetaTagGenerator'
import IPAddressFinder from '@/pages/tools/IPAddressFinder'
import HTTPHeaderAnalyzer from '@/pages/tools/HTTPHeaderAnalyzer'
import HashGenerator from '@/pages/tools/HashGenerator'
import PasswordStrengthChecker from '@/pages/tools/PasswordStrengthChecker'
import FileHashVerifier from '@/pages/tools/FileHashVerifier'
import URLPhishingChecker from '@/pages/tools/URLPhishingChecker'
import AESEncryptor from '@/pages/tools/AESEncryptor'
import SecurePasswordGenerator from '@/pages/tools/SecurePasswordGenerator'
import SSLChecker from '@/pages/tools/SSLChecker'
import RandomStringGenerator from '@/pages/tools/RandomStringGenerator'
import IPBlacklistChecker from '@/pages/tools/IPBlacklistChecker'
import HTTPRedirectChecker from '@/pages/tools/HTTPRedirectChecker'
import RandomQuoteGenerator from '@/pages/tools/RandomQuoteGenerator'
import RandomNameGenerator from '@/pages/tools/RandomNameGenerator'
import LoremIpsumGenerator from '@/pages/tools/LoremIpsumGenerator'
import RandomNumberPicker from '@/pages/tools/RandomNumberPicker'
import DiceRollerCoinFlipper from '@/pages/tools/DiceRollerCoinFlipper'
import CountdownTimer from '@/pages/tools/CountdownTimer'
import Stopwatch from '@/pages/tools/Stopwatch'
import Notepad from '@/pages/tools/Notepad'
import DailyPlannerTemplate from '@/pages/tools/DailyPlannerTemplate'
import PomodoroTimer from '@/pages/tools/PomodoroTimer'

function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <CookieConsent />
      <UserProgress />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="sitemap" element={<SitemapPage />} />
          <Route path="tools" element={<Navigate to="/" replace />} />
          <Route path="tools/word-counter" element={<WordCounter />} />
          <Route path="tools/password-generator" element={<PasswordGenerator />} />
          <Route path="tools/qr-generator" element={<QRGenerator />} />
          <Route path="tools/json-csv-converter" element={<JSONCSVConverter />} />
          <Route
            path="tools/image-compressor"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Compressor...</div>}>
                <ImageCompressor />
              </Suspense>
            }
          />
          <Route path="tools/text-to-speech" element={<TextToSpeech />} />
          <Route path="tools/pdf-to-word" element={<PDFToWord />} />
          <Route path="tools/color-picker" element={<ColorPicker />} />
          <Route
            path="tools/image-to-text"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image to Text...</div>}>
                <ImageToText />
              </Suspense>
            }
          />
          <Route path="tools/unit-converter" element={<UnitConverter />} />
          <Route path="tools/text-summarizer" element={<TextSummarizer />} />
          <Route path="tools/paragraph-rewriter" element={<ParagraphRewriter />} />
          <Route path="tools/code-formatter" element={<CodeFormatter />} />
          <Route
            path="tools/image-caption-generator"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Image Caption Generator...</div>}>
                <ImageCaptionGenerator />
              </Suspense>
            }
          />
          <Route
            path="tools/ai-task-builder"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading AI Task Builder...</div>}>
                <AITaskBuilder />
              </Suspense>
            }
          />
          <Route
            path="tools/idea-analyzer"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading Idea Analyzer...</div>}>
                <IdeaAnalyzer />
              </Suspense>
            }
          />
          <Route path="tools/text-case-converter" element={<TextCaseConverter />} />
          <Route path="tools/remove-line-breaks" element={<RemoveLineBreaks />} />
          <Route path="tools/word-frequency-analyzer" element={<WordFrequencyAnalyzer />} />
          <Route path="tools/find-replace" element={<FindReplace />} />
          <Route path="tools/emoji-tool" element={<EmojiTool />} />
          <Route path="tools/text-diff-checker" element={<TextDiffChecker />} />
          <Route path="tools/text-reverser" element={<TextReverser />} />
          <Route path="tools/palindrome-checker" element={<PalindromeChecker />} />
          <Route path="tools/grammar-corrector" element={<GrammarCorrector />} />
          <Route path="tools/sentence-counter" element={<SentenceCounter />} />
          <Route path="tools/html-formatter" element={<HTMLFormatter />} />
          <Route path="tools/regex-tester" element={<RegexTester />} />
          <Route path="tools/json-beautifier" element={<JSONBeautifier />} />
          <Route path="tools/base64-tool" element={<Base64Tool />} />
          <Route path="tools/url-encoder-decoder" element={<URLEncoderDecoder />} />
          <Route path="tools/uuid-generator" element={<UUIDGenerator />} />
          <Route path="tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="tools/jwt-decoder" element={<JWTDecoder />} />
          <Route path="tools/text-encryptor" element={<TextEncryptor />} />
          <Route path="tools/markdown-previewer" element={<MarkdownPreviewer />} />
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
          <Route path="tools/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="tools/age-calculator" element={<AgeCalculator />} />
          <Route path="tools/bmi-calculator" element={<BMICalculator />} />
          <Route path="tools/tip-calculator" element={<TipCalculator />} />
          <Route path="tools/discount-calculator" element={<DiscountCalculator />} />
          <Route path="tools/currency-converter" element={<CurrencyConverter />} />
          <Route
            path="tools/ai-translator"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading AI Translator...</div>}>
                <AITranslator />
              </Suspense>
            }
          />
          <Route
            path="tools/ai-email-writer"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading AI Email Writer...</div>}>
                <AIEmailWriter />
              </Suspense>
            }
          />
          <Route
            path="tools/ai-hashtag-generator"
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading AI Hashtag Generator...</div>}>
                <AIHashtagGenerator />
              </Suspense>
            }
          />
          <Route path="tools/meta-tag-generator" element={<MetaTagGenerator />} />
          <Route path="tools/ip-address-finder" element={<IPAddressFinder />} />
          <Route path="tools/http-header-analyzer" element={<HTTPHeaderAnalyzer />} />
          <Route path="tools/hash-generator" element={<HashGenerator />} />
          <Route path="tools/password-strength-checker" element={<PasswordStrengthChecker />} />
          <Route path="tools/file-hash-verifier" element={<FileHashVerifier />} />
          <Route path="tools/url-phishing-checker" element={<URLPhishingChecker />} />
          <Route path="tools/aes-encryptor" element={<AESEncryptor />} />
          <Route path="tools/secure-password-generator" element={<SecurePasswordGenerator />} />
          <Route path="tools/ssl-checker" element={<SSLChecker />} />
          <Route path="tools/random-string-generator" element={<RandomStringGenerator />} />
          <Route path="tools/ip-blacklist-checker" element={<IPBlacklistChecker />} />
          <Route path="tools/http-redirect-checker" element={<HTTPRedirectChecker />} />
          <Route path="tools/random-quote-generator" element={<RandomQuoteGenerator />} />
          <Route path="tools/random-name-generator" element={<RandomNameGenerator />} />
          <Route path="tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
          <Route path="tools/random-number-picker" element={<RandomNumberPicker />} />
          <Route path="tools/dice-roller-coin-flipper" element={<DiceRollerCoinFlipper />} />
          <Route path="tools/countdown-timer" element={<CountdownTimer />} />
          <Route path="tools/stopwatch" element={<Stopwatch />} />
          <Route path="tools/notepad" element={<Notepad />} />
          <Route path="tools/daily-planner-template" element={<DailyPlannerTemplate />} />
          <Route path="tools/pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lightbulb, Sparkle, ArrowRight, Question } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'
import { allTools } from '@/lib/tools-data'
import { useTranslation } from 'react-i18next'

interface ContextualTip {
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  action?: {
    label: string
    labelAr: string
    path: string
  }
}

// Tips for each tool/page
const CONTEXTUAL_TIPS: Record<string, ContextualTip[]> = {
  '/tools/text-summarizer': [
    {
      title: 'Pro Tip: Use medium length for balance',
      titleAr: 'نصيحة: استخدم الطول المتوسط للتوازن',
      description: 'Medium length summaries capture key points without losing important details.',
      descriptionAr: 'الملخصات المتوسطة تلتقط النقاط الرئيسية دون فقدان التفاصيل المهمة.'
    },
    {
      title: 'Translate your summary',
      titleAr: 'ترجم ملخصك',
      description: 'After summarizing, translate to another language with our AI Translator.',
      descriptionAr: 'بعد التلخيص، ترجم لغة أخرى بالمترجم الذكي.',
      action: { label: 'Try Translator', labelAr: 'جرب المترجم', path: '/tools/ai-translator' }
    }
  ],
  '/tools/ai-translator': [
    {
      title: 'Natural translations',
      titleAr: 'ترجمات طبيعية',
      description: 'Our AI preserves context and idioms for natural-sounding translations.',
      descriptionAr: 'الذكاء الاصطناعي يحافظ على السياق والتعابير للترجمات الطبيعية.'
    },
    {
      title: 'Summarize translated text',
      titleAr: 'لخص النص المترجم',
      description: 'Chain your workflow: translate then summarize in one go.',
      descriptionAr: 'سلسل عملك: ترجم ثم لخص بخطوة واحدة.',
      action: { label: 'AI Tool Chains', labelAr: 'سلاسل الأدوات', path: '/tools/ai-tool-chains' }
    }
  ],
  '/tools/ai-email-writer': [
    {
      title: 'Choose the right tone',
      titleAr: 'اختر النبرة المناسبة',
      description: 'Professional for work, friendly for colleagues, formal for executives.',
      descriptionAr: 'احترافي للعمل، ودي للزملاء، رسمي للمدراء.'
    },
    {
      title: 'Check grammar after',
      titleAr: 'تحقق من القواعد',
      description: 'Polish your email with our Grammar Corrector for perfect results.',
      descriptionAr: 'صقل بريدك بمصحح القواعد للحصول على نتائج مثالية.',
      action: { label: 'Grammar Check', labelAr: 'فحص القواعد', path: '/tools/grammar-corrector' }
    }
  ],
  '/tools/image-compressor': [
    {
      title: 'Optimal quality: 70-80%',
      titleAr: 'الجودة المثلى: 70-80%',
      description: 'This range offers the best balance between quality and file size reduction.',
      descriptionAr: 'هذا النطاق يوفر أفضل توازن بين الجودة وتقليل حجم الملف.'
    },
    {
      title: 'Resize for more savings',
      titleAr: 'غيّر الحجم لتوفير أكثر',
      description: 'For even smaller files, try our Image Resizer first.',
      descriptionAr: 'لملفات أصغر، جرب مغيّر حجم الصور أولاً.',
      action: { label: 'Image Resizer', labelAr: 'مغير الحجم', path: '/tools/image-resizer' }
    }
  ],
  '/tools/password-generator': [
    {
      title: 'Longer = Stronger',
      titleAr: 'أطول = أقوى',
      description: 'Passwords 16+ characters are virtually uncrackable with current technology.',
      descriptionAr: 'كلمات المرور بـ 16+ حرف غير قابلة للكسر عملياً بالتقنية الحالية.'
    },
    {
      title: 'Use all character types',
      titleAr: 'استخدم كل أنواع الأحرف',
      description: 'Mixing uppercase, lowercase, numbers, and symbols maximizes security.',
      descriptionAr: 'مزج الأحرف الكبيرة والصغيرة والأرقام والرموز يزيد الأمان.'
    }
  ],
  '/tools/qr-generator': [
    {
      title: 'Test before sharing',
      titleAr: 'اختبر قبل المشاركة',
      description: 'Always scan your QR code with your phone to verify it works correctly.',
      descriptionAr: 'امسح رمز QR بهاتفك دائماً للتحقق من أنه يعمل بشكل صحيح.'
    }
  ],
  '/tools/code-formatter': [
    {
      title: 'AI explains your code',
      titleAr: 'الذكاء الاصطناعي يشرح كودك',
      description: 'Get explanations for complex code blocks in plain language.',
      descriptionAr: 'احصل على شرح للكود المعقد بلغة بسيطة.'
    }
  ],
  '/': [
    {
      title: 'Discover AI-powered tools',
      titleAr: 'اكتشف أدوات الذكاء الاصطناعي',
      description: 'Try our AI tools for writing, translation, and content creation.',
      descriptionAr: 'جرب أدوات AI للكتابة والترجمة وإنشاء المحتوى.',
      action: { label: 'Browse AI Tools', labelAr: 'تصفح أدوات AI', path: '/tools/text-summarizer' }
    }
  ]
}

// Default tips for tools without specific tips
const DEFAULT_TIPS: ContextualTip[] = [
  {
    title: 'Track your usage',
    titleAr: 'تتبع استخدامك',
    description: 'See your AI usage statistics and get personalized recommendations.',
    descriptionAr: 'شاهد إحصائيات استخدامك للذكاء الاصطناعي واحصل على توصيات شخصية.',
    action: { label: 'Usage Dashboard', labelAr: 'لوحة الاستخدام', path: '/tools/ai-usage-dashboard' }
  }
]

export function ContextualAIHelper() {
  const location = useLocation()
  const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
  }, [])

  // Get tips for current page
  const getTipsForPath = useCallback((path: string): ContextualTip[] => {
    // Exact match first
    if (CONTEXTUAL_TIPS[path]) {
      return CONTEXTUAL_TIPS[path]
    }
    
    // Check if it's a tool page
    if (path.startsWith('/tools/')) {
      const tool = allTools.find(t => t.path === path)
      if (tool?.isAI) {
        return DEFAULT_TIPS
      }
    }
    
    return []
  }, [])

  // Show tip on page change
  useEffect(() => {
    setDismissed(false)
    const tips = getTipsForPath(location.pathname)
    
    if (tips.length > 0) {
      // Show tip after a short delay
      const timer = setTimeout(() => {
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        setCurrentTip(randomTip)
        setIsVisible(true)
      }, 3000) // 3 second delay
      
      // Auto-hide after 15 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 18000)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    } else {
      setIsVisible(false)
    }
  }, [location.pathname, getTipsForPath])

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
  }

  if (dismissed || !currentTip) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 right-6 w-[320px] max-w-[calc(100vw-3rem)] z-40"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-yellow-500/30 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={18} weight="fill" className="text-yellow-500" />
                <span className="text-sm font-medium text-foreground">
                  Smart Tip
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-foreground mb-1">
                {isArabic ? currentTip.titleAr : currentTip.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {isArabic ? currentTip.descriptionAr : currentTip.description}
              </p>
              
              {currentTip.action && (
                <Link
                  to={currentTip.action.path}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
                >
                  {isArabic ? currentTip.action.labelAr : currentTip.action.label}
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Help button that shows on tool pages
 */
interface ToolHelpButtonProps {
  toolId: string
}

export function ToolHelpButton({ toolId }: ToolHelpButtonProps) {
  const [showHelp, setShowHelp] = useState(false)
  const { t } = useTranslation()
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
  }, [])

  const tool = allTools.find(t => t.id === toolId)
  if (!tool) return null

  const tips = CONTEXTUAL_TIPS[tool.path] || DEFAULT_TIPS

  return (
    <div className="relative">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        title={t('components.contextualHelper.help')}
      >
        <Question size={20} className="text-muted-foreground" />
      </button>

      <AnimatePresence>
        {showHelp && tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <Sparkle size={16} weight="fill" className="text-yellow-500" />
                <span className="font-medium text-sm">
                  {t('components.contextualHelper.tipsForTool')}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
              {tips.map((tip, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-foreground">
                    {isArabic ? tip.titleAr : tip.title}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {isArabic ? tip.descriptionAr : tip.description}
                  </p>
                  {tip.action && (
                    <Link
                      to={tip.action.path}
                      onClick={() => setShowHelp(false)}
                      className="inline-flex items-center gap-1 text-xs text-purple-500 hover:text-purple-400 mt-1"
                    >
                      {isArabic ? tip.action.labelAr : tip.action.label}
                      <ArrowRight size={10} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

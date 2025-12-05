import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X, ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Tip {
  id: string
  textEn: string
  textAr: string
  toolPath?: string
  toolNameEn?: string
  toolNameAr?: string
}

const TIPS: Tip[] = [
  {
    id: 'tip-1',
    textEn: 'Use keyboard shortcut Ctrl+K (or ⌘K on Mac) to quickly search for any tool!',
    textAr: 'استخدم اختصار Ctrl+K (أو ⌘K على ماك) للبحث السريع عن أي أداة!'
  },
  {
    id: 'tip-2',
    textEn: 'AI tools can summarize long articles in seconds. Try our Text Summarizer!',
    textAr: 'أدوات الذكاء الاصطناعي يمكنها تلخيص المقالات الطويلة في ثوانٍ. جرب ملخص النصوص!',
    toolPath: '/tools/text-summarizer',
    toolNameEn: 'Text Summarizer',
    toolNameAr: 'ملخص النصوص'
  },
  {
    id: 'tip-3',
    textEn: 'Remove image backgrounds instantly with our Background Remover tool.',
    textAr: 'أزل خلفيات الصور فوراً باستخدام أداة إزالة الخلفية.',
    toolPath: '/tools/background-remover',
    toolNameEn: 'Background Remover',
    toolNameAr: 'مزيل الخلفية'
  },
  {
    id: 'tip-4',
    textEn: 'Generate secure passwords with our Password Generator - never use "123456" again!',
    textAr: 'أنشئ كلمات مرور آمنة باستخدام مولد كلمات المرور - لا تستخدم "123456" أبداً!',
    toolPath: '/tools/password-generator',
    toolNameEn: 'Password Generator',
    toolNameAr: 'مولد كلمات المرور'
  },
  {
    id: 'tip-5',
    textEn: 'Create QR codes for your links, WiFi, or contact info in seconds!',
    textAr: 'أنشئ رموز QR لروابطك أو WiFi أو معلومات الاتصال في ثوانٍ!',
    toolPath: '/tools/qr-generator',
    toolNameEn: 'QR Generator',
    toolNameAr: 'مولد رمز QR'
  },
  {
    id: 'tip-6',
    textEn: 'Use the Pomodoro Timer to boost your productivity with focused work sessions.',
    textAr: 'استخدم مؤقت بومودورو لزيادة إنتاجيتك مع جلسات عمل مركزة.',
    toolPath: '/tools/pomodoro-timer',
    toolNameEn: 'Pomodoro Timer',
    toolNameAr: 'مؤقت بومودورو'
  },
  {
    id: 'tip-7',
    textEn: 'Convert JSON to CSV (and vice versa) with our converter - perfect for data tasks!',
    textAr: 'حوّل JSON إلى CSV (والعكس) باستخدام محولنا - مثالي لمهام البيانات!',
    toolPath: '/tools/json-csv-converter',
    toolNameEn: 'JSON CSV Converter',
    toolNameAr: 'محول JSON CSV'
  },
  {
    id: 'tip-8',
    textEn: 'Add tools to your favorites by clicking the heart icon for quick access later!',
    textAr: 'أضف الأدوات إلى المفضلة بالضغط على أيقونة القلب للوصول السريع لاحقاً!'
  },
  {
    id: 'tip-9',
    textEn: 'Calculate BMI, percentages, and discounts with our handy calculators.',
    textAr: 'احسب مؤشر كتلة الجسم والنسب المئوية والخصومات باستخدام حاسباتنا المفيدة.',
    toolPath: '/tools/bmi-calculator',
    toolNameEn: 'BMI Calculator',
    toolNameAr: 'حاسبة مؤشر كتلة الجسم'
  },
  {
    id: 'tip-10',
    textEn: 'Extract text from images using our OCR tool - great for digitizing documents!',
    textAr: 'استخرج النص من الصور باستخدام أداة OCR - رائعة لرقمنة المستندات!',
    toolPath: '/tools/image-to-text',
    toolNameEn: 'Image to Text',
    toolNameAr: 'صورة إلى نص'
  }
]

const STORAGE_KEY = 'daily-tip-dismissed'

export function DailyTip() {
  const { t, i18n } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)

  useEffect(() => {
    // Get today's date as string
    const today = new Date().toISOString().split('T')[0]
    
    // Check if tip was dismissed today
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed === today) {
      return
    }

    // Get a tip based on the day of year (cycles through tips)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % TIPS.length
    
    setCurrentTip(TIPS[tipIndex])
    setIsVisible(true)
  }, [])

  const dismissTip = () => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(STORAGE_KEY, today)
    setIsVisible(false)
  }

  if (!isVisible || !currentTip) {
    return null
  }

  const tipText = i18n.language === 'ar' ? currentTip.textAr : currentTip.textEn
  const toolName = i18n.language === 'ar' ? currentTip.toolNameAr : currentTip.toolNameEn

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 sm:mb-10"
      >
        <div 
          className="relative bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-6 overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(251,191,36,0.15)' }}
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Lightbulb size={24} weight="fill" className="text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  {t('dailyTip.title')}
                </span>
                <span className="text-amber-500">💡</span>
              </div>
              <p className="text-foreground text-sm sm:text-base leading-relaxed">
                {tipText}
              </p>
              
              {currentTip.toolPath && (
                <Link 
                  to={currentTip.toolPath}
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors group"
                >
                  {t('dailyTip.tryNow')} {toolName}
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={dismissTip}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              aria-label={t('common.close')}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

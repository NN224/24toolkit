import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight, Sparkle } from '@phosphor-icons/react'
import { getRecommendationsForTool, trackToolUsage, type ToolRecommendation } from '@/lib/tool-recommendations'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface ToolRecommendationsProps {
  currentToolId: string
  showAfterAction?: boolean // Show recommendations after user completes an action
  className?: string
}

/**
 * Smart Tool Recommendations Component
 * Shows related tools based on what the user just used
 */
export function ToolRecommendations({ 
  currentToolId, 
  showAfterAction = false,
  className = '' 
}: ToolRecommendationsProps) {
  const { t } = useTranslation()
  const [recommendations, setRecommendations] = useState<ToolRecommendation[]>([])
  const [dismissed, setDismissed] = useState(false)
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    // Detect language from document
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
    
    // Track usage when component mounts
    trackToolUsage(currentToolId)
    
    // Get recommendations
    const recs = getRecommendationsForTool(currentToolId)
    setRecommendations(recs)
  }, [currentToolId])

  // Don't show if no recommendations or dismissed
  if (recommendations.length === 0 || dismissed) {
    return null
  }

  // If showAfterAction is true, only show when explicitly triggered
  if (showAfterAction) {
    return null // Will be shown via ToolRecommendationsPopup
  }

  return (
    <div className={`mt-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-purple-500" />
          {t('components.toolRecommendations.relatedTools')}
        </h3>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={t('common.close')}
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recommendations.slice(0, 3).map((rec) => (
          <Link
            key={rec.toolId}
            to={rec.path}
            className="group p-4 rounded-xl bg-card/50 border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-purple-500 transition-colors truncate">
                  {rec.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {rec.reason}
                </p>
              </div>
              <ArrowRight 
                size={16} 
                className="text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" 
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/**
 * Popup version that shows after user completes an action
 */
interface ToolRecommendationsPopupProps {
  currentToolId: string
  isOpen: boolean
  onClose: () => void
  actionCompleted?: string // e.g., "Image compressed successfully!"
}

export function ToolRecommendationsPopup({
  currentToolId,
  isOpen,
  onClose,
  actionCompleted
}: ToolRecommendationsPopupProps) {
  const { t } = useTranslation()
  const [recommendations, setRecommendations] = useState<ToolRecommendation[]>([])
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
    
    if (isOpen) {
      const recs = getRecommendationsForTool(currentToolId)
      setRecommendations(recs)
    }
  }, [currentToolId, isOpen])

  if (recommendations.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] z-50"
        >
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-sky-500 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkle size={18} weight="fill" className="text-white" />
                  <span className="font-semibold text-white text-sm">
                    {t('components.toolRecommendations.whatsNext')}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              {actionCompleted && (
                <p className="text-white/80 text-xs mt-1">✅ {actionCompleted}</p>
              )}
            </div>

            {/* Recommendations */}
            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
              {recommendations.slice(0, 4).map((rec) => (
                <Link
                  key={rec.toolId}
                  to={rec.path}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all group"
                >
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm group-hover:text-purple-500 transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {rec.reason}
                    </p>
                  </div>
                  <ArrowRight 
                    size={16} 
                    className="text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0" 
                  />
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('components.toolRecommendations.noThanks')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook to manage recommendation popup state
 */
export function useToolRecommendations(toolId: string) {
  const [showPopup, setShowPopup] = useState(false)
  const [completedAction, setCompletedAction] = useState<string | undefined>()

  const triggerRecommendations = (actionMessage?: string) => {
    setCompletedAction(actionMessage)
    setShowPopup(true)
    
    // Auto-close after 10 seconds
    setTimeout(() => setShowPopup(false), 10000)
  }

  const closePopup = () => setShowPopup(false)

  return {
    showPopup,
    completedAction,
    triggerRecommendations,
    closePopup,
    PopupComponent: () => (
      <ToolRecommendationsPopup
        currentToolId={toolId}
        isOpen={showPopup}
        onClose={closePopup}
        actionCompleted={completedAction}
      />
    )
  }
}

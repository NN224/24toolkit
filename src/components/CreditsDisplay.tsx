import { useSubscription, PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { Sparkle, Lightning, Crown, ArrowUp } from '@phosphor-icons/react'

interface CreditsDisplayProps {
  showUpgrade?: boolean
  compact?: boolean
  onUpgradeClick?: () => void
}

export function CreditsDisplay({ showUpgrade = true, compact = false, onUpgradeClick }: CreditsDisplayProps) {
  const { subscription, currentPlan, getCreditsDisplay, openUpgradeModal } = useSubscription()

  if (!subscription) return null

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick()
    } else {
      openUpgradeModal()
    }
  }

  // Plan icons
  const planIcons = {
    free: Sparkle,
    pro: Lightning,
    unlimited: Crown,
  }

  const PlanIcon = planIcons[currentPlan]

  // Plan colors
  const planColors = {
    free: 'from-gray-500 to-gray-600',
    pro: 'from-purple-500 to-purple-600',
    unlimited: 'from-purple-500 to-sky-500',
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${planColors[currentPlan]} text-white text-xs font-medium`}>
          <PlanIcon size={12} weight="fill" />
          <span>{getCreditsDisplay()}</span>
        </div>
        {showUpgrade && currentPlan === 'free' && (
          <button
            onClick={handleUpgrade}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/30 transition-colors"
          >
            <ArrowUp size={10} weight="bold" />
            Upgrade
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-white/10">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${planColors[currentPlan]} flex items-center justify-center`}>
          <PlanIcon size={20} weight="fill" className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {PLAN_LIMITS[currentPlan].name} Plan
            </span>
            {currentPlan !== 'free' && (
              <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-medium">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {currentPlan === 'free' && `${getCreditsDisplay()} AI credits`}
            {currentPlan === 'pro' && `${getCreditsDisplay()} AI credits`}
            {currentPlan === 'unlimited' && 'Unlimited AI access'}
          </p>
        </div>
      </div>

      {showUpgrade && currentPlan !== 'unlimited' && (
        <button
          onClick={handleUpgrade}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-sky-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowUp size={14} weight="bold" />
          Upgrade
        </button>
      )}
    </div>
  )
}

/**
 * Inline credits badge for AI tools
 */
export function CreditsBadge() {
  const { currentPlan, getCreditsDisplay } = useSubscription()

  const planColors = {
    free: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pro: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    unlimited: 'bg-gradient-to-r from-purple-500/20 to-sky-500/20 text-sky-400 border-sky-500/30',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${planColors[currentPlan]}`}>
      {currentPlan === 'unlimited' ? (
        <>
          <Crown size={10} weight="fill" />
          Unlimited
        </>
      ) : (
        <>
          <Sparkle size={10} weight="fill" />
          {getCreditsDisplay()}
        </>
      )}
    </span>
  )
}

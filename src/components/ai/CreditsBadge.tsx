import { Sparkle, Crown, Lightning, Rocket } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface CreditsBadgeProps {
  className?: string
  showLabel?: boolean
}

/**
 * Displays the user's remaining AI credits based on subscription
 */
export function CreditsBadge({ className = '', showLabel = true }: CreditsBadgeProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { currentPlan, isPaid, getCreditsDisplay, openUpgradeModal } = useSubscription()
  const navigate = useNavigate()
  
  if (!user) {
    return null
  }
  
  // Unlimited user
  if (currentPlan === 'unlimited') {
    return (
      <button 
        onClick={() => navigate('/pricing')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-sky-500/20 border border-sky-500/30 hover:opacity-80 transition-all ${className}`}
        title={t('credits.unlimitedPlan')}
      >
        <Crown size={14} weight="fill" className="text-sky-400" />
        {showLabel && (
          <span className="text-xs font-medium bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">{t('pricing.unlimited')}</span>
        )}
      </button>
    )
  }
  
  // Pro user
  if (currentPlan === 'pro') {
    const creditsStr = getCreditsDisplay()
    return (
      <button 
        onClick={() => navigate('/pricing')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 hover:opacity-80 transition-all ${className}`}
        title={`${t('credits.proPlan')} - ${creditsStr}`}
      >
        <Lightning size={14} weight="fill" className="text-purple-400" />
        {showLabel && (
          <span className="text-xs font-medium text-purple-400">{creditsStr}</span>
        )}
      </button>
    )
  }
  
  // Free user with credits
  const creditsStr = getCreditsDisplay()
  const creditsMatch = creditsStr.match(/(\d+)\/(\d+)/)
  const remaining = creditsMatch ? parseInt(creditsMatch[1]) : 0
  const total = creditsMatch ? parseInt(creditsMatch[2]) : 5
  
  const isLow = remaining <= 2
  const isEmpty = remaining === 0
  
  return (
    <button 
      onClick={openUpgradeModal}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:opacity-80 ${
        isEmpty 
          ? 'bg-red-500/20 border-red-500/30' 
          : isLow 
            ? 'bg-orange-500/20 border-orange-500/30'
            : 'bg-purple-500/20 border-purple-500/30'
      } ${className}`}
      title={t('credits.remainingClickUpgrade', { remaining })}
    >
      <Sparkle 
        size={14} 
        weight="fill" 
        className={isEmpty ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-purple-400'} 
      />
      {showLabel && (
        <span className={`text-xs font-medium ${
          isEmpty ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-purple-400'
        }`}>
          {remaining}/{total}
        </span>
      )}
    </button>
  )
}

/**
 * Full credits display with more details
 */
export function CreditsDisplay() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { currentPlan, getCreditsDisplay, openUpgradeModal } = useSubscription()
  const navigate = useNavigate()
  
  if (!user) {
    return null
  }
  
  // Unlimited user
  if (currentPlan === 'unlimited') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-sky-500/10 border border-sky-500/20">
        <Crown size={20} weight="fill" className="text-sky-400" />
        <div>
          <p className="text-sm font-medium bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">{t('credits.unlimitedPlan')}</p>
          <p className="text-xs text-muted-foreground">{t('credits.unlimitedAccess')}</p>
        </div>
      </div>
    )
  }
  
  // Pro user
  if (currentPlan === 'pro') {
    const creditsStr = getCreditsDisplay()
    const match = creditsStr.match(/(\d+)\/(\d+)/)
    const remaining = match ? parseInt(match[1]) : 0
    const total = match ? parseInt(match[2]) : 100
    const percentage = (remaining / total) * 100
    
    return (
      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Lightning size={18} weight="fill" className="text-purple-400" />
            <span className="text-sm font-medium text-purple-400">{t('credits.proPlan')}</span>
          </div>
          <span className="text-sm font-bold text-purple-400">{remaining}/{total}</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {t('credits.remainingThisMonth', { remaining })}
        </p>
        
        {/* Upgrade button */}
        <button
          onClick={() => navigate('/pricing')}
          className="w-full mt-3 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600/20 to-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-medium hover:from-purple-600/30 hover:to-sky-500/30 transition-all flex items-center justify-center gap-1.5"
        >
          <Crown size={14} weight="fill" />
          {t('credits.upgradeToUnlimited')}
        </button>
      </div>
    )
  }
  
  // Free user
  const creditsStr = getCreditsDisplay()
  const match = creditsStr.match(/(\d+)\/(\d+)/)
  const remaining = match ? parseInt(match[1]) : 0
  const total = match ? parseInt(match[2]) : 5
  const percentage = (remaining / total) * 100
  
  // Calculate time until midnight UTC (credit reset)
  const getTimeUntilReset = () => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setUTCHours(24, 0, 0, 0)
    const diffMs = midnight.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHrs}h ${diffMins}m`
  }
  
  return (
    <div className="p-3 rounded-lg bg-card border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkle size={18} weight="fill" className="text-purple-400" />
          <span className="text-sm font-medium">{t('credits.freePlan')}</span>
        </div>
        <span className="text-sm font-bold text-purple-400">{remaining}/{total}</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            remaining === 0 
              ? 'bg-red-500' 
              : remaining <= 2 
                ? 'bg-orange-500'
                : 'bg-gradient-to-r from-purple-500 to-sky-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        {remaining === 0 
          ? t('credits.resetIn', { time: getTimeUntilReset() })
          : t('credits.remainingToday', { remaining, count: remaining })
        }
      </p>
      
      {/* Upgrade button */}
      <button
        onClick={openUpgradeModal}
        className="w-full mt-3 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600/20 to-sky-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium hover:from-purple-600/30 hover:to-sky-500/30 transition-all flex items-center justify-center gap-1.5"
      >
        <Rocket size={14} weight="fill" />
        {t('credits.upgradeToPro')}
      </button>
    </div>
  )
}

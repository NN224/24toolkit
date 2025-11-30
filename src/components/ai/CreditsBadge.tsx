import { Sparkle, Crown, Rocket } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { openSubscriptionModal } from '@/components/SubscriptionModal'

interface CreditsBadgeProps {
  className?: string
  showLabel?: boolean
}

/**
 * Displays the user's remaining AI credits or Premium status
 */
export function CreditsBadge({ className = '', showLabel = true }: CreditsBadgeProps) {
  const { user, userProfile } = useAuth()
  
  if (!user || !userProfile) {
    return null
  }
  
  // Premium user
  if (userProfile.isPremium) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 ${className}`}>
        <Crown size={14} weight="fill" className="text-amber-400" />
        {showLabel && (
          <span className="text-xs font-medium text-amber-400">Premium</span>
        )}
      </div>
    )
  }
  
  // Free user with credits
  const credits = userProfile.aiCredits
  const isLow = credits <= 2
  const isEmpty = credits === 0
  
  return (
    <div 
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${
        isEmpty 
          ? 'bg-red-500/20 border-red-500/30' 
          : isLow 
            ? 'bg-orange-500/20 border-orange-500/30'
            : 'bg-purple-500/20 border-purple-500/30'
      } ${className}`}
      title={`${credits} AI credits remaining today`}
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
          {credits}/5
        </span>
      )}
    </div>
  )
}

/**
 * Full credits display with more details
 */
export function CreditsDisplay() {
  const { user, userProfile } = useAuth()
  
  if (!user || !userProfile) {
    return null
  }
  
  if (userProfile.isPremium) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
        <Crown size={20} weight="fill" className="text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-400">Premium Member</p>
          <p className="text-xs text-muted-foreground">Unlimited AI access</p>
        </div>
      </div>
    )
  }
  
  const credits = userProfile.aiCredits
  const percentage = (credits / 5) * 100
  
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
          <span className="text-sm font-medium">AI Credits</span>
        </div>
        <span className="text-sm font-bold text-purple-400">{credits}/5</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            credits === 0 
              ? 'bg-red-500' 
              : credits <= 2 
                ? 'bg-orange-500'
                : 'bg-gradient-to-r from-purple-500 to-sky-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        {credits === 0 
          ? `Credits reset in ${getTimeUntilReset()}`
          : `${credits} free AI request${credits !== 1 ? 's' : ''} remaining today`
        }
      </p>
      
      {/* Upgrade button for free users */}
      <button
        onClick={() => openSubscriptionModal()}
        className="w-full mt-3 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600/20 to-sky-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium hover:from-purple-600/30 hover:to-sky-500/30 transition-all flex items-center justify-center gap-1.5"
      >
        <Rocket size={14} weight="fill" />
        Upgrade to Pro
      </button>
    </div>
  )
}

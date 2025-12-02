import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Sparkle, Lightning, Rocket, Crown, Check, ArrowRight } from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Feature {
  icon: PhosphorIcon
  titleKey: string
  descriptionKey: string
}

const features: Feature[] = [
  {
    icon: Sparkle,
    titleKey: 'subscription.features.moreCredits.title',
    descriptionKey: 'subscription.features.moreCredits.description'
  },
  {
    icon: Lightning,
    titleKey: 'subscription.features.noAds.title',
    descriptionKey: 'subscription.features.noAds.description'
  },
  {
    icon: Rocket,
    titleKey: 'subscription.features.priority.title',
    descriptionKey: 'subscription.features.priority.description'
  },
  {
    icon: Crown,
    titleKey: 'subscription.features.premium.title',
    descriptionKey: 'subscription.features.premium.description'
  }
]

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { t } = useTranslation()
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  const handleUpgrade = async (plan: 'pro' | 'unlimited') => {
    if (!user) {
      try {
        await signInWithGoogle()
        toast.success(t('pricing.signedIn'))
      } catch (error) {
        toast.error(t('pricing.signInFirst'))
      }
      return
    }

    setLoading(true)

    try {
      const priceId = plan === 'pro' 
        ? PLAN_LIMITS.pro.priceId 
        : PLAN_LIMITS.unlimited.priceId

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          userEmail: user.email,
          successUrl: `${window.location.origin}/settings?success=true`,
          cancelUrl: `${window.location.origin}?canceled=true`,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(t('pricing.checkoutFailed'))
    } finally {
      setLoading(false)
    }
  }

  const goToPricing = () => {
    onClose()
    navigate('/pricing')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-lg bg-gradient-to-b from-card to-card/95 rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${
            isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ boxShadow: '0 0 60px rgba(109, 40, 217, 0.3)' }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-sky-500/20 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X size={20} className="text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center border-b border-white/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 mb-4">
              <Rocket size={32} weight="fill" className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('subscription.unlockPower')} 🚀
            </h2>
            <p className="text-muted-foreground">
              {t('subscription.usedAllCredits')}
            </p>
          </div>

          {/* Features */}
          <div className="relative px-6 py-6 space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600/20 to-sky-500/20 flex items-center justify-center">
                    <Icon size={20} weight="fill" className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(feature.descriptionKey)}</p>
                  </div>
                  <Check size={20} weight="bold" className="flex-shrink-0 text-green-400 ml-auto" />
                </div>
              )
            })}
          </div>

          {/* Quick Plans */}
          <div className="relative px-6 py-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3">
              {/* Pro Plan */}
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={loading}
                className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightning size={18} weight="fill" className="text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">Pro</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">${PLAN_LIMITS.pro.price}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">100 AI/month</p>
              </button>

              {/* Unlimited Plan */}
              <button
                onClick={() => handleUpgrade('unlimited')}
                disabled={loading}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-sky-500/10 border border-sky-500/30 hover:border-sky-500/50 transition-all text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-sky-500 text-white text-[10px] font-bold rounded-bl">
                  BEST
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={18} weight="fill" className="text-sky-400" />
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">Unlimited</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">${PLAN_LIMITS.unlimited.price}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">∞ Unlimited AI</p>
              </button>
            </div>

            <button
              onClick={goToPricing}
              className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
            >
              {t('subscription.compareAllPlans')}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Free tier reminder */}
          <div className="relative px-6 py-4 bg-white/5 border-t border-white/10">
            <p className="text-center text-sm text-muted-foreground">
              <Sparkle size={14} weight="fill" className="inline text-purple-400 mr-1" />
              {t('subscription.freeCreditsReset')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Global event to open subscription modal
export function openSubscriptionModal() {
  window.dispatchEvent(new CustomEvent('open-subscription-modal'))
}

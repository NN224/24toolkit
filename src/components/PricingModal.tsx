import { useState } from 'react'
import { X, Check, Sparkle, Lightning, Crown, Rocket, Star } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription, PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  highlightPlan?: 'pro' | 'unlimited'
}

export function PricingModal({ isOpen, onClose, highlightPlan = 'pro' }: PricingModalProps) {
  const { t } = useTranslation()
  const { user, signInWithGoogle } = useAuth()
  const { currentPlan } = useSubscription()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubscribe = async (plan: 'pro' | 'unlimited') => {
    if (!user) {
      try {
        await signInWithGoogle()
        toast.success(t('pricing.signedIn'))
      } catch (error) {
        toast.error(t('pricing.signInFirst'))
      }
      return
    }

    setLoadingPlan(plan)

    try {
      // Redirect to Stripe Checkout
      const priceId = plan === 'pro' 
        ? PLAN_LIMITS.pro.priceId 
        : PLAN_LIMITS.unlimited.priceId

      // Call your API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          userEmail: user.email,
          successUrl: `${window.location.origin}/settings?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
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
      setLoadingPlan(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-sky-500/10 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X size={24} className="text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-sky-500/20 border border-purple-500/30 mb-4">
              <Sparkle size={16} weight="fill" className="text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Choose Your Plan</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Unlock the Full Power of AI ✨
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get unlimited access to all AI tools and features. Cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="relative p-6">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Free Plan */}
              <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Free</h3>
                  <p className="text-sm text-muted-foreground">For trying out</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {PLAN_LIMITS.free.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                  {PLAN_LIMITS.free.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <X size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground/60">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-white/10 text-muted-foreground font-medium cursor-not-allowed"
                >
                  {currentPlan === 'free' ? 'Current Plan' : 'Free Forever'}
                </button>
              </div>

              {/* Pro Plan */}
              <div className={`relative p-6 rounded-2xl border-2 ${
                highlightPlan === 'pro' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 bg-white/5'
              }`}>
                {highlightPlan === 'pro' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Star size={24} weight="fill" className="text-purple-400" />
                    <h3 className="text-xl font-bold text-foreground">Pro</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">For regular users</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${PLAN_LIMITS.pro.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {PLAN_LIMITS.pro.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe('pro')}
                  disabled={loadingPlan === 'pro' || currentPlan === 'pro'}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    currentPlan === 'pro'
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:opacity-90'
                  }`}
                >
                  {loadingPlan === 'pro' ? 'Loading...' : currentPlan === 'pro' ? 'Current Plan' : 'Subscribe to Pro'}
                </button>
              </div>

              {/* Unlimited Plan */}
              <div className={`relative p-6 rounded-2xl border-2 ${
                highlightPlan === 'unlimited' 
                  ? 'border-sky-500 bg-sky-500/10' 
                  : 'border-white/10 bg-white/5'
              }`}>
                {highlightPlan === 'unlimited' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-sky-500 text-white text-xs font-medium">
                    Best Value
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Crown size={24} weight="fill" className="text-sky-400" />
                    <h3 className="text-xl font-bold text-foreground">Unlimited</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">For power users</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${PLAN_LIMITS.unlimited.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {PLAN_LIMITS.unlimited.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe('unlimited')}
                  disabled={loadingPlan === 'unlimited' || currentPlan === 'unlimited'}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    currentPlan === 'unlimited'
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90'
                  }`}
                >
                  {loadingPlan === 'unlimited' ? 'Loading...' : currentPlan === 'unlimited' ? 'Current Plan' : 'Go Unlimited'}
                </button>

                {PLAN_LIMITS.unlimited.note && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    {PLAN_LIMITS.unlimited.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-6 py-4 bg-white/5 border-t border-white/10 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 Secure payment with Stripe • Cancel anytime • No questions asked
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Global event listener for opening pricing modal
export function usePricingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightPlan, setHighlightPlan] = useState<'pro' | 'unlimited'>('pro')

  const openModal = (plan?: 'pro' | 'unlimited') => {
    if (plan) setHighlightPlan(plan)
    setIsOpen(true)
  }

  const closeModal = () => setIsOpen(false)

  return { isOpen, openModal, closeModal, highlightPlan }
}

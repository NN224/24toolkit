import { useState, useEffect } from 'react'
import { X, Sparkle, Lightning, Rocket, Crown, Check } from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Feature {
  icon: PhosphorIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Sparkle,
    title: 'Unlimited Generations',
    description: 'No daily limits on AI-powered tools'
  },
  {
    icon: Lightning,
    title: 'Faster Processing',
    description: 'Priority queue for faster responses'
  },
  {
    icon: Rocket,
    title: 'Premium AI Models',
    description: 'Access to Claude 3.5 Sonnet & GPT-4'
  },
  {
    icon: Crown,
    title: 'Early Access',
    description: 'Be first to try new AI features'
  }
]

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  const handleUpgrade = () => {
    console.log('Redirect to Stripe')
    // TODO: Implement Stripe checkout
    // window.location.href = '/api/checkout'
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
              Unlock Unlimited AI Power 🚀
            </h2>
            <p className="text-muted-foreground">
              You've used all your free credits today. Upgrade to Pro for unlimited access!
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
                    <h3 className="font-medium text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Check size={20} weight="bold" className="flex-shrink-0 text-green-400 ml-auto" />
                </div>
              )
            })}
          </div>

          {/* Pricing */}
          <div className="relative px-6 py-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Pro Plan</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">$4.99</span>
                  <span className="text-muted-foreground">/ month</span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <span className="text-xs font-medium text-green-400">Save 50%</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 text-white font-semibold text-lg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
              style={{ boxShadow: '0 0 20px rgba(109, 40, 217, 0.4)' }}
            >
              Upgrade Now
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Cancel anytime. No questions asked.
            </p>
          </div>

          {/* Free tier reminder */}
          <div className="relative px-6 py-4 bg-white/5 border-t border-white/10">
            <p className="text-center text-sm text-muted-foreground">
              <Sparkle size={14} weight="fill" className="inline text-purple-400 mr-1" />
              Free credits reset daily at midnight
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

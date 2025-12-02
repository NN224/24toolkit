import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Lightning, Sparkle, Check, X, Rocket } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useSubscription, PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { Card } from '@/components/ui/card'

interface UpgradeModalProps {
  isOpen?: boolean
  onClose?: () => void
  trigger?: 'credits-exhausted' | 'manual' | 'feature-lock'
}

export function UpgradeModal({ isOpen: controlledOpen, onClose, trigger = 'manual' }: UpgradeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { currentPlan, getCreditsDisplay } = useSubscription()

  // Listen for global events to open modal
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-subscription-modal', handleOpen)
    return () => window.removeEventListener('open-subscription-modal', handleOpen)
  }, [])

  // Controlled state from props
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen)
    }
  }, [controlledOpen])

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleUpgrade = (plan: 'pro' | 'unlimited') => {
    handleClose()
    navigate('/pricing', { state: { selectedPlan: plan } })
  }

  const getTitle = () => {
    switch (trigger) {
      case 'credits-exhausted':
        return '🎯 You\'re on a Roll!'
      case 'feature-lock':
        return '🚀 Unlock Premium Features'
      default:
        return '✨ Upgrade Your Experience'
    }
  }

  const getDescription = () => {
    switch (trigger) {
      case 'credits-exhausted':
        return 'You\'ve used all your free AI requests for today. Upgrade now to keep the momentum going!'
      case 'feature-lock':
        return 'This feature is available for Pro and Unlimited users. Upgrade to unlock all features.'
      default:
        return 'Get more AI requests, remove ads, and unlock premium features.'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-base">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Current Plan Status */}
        {trigger === 'credits-exhausted' && (
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
            <Sparkle size={24} weight="fill" className="text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-orange-500">Daily Limit Reached</p>
              <p className="text-sm text-muted-foreground">
                Current plan: <span className="font-medium">{currentPlan === 'free' ? 'Free' : currentPlan}</span> • 
                Credits: <span className="font-medium">{getCreditsDisplay()}</span>
              </p>
            </div>
          </div>
        )}

        {/* Plans Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Pro Plan */}
          <Card className="relative overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Lightning size={24} weight="fill" className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pro</h3>
                  <p className="text-sm text-muted-foreground">For regular users</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${PLAN_LIMITS.pro.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-2">
                {PLAN_LIMITS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} weight="bold" className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade('pro')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              >
                <Rocket size={18} weight="fill" className="mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </Card>

          {/* Unlimited Plan */}
          <Card className="relative overflow-hidden border-2 border-sky-500/30 hover:border-sky-500/50 transition-all bg-gradient-to-br from-purple-500/5 to-sky-500/5">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-500 to-sky-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              BEST VALUE
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-sky-500/20">
                  <Crown size={24} weight="fill" className="text-sky-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Unlimited</h3>
                  <p className="text-sm text-muted-foreground">For power users</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${PLAN_LIMITS.unlimited.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-2">
                {PLAN_LIMITS.unlimited.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} weight="bold" className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade('unlimited')}
                className="w-full bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600"
              >
                <Crown size={18} weight="fill" className="mr-2" />
                Go Unlimited
              </Button>
            </div>
          </Card>
        </div>

        {/* Free Plan Comparison */}
        <div className="mt-4 p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkle size={18} className="text-muted-foreground" />
              <span className="font-medium text-sm">Current: Free Plan</span>
            </div>
            <Badge variant="secondary">0$/month</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-500" />
              <span>5 AI requests/day</span>
            </div>
            <div className="flex items-center gap-2">
              <X size={14} className="text-red-500" />
              <span>Ads displayed</span>
            </div>
            <div className="flex items-center gap-2">
              <X size={14} className="text-red-500" />
              <span>No priority support</span>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>✨ 100% satisfaction guaranteed • Cancel anytime • Secure payment</p>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          onClick={handleClose}
          className="absolute top-4 right-4 h-8 w-8 p-0"
        >
          <X size={18} />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

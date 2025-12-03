import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Sparkle, Lightning, Crown, Rocket, Star, Fire, Heart, ShieldCheck, Zap, Gift } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription, PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { useSEO } from '@/hooks/useSEO'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export default function PricingPageNew() {
  const { t } = useTranslation()
  useSEO({
    title: t('pricing.seo.title'),
    description: t('pricing.seo.description'),
    canonicalPath: '/pricing'
  })

  const { user, signInWithGoogle } = useAuth()
  const { currentPlan } = useSubscription()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

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

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      tagline: 'Perfect for trying out',
      icon: Sparkle,
      price: 0,
      period: 'Forever Free',
      color: 'from-gray-500 to-gray-600',
      iconColor: 'text-gray-400',
      borderGlow: 'rgba(156, 163, 175, 0.3)',
      features: [
        { text: '10 AI requests per day', icon: Zap },
        { text: 'Access to 80+ tools', icon: Gift },
        { text: 'Basic support', icon: Heart },
        { text: 'Save your favorites', icon: Star }
      ],
      limitations: [
        'Limited AI usage',
        'No priority support',
        'Standard speed'
      ],
      cta: t('pricing.plans.free.cta'),
      badge: null,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'For power users',
      icon: Lightning,
      price: 9.99,
      period: 'per month',
      color: 'from-purple-600 via-purple-500 to-indigo-600',
      iconColor: 'text-purple-400',
      borderGlow: 'rgba(147, 51, 234, 0.5)',
      features: [
        { text: '1,000 AI requests/month', icon: Zap },
        { text: 'All tools unlocked', icon: Gift },
        { text: 'Priority support', icon: ShieldCheck },
        { text: 'Advanced features', icon: Rocket },
        { text: 'Export & save history', icon: Star },
        { text: 'No ads', icon: Fire }
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      badge: 'Most Popular',
      popular: true
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      tagline: 'For professionals',
      icon: Crown,
      price: 19.99,
      period: 'per month',
      color: 'from-amber-500 via-yellow-500 to-orange-500',
      iconColor: 'text-amber-400',
      borderGlow: 'rgba(251, 191, 36, 0.5)',
      features: [
        { text: 'Unlimited AI requests', icon: Zap },
        { text: 'All tools + early access', icon: Gift },
        { text: '24/7 VIP support', icon: ShieldCheck },
        { text: 'Custom workflows', icon: Rocket },
        { text: 'Team collaboration', icon: Star },
        { text: 'API access', icon: Fire },
        { text: 'White-label option', icon: Crown }
      ],
      limitations: [],
      cta: 'Go Unlimited',
      badge: 'Best Value',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />
        
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-sky-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-sky-500/20 border border-purple-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                ✨ Simple, Transparent Pricing
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent animate-gradient-text">
              Choose Your Plan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Start free, upgrade when you're ready. No credit card required.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id
            const isPlanDisabled = plan.id === 'free' || isCurrentPlan || loadingPlan === plan.id

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold shadow-lg shadow-purple-500/50 animate-pulse">
                      {plan.badge}
                    </div>
                  </motion.div>
                )}

                {/* Card */}
                <motion.div
                  className={`
                    relative h-full rounded-3xl p-8 backdrop-blur-xl
                    transition-all duration-500 shine-effect
                    ${plan.popular 
                      ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-background border-2 border-purple-500 shadow-2xl shadow-purple-500/20' 
                      : 'bg-card/40 border border-white/10 hover:border-white/20'
                    }
                  `}
                  animate={{
                    scale: hoveredPlan === plan.id ? 1.05 : 1,
                    y: hoveredPlan === plan.id ? -10 : 0,
                  }}
                  style={{
                    boxShadow: hoveredPlan === plan.id 
                      ? `0 20px 60px ${plan.borderGlow}`
                      : undefined
                  }}
                >
                  {/* Background Gradient Overlay */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${plan.color} blur-2xl -z-10`} />

                  {/* Icon */}
                  <motion.div
                    className="mb-6"
                    animate={{
                      rotate: hoveredPlan === plan.id ? [0, -10, 10, -10, 0] : 0,
                      scale: hoveredPlan === plan.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg`}>
                      <Icon size={32} weight="fill" className="text-white" />
                    </div>
                  </motion.div>

                  {/* Plan Name & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground text-lg">/{plan.period.split(' ')[1]}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.price === 0 ? plan.period : `Billed ${plan.period}`}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => {
                      const FeatureIcon = feature.icon
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + i * 0.05 }}
                          className="flex items-start gap-3 group/item"
                        >
                          <div className={`flex-shrink-0 mt-0.5 p-1 rounded-lg bg-gradient-to-br ${plan.color}`}>
                            <FeatureIcon size={16} weight="bold" className="text-white" />
                          </div>
                          <span className="text-foreground text-sm group-hover/item:text-transparent group-hover/item:bg-gradient-to-r group-hover/item:from-purple-400 group-hover/item:to-sky-400 group-hover/item:bg-clip-text transition-all">
                            {feature.text}
                          </span>
                        </motion.div>
                      )
                    })}

                    {plan.limitations?.map((limitation, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + (plan.features.length + i) * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <X size={20} className="text-red-400/60" weight="bold" />
                        </div>
                        <span className="text-muted-foreground text-sm line-through">
                          {limitation}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => plan.id !== 'free' && handleSubscribe(plan.id as 'pro' | 'unlimited')}
                    disabled={isPlanDisabled}
                    whileHover={!isPlanDisabled ? { scale: 1.05 } : undefined}
                    whileTap={!isPlanDisabled ? { scale: 0.95 } : undefined}
                    className={`
                      w-full py-4 px-6 rounded-xl font-bold text-lg
                      transition-all relative overflow-hidden group/btn
                      ripple-effect
                      ${isCurrentPlan
                        ? 'bg-green-500/20 text-green-400 cursor-default border-2 border-green-500/50'
                        : plan.id === 'free'
                          ? 'bg-white/5 text-muted-foreground cursor-not-allowed border-2 border-white/10'
                          : `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-2xl border-2 border-white/20`
                      }
                    `}
                  >
                    {/* Button Glow */}
                    {!isPlanDisabled && plan.id !== 'free' && (
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${plan.color} opacity-0 group-hover/btn:opacity-50 blur-xl transition-opacity pointer-events-none`} />
                    )}

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loadingPlan === plan.id ? (
                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isCurrentPlan ? (
                        <>
                          <Check size={24} weight="bold" />
                          {t('pricing.currentPlan')}
                        </>
                      ) : (
                        <>
                          {plan.cta}
                          {plan.id !== 'free' && <Rocket size={20} weight="fill" />}
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Additional Note */}
                  {plan.id === 'pro' && (
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      💳 Cancel anytime, no questions asked
                    </p>
                  )}
                  {plan.id === 'unlimited' && (
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      🎯 Save 20% with annual billing
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ or Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/10 shine-effect">
              <ShieldCheck size={40} weight="duotone" className="text-green-400 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">All transactions encrypted with Stripe</p>
            </div>
            <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/10 shine-effect">
              <Heart size={40} weight="duotone" className="text-pink-400 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Cancel Anytime</h4>
              <p className="text-sm text-muted-foreground">No long-term commitments required</p>
            </div>
            <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/10 shine-effect">
              <Star size={40} weight="duotone" className="text-amber-400 mx-auto mb-4" />
              <h4 className="font-semibold text-foreground mb-2">Money-Back Guarantee</h4>
              <p className="text-sm text-muted-foreground">30-day refund, no questions asked</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

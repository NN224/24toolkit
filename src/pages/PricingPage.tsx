import { useState } from 'react'
import { Check, X, Sparkle, Lightning, Crown, Rocket, ArrowRight, ShieldCheck } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription, PLAN_LIMITS } from '@/contexts/SubscriptionContext'
import { useSEO } from '@/hooks/useSEO'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export default function PricingPage() {
  const { t } = useTranslation()
  useSEO({
    title: t('pricing.seo.title'),
    description: t('pricing.seo.description'),
  })

  const { user, signInWithGoogle } = useAuth()
  const { currentPlan } = useSubscription()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

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
      name: t('pricing.plans.free.name'),
      icon: Sparkle,
      description: t('pricing.plans.free.description'),
      price: 0,
      period: t('pricing.plans.free.period'),
      color: 'gray',
      gradient: 'from-gray-500 to-gray-600',
      features: PLAN_LIMITS.free.features,
      limitations: PLAN_LIMITS.free.limitations,
      cta: t('pricing.plans.free.cta'),
      disabled: true,
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      icon: Lightning,
      description: t('pricing.plans.pro.description'),
      price: PLAN_LIMITS.pro.price,
      period: t('pricing.plans.pro.period'),
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      features: PLAN_LIMITS.pro.features,
      limitations: PLAN_LIMITS.pro.limitations || [],
      cta: t('pricing.plans.pro.cta'),
      popular: true,
    },
    {
      id: 'unlimited',
      name: t('pricing.plans.unlimited.name'),
      icon: Crown,
      description: t('pricing.plans.unlimited.description'),
      price: PLAN_LIMITS.unlimited.price,
      period: t('pricing.plans.unlimited.period'),
      color: 'sky',
      gradient: 'from-purple-500 to-sky-500',
      features: PLAN_LIMITS.unlimited.features,
      limitations: [],
      cta: t('pricing.plans.unlimited.cta'),
      note: PLAN_LIMITS.unlimited.note,
    },
  ]

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-sky-500/20 border border-purple-500/30 mb-6">
            <Rocket size={16} weight="fill" className="text-purple-400" />
            <span className="text-sm font-medium text-purple-300">{t('pricing.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id
            const isPlanDisabled = plan.disabled || isCurrentPlan

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-6 lg:p-8 rounded-2xl border-2 transition-all ${
                  plan.popular
                    ? 'border-purple-500 bg-purple-500/5 scale-105 shadow-xl shadow-purple-500/20'
                    : 'border-white/10 bg-card hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium shadow-lg">
                    {t('pricing.mostPopular')}
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                    <Icon size={24} weight="fill" className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X size={20} className="text-red-400/60 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => plan.id !== 'free' && handleSubscribe(plan.id as 'pro' | 'unlimited')}
                  disabled={isPlanDisabled || loadingPlan === plan.id}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : plan.id === 'free'
                        ? 'bg-white/10 text-muted-foreground cursor-not-allowed'
                        : plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/25'
                          : 'bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90'
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    t('common.loading')
                  ) : isCurrentPlan ? (
                    <>
                      <Check size={20} weight="bold" />
                      {t('pricing.currentPlan')}
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      {plan.id !== 'free' && <ArrowRight size={20} />}
                    </>
                  )}
                </button>

                {/* Note */}
                {plan.note && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {plan.note}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-4 rounded-2xl bg-card border border-white/10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck size={20} className="text-green-400" />
              <span className="text-sm">{t('pricing.trustBadges.securePayment')}</span>
            </div>
            <div className="w-px h-6 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkle size={20} className="text-purple-400" />
              <span className="text-sm">{t('pricing.trustBadges.cancelAnytime')}</span>
            </div>
            <div className="w-px h-6 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lightning size={20} className="text-yellow-400" />
              <span className="text-sm">{t('pricing.trustBadges.instantAccess')}</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            {t('pricing.faq.title')}
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: t('pricing.faq.questions.cancel.q'),
                a: t('pricing.faq.questions.cancel.a')
              },
              {
                q: t('pricing.faq.questions.credits.q'),
                a: t('pricing.faq.questions.credits.a')
              },
              {
                q: t('pricing.faq.questions.refunds.q'),
                a: t('pricing.faq.questions.refunds.a')
              },
              {
                q: t('pricing.faq.questions.payment.q'),
                a: t('pricing.faq.questions.payment.a')
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-4 rounded-xl bg-card border border-white/10 cursor-pointer"
              >
                <summary className="font-medium text-foreground flex items-center justify-between">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground text-sm">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

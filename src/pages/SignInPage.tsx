import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useSEO } from '@/hooks/useSEO'
import { useTranslation } from 'react-i18next'
import Logo from '@/components/Logo'
import { 
  GoogleLogo, 
  GithubLogo, 
  FacebookLogo, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Rocket,
  Crown,
  Lightning,
  Heart
} from '@phosphor-icons/react'

type TabType = 'signin' | 'signup'

export default function SignInPage() {
  const { 
    user, 
    signInWithGoogle, 
    signInWithGithub, 
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    resetPassword
  } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('signin')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [formError, setFormError] = useState('')

  // Get redirect path from URL
  const searchParams = new URLSearchParams(location.search)
  const redirectTo = searchParams.get('redirect') || '/'
  const mode = searchParams.get('mode') as TabType | null

  // Set initial tab based on URL parameter
  useEffect(() => {
    if (mode === 'signup' || mode === 'signin') {
      setActiveTab(mode)
    }
  }, [mode])

  // SEO
  useSEO({
    title: activeTab === 'signin' ? 'Sign In | 24Toolkit' : 'Sign Up | 24Toolkit',
    description: activeTab === 'signin' 
      ? 'Sign in to access all tools and save your preferences'
      : 'Create an account to unlock premium features and save your work',
    keywords: 'sign in, sign up, login, register, authentication, 24toolkit',
    canonicalPath: '/sign-in'
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectTo)
    }
  }, [user, navigate, redirectTo])

  const handleProviderSignIn = async (providerFn: () => Promise<any>) => {
    setIsLoading(true)
    setFormError('')
    try {
      await providerFn()
      // Redirect handled by useEffect above
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    if (!email) {
      setFormError(t('auth.emailRequired'))
      return
    }
    if (!password) {
      setFormError(t('auth.passwordRequired'))
      return
    }
    
    setIsLoading(true)
    try {
      await signInWithEmail(email, password)
      // Redirect handled by useEffect
    } catch (error) {
      // Error already handled by toast in AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    if (!email) {
      setFormError(t('auth.emailRequired'))
      return
    }
    if (!password) {
      setFormError(t('auth.passwordRequired'))
      return
    }
    if (password !== confirmPassword) {
      setFormError(t('auth.passwordsDontMatch'))
      return
    }
    
    setIsLoading(true)
    try {
      await signUpWithEmail(email, password, displayName)
      // Redirect handled by useEffect
    } catch (error) {
      // Error already handled by toast in AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    if (!email) {
      setFormError(t('auth.emailRequired'))
      return
    }
    
    setIsLoading(true)
    try {
      await resetPassword(email)
      setShowResetPassword(false)
      setEmail('')
    } catch (error) {
      // Error already handled by toast in AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  const providers = [
    {
      name: 'Google',
      icon: GoogleLogo,
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      onClick: () => handleProviderSignIn(signInWithGoogle)
    },
    {
      name: 'GitHub',
      icon: GithubLogo,
      bgColor: 'bg-[#24292e] hover:bg-[#1b1f23]',
      textColor: 'text-white',
      borderColor: 'border-[#24292e]',
      onClick: () => handleProviderSignIn(signInWithGithub)
    },
    {
      name: 'Facebook',
      icon: FacebookLogo,
      bgColor: 'bg-[#1877F2] hover:bg-[#166FE5]',
      textColor: 'text-white',
      borderColor: 'border-[#1877F2]',
      onClick: () => handleProviderSignIn(signInWithFacebook)
    }
  ]

  const benefits = [
    { icon: Sparkles, text: 'AI-powered tools', color: 'text-purple-500' },
    { icon: ShieldCheck, text: 'Secure & Private', color: 'text-green-500' },
    { icon: Rocket, text: 'Fast & Reliable', color: 'text-sky-500' },
    { icon: Crown, text: 'Premium Features', color: 'text-amber-500' },
    { icon: Lightning, text: 'Instant Access', color: 'text-yellow-500' },
    { icon: Heart, text: 'Free Forever', color: 'text-pink-500' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-sky-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left Side - Branding & Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo & Title */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group mb-6">
              <Logo className="w-12 h-12 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                24Toolkit
              </span>
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                {activeTab === 'signin' ? 'Welcome Back!' : 'Join 24Toolkit'}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {activeTab === 'signin' 
                ? 'Access your favorite tools and continue where you left off'
                : 'Create your free account and unlock powerful tools'}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-background to-card group-hover:scale-110 transition-transform`}>
                    <Icon size={24} weight="duotone" className={benefit.color} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{benefit.text}</span>
                </motion.div>
              )
            })}
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-sky-500/10 border border-purple-500/20"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-sky-400 border-2 border-background flex items-center justify-center text-white font-bold text-sm"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Join 10,000+ users</p>
              <p className="text-xs text-muted-foreground">Trusted by developers worldwide</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center pt-8 pb-4">
              <Logo className="w-16 h-16" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
                  activeTab === 'signin'
                    ? 'text-purple-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
                {activeTab === 'signin' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-sky-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
                  activeTab === 'signup'
                    ? 'text-purple-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
                {activeTab === 'signup' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-sky-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-foreground">
                      {activeTab === 'signin' ? 'Welcome back!' : 'Create your account'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'signin'
                        ? 'Sign in to access your tools and settings'
                        : 'Sign up to unlock all features and save your work'}
                    </p>
                  </div>

                  {/* Provider Buttons */}
                  <div className="space-y-3">
                    {providers.map((provider) => {
                      const Icon = provider.icon
                      return (
                        <motion.button
                          key={provider.name}
                          onClick={provider.onClick}
                          disabled={isLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${provider.bgColor} ${provider.textColor} border ${provider.borderColor}`}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Icon size={20} weight="bold" />
                              <span>
                                {activeTab === 'signin' ? 'Sign in' : 'Sign up'} with {provider.name}
                              </span>
                            </>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-card text-muted-foreground">or</span>
                    </div>
                  </div>

                  {/* Email/Password Form */}
                  {!showResetPassword ? (
                    <form onSubmit={activeTab === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
                      {/* Error Message */}
                      {formError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                          {formError}
                        </div>
                      )}

                      {/* Name Field (Sign Up only) */}
                      {activeTab === 'signup' && (
                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-2">
                            {t('auth.fullName')}
                          </label>
                          <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      )}

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          {t('auth.email')}
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        />
                      </div>

                      {/* Password Field */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                          {t('auth.password')}
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        />
                      </div>

                      {/* Confirm Password (Sign Up only) */}
                      {activeTab === 'signup' && (
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                            {t('auth.confirmPassword')}
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      )}

                      {/* Forgot Password (Sign In only) */}
                      {activeTab === 'signin' && (
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(true)}
                            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {t('auth.forgotPassword')}
                          </button>
                        </div>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-sky-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>
                            {activeTab === 'signin' ? t('auth.signInWithEmail') : t('auth.signUpWithEmail')}
                          </span>
                        )}
                      </motion.button>
                    </form>
                  ) : (
                    /* Reset Password Form */
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {formError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                          {formError}
                        </div>
                      )}

                      <div>
                        <label htmlFor="resetEmail" className="block text-sm font-medium text-foreground mb-2">
                          {t('auth.email')}
                        </label>
                        <input
                          id="resetEmail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-sky-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>{t('auth.resetPassword')}</span>
                        )}
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowResetPassword(false)
                          setFormError('')
                        }}
                        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t('auth.backToSignIn')}
                      </button>
                    </form>
                  )}

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-card text-muted-foreground">or</span>
                    </div>
                  </div>

                  {/* Continue as Guest */}
                  <Link to={redirectTo}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
                    >
                      <span>Continue as Guest</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </Link>

                  {/* Terms */}
                  <p className="mt-6 text-xs text-center text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <Link to="/terms-of-service" className="text-purple-400 hover:text-purple-300 underline">
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline">
                      Privacy Policy
                    </Link>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:hidden mt-6 grid grid-cols-2 gap-3"
          >
            {benefits.slice(0, 4).map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.text}
                  className="flex items-center gap-2 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-white/10"
                >
                  <Icon size={20} weight="duotone" className={benefit.color} />
                  <span className="text-xs font-medium text-foreground">{benefit.text}</span>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

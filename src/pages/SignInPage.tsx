import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useSEO } from '@/hooks/useSEO'
import Logo from '@/components/Logo'
import {
  GoogleLogo,
  GithubLogo,
  MicrosoftOutlookLogo,
  AppleLogo,
  ArrowRight
} from '@phosphor-icons/react'

export default function SignInPage() {
  const { user, signInWithGoogle, signInWithGithub, signInWithMicrosoft, signInWithApple } = useAuth()
  const navigate = useNavigate()

  // SEO
  useSEO({
    title: 'تسجيل الدخول | 24Toolkit',
    description: 'سجل دخولك للوصول إلى جميع الأدوات واحفظ تفضيلاتك',
    keywords: 'تسجيل دخول, sign in, login, 24toolkit'
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const providers = [
    {
      name: 'Google',
      icon: GoogleLogo,
      color: 'from-red-500 to-orange-500',
      onClick: signInWithGoogle
    },
    {
      name: 'GitHub',
      icon: GithubLogo,
      color: 'from-gray-700 to-gray-900',
      onClick: signInWithGithub
    },
    {
      name: 'Microsoft',
      icon: MicrosoftOutlookLogo,
      color: 'from-blue-500 to-cyan-500',
      onClick: signInWithMicrosoft
    },
    {
      name: 'Apple',
      icon: AppleLogo,
      color: 'from-gray-800 to-black',
      onClick: signInWithApple
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
              مرحباً بعودتك
            </h1>
            <p className="text-muted-foreground">
              سجل دخولك للوصول إلى جميع الأدوات
            </p>
          </div>

          {/* Sign In Options */}
          <div className="space-y-3">
            {providers.map((provider) => {
              const Icon = provider.icon
              return (
                <motion.button
                  key={provider.name}
                  onClick={provider.onClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all border border-white/10 hover:border-white/20 bg-gradient-to-r ${provider.color} bg-opacity-10 hover:bg-opacity-20 text-foreground group`}
                >
                  <Icon size={24} weight="bold" className="group-hover:scale-110 transition-transform" />
                  <span>متابعة بواسطة {provider.name}</span>
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
              <span className="px-4 bg-card text-muted-foreground">أو</span>
            </div>
          </div>

          {/* Continue as Guest */}
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
            >
              <span>المتابعة كزائر</span>
              <ArrowRight size={18} />
            </motion.button>
          </Link>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-muted-foreground">
            بتسجيل الدخول، أنت توافق على{' '}
            <Link to="/terms-of-service" className="text-purple-400 hover:text-purple-300">
              شروط الخدمة
            </Link>
            {' '}و{' '}
            <Link to="/privacy-policy" className="text-purple-400 hover:text-purple-300">
              سياسة الخصوصية
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <p className="text-sm text-muted-foreground text-center mb-3">
            مميزات التسجيل:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-muted-foreground">حفظ التفضيلات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-muted-foreground">وصول سريع</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-muted-foreground">مزامنة الإعدادات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-muted-foreground">تحديثات حصرية</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { X, Lock, Sparkle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export function LoginModal({ isOpen, onClose, redirectPath }: LoginModalProps) {
  const { signInWithGoogle, signInWithGithub, signInWithFacebook } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    setIsLoading(true)
    setLoadingProvider(provider)
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          break
        case 'github':
          await signInWithGithub()
          break
        case 'facebook':
          await signInWithFacebook()
          break
      }
      onClose()
      
      // Redirect if path provided
      if (redirectPath) {
        window.location.href = redirectPath
      }
    } catch (error) {
      // Error already handled in AuthContext
    } finally {
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md"
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl border-2 border-accent/30 shadow-2xl mx-4">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600 to-sky-500 p-6 rounded-t-2xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Lock size={28} weight="fill" className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
                    <p className="text-white/80 text-sm">Access premium features</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkle size={20} className="text-accent" weight="fill" />
                    <h3 className="font-semibold text-foreground">Why sign in?</h3>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Access premium AI tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Save your progress</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Unlimited usage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>100% free - no credit card</span>
                    </li>
                  </ul>
                </div>

                {/* Sign In Buttons */}
                <div className="space-y-3">
                  {/* Google */}
                  <button
                    onClick={() => handleSignIn('google')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                  >
                    {loadingProvider === 'google' ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>

                  {/* GitHub */}
                  <button
                    onClick={() => handleSignIn('github')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#24292e] hover:bg-[#1b1f23] text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingProvider === 'github' ? (
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                    <span>Continue with GitHub</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleSignIn('facebook')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingProvider === 'facebook' ? (
                      <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    <span>Continue with Facebook</span>
                  </button>
                </div>

                {/* Privacy Note */}}
                <p className="mt-4 text-xs text-center text-muted-foreground">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                  Your data is encrypted and secure.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

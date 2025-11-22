import { useState } from 'react'
import { X, GoogleLogo, Lock, Sparkle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export function LoginModal({ isOpen, onClose, redirectPath }: LoginModalProps) {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      onClose()
      
      // Redirect if path provided
      if (redirectPath) {
        window.location.href = redirectPath
      }
    } catch (error) {
      // Error already handled in AuthContext
    } finally {
      setIsLoading(false)
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

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <GoogleLogo size={24} weight="bold" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Privacy Note */}
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

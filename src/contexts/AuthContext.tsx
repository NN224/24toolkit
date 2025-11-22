import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthProvider
} from 'firebase/auth'
import { auth, googleProvider, githubProvider, microsoftProvider, appleProvider } from '@/lib/firebase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      
      if (user) {
        console.log('User signed in:', user.email)
      } else {
        console.log('User signed out')
      }
    })

    return unsubscribe
  }, [])

  // Generic sign in function
  const signInWithProvider = async (provider: AuthProvider, providerName: string) => {
    try {
      const result = await signInWithPopup(auth, provider)
      toast.success(`مرحباً ${result.user.displayName || result.user.email}!`)
    } catch (error: any) {
      console.error(`${providerName} sign in error:`, error)
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('تم إلغاء تسجيل الدخول')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('يرجى السماح بالنوافذ المنبثقة')
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('هذا البريد مستخدم مع طريقة تسجيل دخول أخرى')
      } else {
        toast.error('فشل تسجيل الدخول. حاول مرة أخرى.')
      }
      throw error
    }
  }

  const signInWithGoogle = () => signInWithProvider(googleProvider, 'Google')
  const signInWithGithub = () => signInWithProvider(githubProvider, 'GitHub')
  const signInWithMicrosoft = () => signInWithProvider(microsoftProvider, 'Microsoft')
  const signInWithApple = () => signInWithProvider(appleProvider, 'Apple')

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signInWithMicrosoft,
    signInWithApple,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

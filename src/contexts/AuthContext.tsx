import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { 
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthProvider
} from 'firebase/auth'
import { auth, googleProvider, githubProvider, facebookProvider, getUserProfile, type UserProfile } from '@/lib/firebase'
import { toast } from 'sonner'
import { setUser as setSentryUser } from '@/lib/sentry'
import i18n from '@/i18n'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUserProfile: () => Promise<void>
  getIdToken: () => Promise<string | null>
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from Firestore
  const fetchUserProfile = useCallback(async (firebaseUser: User) => {
    try {
      const profile = await getUserProfile(
        firebaseUser.uid,
        firebaseUser.email,
        firebaseUser.displayName
      )
      setUserProfile(profile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Set default profile on error
      setUserProfile({
        aiCredits: 5,
        isPremium: false,
        lastResetDate: new Date(),
        createdAt: new Date(),
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      })
    }
  }, [])

  // Refresh user profile (useful after AI usage)
  const refreshUserProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user)
    }
  }, [user, fetchUserProfile])

  // Get Firebase ID token for API calls
  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null
    try {
      return await user.getIdToken()
    } catch (error) {
      console.error('Error getting ID token:', error)
      return null
    }
  }, [user])

  useEffect(() => {
    // If Firebase auth is not configured, set loading to false immediately
    if (!auth) {
      setLoading(false)
      return
    }
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Fetch/create user profile when user signs in
        await fetchUserProfile(firebaseUser)
        
        // Set user context for Sentry error tracking
        setSentryUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          username: firebaseUser.displayName || undefined,
        })
      } else {
        setUserProfile(null)
        // Clear Sentry user context
        setSentryUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [fetchUserProfile])

  // Generic sign in function
  const signInWithProvider = async (provider: AuthProvider, providerName: string) => {
    if (!auth) {
      toast.error(i18n.t('auth.notConfigured'))
      return
    }
    try {
      const result = await signInWithPopup(auth, provider)
      toast.success(i18n.t('auth.welcomeMessage', { name: result.user.displayName || result.user.email }))
    } catch (error: any) {
      // Sign in error
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error(i18n.t('auth.signInCancelled'))
      } else if (error.code === 'auth/popup-blocked') {
        toast.error(i18n.t('auth.allowPopups'))
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error(i18n.t('auth.emailUsedDifferent'))
      } else {
        toast.error(i18n.t('auth.signInFailed'))
      }
      throw error
    }
  }

  const signInWithGoogle = () => signInWithProvider(googleProvider, 'Google')
  const signInWithGithub = () => signInWithProvider(githubProvider, 'GitHub')
  const signInWithFacebook = () => signInWithProvider(facebookProvider, 'Facebook')

  // Sign in with Email/Password
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      toast.error(i18n.t('auth.notConfigured'))
      return
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success(i18n.t('auth.welcomeMessage', { name: result.user.displayName || result.user.email }))
    } catch (error: any) {
      console.error('Email sign in error:', error)
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error(i18n.t('auth.invalidCredentials'))
      } else if (error.code === 'auth/user-not-found') {
        toast.error(i18n.t('auth.userNotFound'))
      } else if (error.code === 'auth/invalid-email') {
        toast.error(i18n.t('auth.invalidEmail'))
      } else if (error.code === 'auth/too-many-requests') {
        toast.error(i18n.t('auth.tooManyAttempts'))
      } else {
        toast.error(i18n.t('auth.signInFailed'))
      }
      throw error
    }
  }

  // Sign up with Email/Password
  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    if (!auth) {
      toast.error(i18n.t('auth.notConfigured'))
      return
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      
      toast.success(i18n.t('auth.accountCreated'))
    } catch (error: any) {
      console.error('Email sign up error:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error(i18n.t('auth.emailInUse'))
      } else if (error.code === 'auth/invalid-email') {
        toast.error(i18n.t('auth.invalidEmail'))
      } else if (error.code === 'auth/weak-password') {
        toast.error(i18n.t('auth.weakPassword'))
      } else {
        toast.error(i18n.t('auth.signUpFailed'))
      }
      throw error
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    if (!auth) {
      toast.error(i18n.t('auth.notConfigured'))
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success(i18n.t('auth.resetEmailSent'))
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      if (error.code === 'auth/user-not-found') {
        toast.error(i18n.t('auth.userNotFound'))
      } else if (error.code === 'auth/invalid-email') {
        toast.error(i18n.t('auth.invalidEmail'))
      } else {
        toast.error(i18n.t('auth.resetFailed'))
      }
      throw error
    }
  }

  const signOut = async () => {
    if (!auth) {
      return
    }
    try {
      await firebaseSignOut(auth)
      setUserProfile(null)
      toast.success(i18n.t('auth.signedOutSuccess'))
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error(i18n.t('auth.signOutFailed'))
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    refreshUserProfile,
    getIdToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthProvider
} from 'firebase/auth'
import { auth, googleProvider, githubProvider, facebookProvider, getUserProfile, type UserProfile } from '@/lib/firebase'
import { toast } from 'sonner'
import { setUser as setSentryUser } from '@/lib/sentry'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signInWithFacebook: () => Promise<void>
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
    try {
      const result = await signInWithPopup(auth, provider)
      toast.success(`Welcome ${result.user.displayName || result.user.email}!`)
    } catch (error: any) {
      // Sign in error
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Please allow popups')
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('This email is used with a different sign-in method')
      } else {
        toast.error('Sign-in failed. Please try again.')
      }
      throw error
    }
  }

  const signInWithGoogle = () => signInWithProvider(googleProvider, 'Google')
  const signInWithGithub = () => signInWithProvider(githubProvider, 'GitHub')
  const signInWithFacebook = () => signInWithProvider(facebookProvider, 'Facebook')

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUserProfile(null)
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
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

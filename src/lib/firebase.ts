import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, Auth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, Timestamp, Firestore } from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Firebase configuration
// Get these from Firebase Console: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
}

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY)

// Initialize Firebase only if configured
let app: FirebaseApp | null = null
try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig)
  } else {
    console.warn('⚠️ Firebase not configured - running in demo mode')
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization failed:', error)
}

// Initialize Firebase App Check with reCAPTCHA v3
// This protects your Firebase resources from abuse
if (app && import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
      // Optional: Use debug token in development
      isTokenAutoRefreshEnabled: true
    })
    console.log('✅ Firebase App Check initialized')
  } catch (error) {
    console.warn('⚠️ App Check initialization failed:', error)
  }
} else if (!import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  console.warn('⚠️ App Check not initialized: VITE_RECAPTCHA_SITE_KEY is missing')
}

// Initialize Firebase Authentication (with null fallback)
export const auth: Auth | null = app ? getAuth(app) : null

// Initialize Firestore (with null fallback)
export const db: Firestore | null = app ? getFirestore(app) : null

// ============================================
// User Profile Types & Functions
// ============================================

export interface UserProfile {
  aiCredits: number
  isPremium: boolean
  lastResetDate: Date
  createdAt: Date
  email: string | null
  displayName: string | null
}

const DEFAULT_DAILY_CREDITS = 5

/**
 * Check if two dates are on the same day (UTC)
 * Using UTC ensures consistent behavior across all timezones
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  )
}

/**
 * Get or create a user profile in Firestore
 * If the user doesn't exist, create with default values
 * If lastResetDate is not today, reset credits
 */
export async function getUserProfile(userId: string, email?: string | null, displayName?: string | null): Promise<UserProfile> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  
  const now = new Date()
  
  if (!userSnap.exists()) {
    // Create new user profile with default credits
    const newProfile: UserProfile = {
      aiCredits: DEFAULT_DAILY_CREDITS,
      isPremium: false,
      lastResetDate: now,
      createdAt: now,
      email: email || null,
      displayName: displayName || null
    }
    
    await setDoc(userRef, {
      ...newProfile,
      lastResetDate: Timestamp.fromDate(now),
      createdAt: Timestamp.fromDate(now)
    })
    
    return newProfile
  }
  
  const data = userSnap.data()
  const lastResetDate = data.lastResetDate?.toDate() || now
  
  // Check if we need to reset daily credits
  if (!isSameDay(lastResetDate, now) && !data.isPremium) {
    // Reset credits for new day
    await updateDoc(userRef, {
      aiCredits: DEFAULT_DAILY_CREDITS,
      lastResetDate: Timestamp.fromDate(now)
    })
    
    return {
      aiCredits: DEFAULT_DAILY_CREDITS,
      isPremium: data.isPremium || false,
      lastResetDate: now,
      createdAt: data.createdAt?.toDate() || now,
      email: data.email || email || null,
      displayName: data.displayName || displayName || null
    }
  }
  
  return {
    aiCredits: data.aiCredits ?? DEFAULT_DAILY_CREDITS,
    isPremium: data.isPremium || false,
    lastResetDate: lastResetDate,
    createdAt: data.createdAt?.toDate() || now,
    email: data.email || null,
    displayName: data.displayName || null
  }
}

/**
 * Decrement user's AI credits by 1
 * Returns the new credit count
 */
export async function decrementCredits(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    throw new Error('User not found')
  }
  
  const currentCredits = userSnap.data().aiCredits ?? 0
  const newCredits = Math.max(0, currentCredits - 1)
  
  await updateDoc(userRef, {
    aiCredits: newCredits
  })
  
  return newCredits
}

// ============================================
// Authentication Providers
// ============================================

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// GitHub Auth Provider
export const githubProvider = new GithubAuthProvider()
githubProvider.setCustomParameters({
  allow_signup: 'true'
})

// Facebook Auth Provider
export const facebookProvider = new FacebookAuthProvider()
facebookProvider.setCustomParameters({
  display: 'popup'
})

export default app

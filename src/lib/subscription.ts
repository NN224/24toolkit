/**
 * Subscription System Configuration
 * ================================
 * 
 * Plans:
 * - Free: 5 AI requests/day, with ads
 * - Pro ($4.99/mo): 100 AI requests/month, no ads
 * - Unlimited ($9.99/mo): Unlimited AI (fair use: 50/day), no ads, priority
 */

import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore'

// ============================================
// Types
// ============================================

export type SubscriptionPlan = 'free' | 'pro' | 'unlimited'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'

export interface Subscription {
  odg: SubscriptionPlan
  status: SubscriptionStatus
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
}

export interface UserCredits {
  // For Free users: daily credits (reset each day)
  dailyCredits: number
  dailyCreditsUsed: number
  lastDailyReset: Date
  
  // For Pro users: monthly credits
  monthlyCredits: number
  monthlyCreditsUsed: number
  lastMonthlyReset: Date
  
  // For Unlimited users: daily fair use limit
  dailyUnlimitedUsed: number
  lastUnlimitedReset: Date
}

export interface UserSubscriptionData {
  odg: SubscriptionPlan
  status: SubscriptionStatus
  credits: UserCredits
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================
// Constants
// ============================================

export const PLAN_LIMITS = {
  free: {
    dailyCredits: 5,
    name: 'Free',
    price: 0,
    features: [
      '5 AI requests per day',
      'All standard tools',
      'Community support',
    ],
    limitations: [
      'Ads displayed',
      'No priority processing',
      'Credits reset daily',
    ]
  },
  pro: {
    monthlyCredits: 100,
    name: 'Pro',
    price: 4.99,
    priceId: 'price_1SZhqYGTzfQcDdsZ0iQtvcz6',
    features: [
      '100 AI requests per month',
      'All standard tools',
      'No advertisements',
      'Smart History saved',
      'Email support',
    ],
    limitations: [
      'Monthly credit limit',
    ]
  },
  unlimited: {
    dailyFairUse: 50,
    name: 'Unlimited',
    price: 9.99,
    priceId: 'price_1SZhrYGTzfQcDdsZkzR4nCMU',
    features: [
      'Unlimited AI requests*',
      'All standard tools',
      'No advertisements',
      'Smart History saved',
      'Priority processing',
      'Priority support',
      'Early access to new features',
    ],
    limitations: [],
    note: '* Fair use policy: ~50 requests/day for optimal experience'
  }
} as const

// ============================================
// Helper Functions
// ============================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  )
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth()
  )
}

// ============================================
// Subscription Functions
// ============================================

/**
 * Get user's subscription data from Firestore
 */
export async function getUserSubscription(userId: string): Promise<UserSubscriptionData> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  
  const now = new Date()
  
  // Default subscription data
  const defaultData: UserSubscriptionData = {
    odg: 'free',
    status: 'active',
    credits: {
      dailyCredits: PLAN_LIMITS.free.dailyCredits,
      dailyCreditsUsed: 0,
      lastDailyReset: now,
      monthlyCredits: PLAN_LIMITS.pro.monthlyCredits,
      monthlyCreditsUsed: 0,
      lastMonthlyReset: now,
      dailyUnlimitedUsed: 0,
      lastUnlimitedReset: now,
    },
    createdAt: now,
    updatedAt: now,
  }
  
  if (!userSnap.exists()) {
    // Create new user with default subscription
    await setDoc(userRef, {
      plan: 'free',
      status: 'active',
      aiCredits: PLAN_LIMITS.free.dailyCredits,
      lastResetDate: Timestamp.fromDate(now),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    })
    return defaultData
  }
  
  const data = userSnap.data()
  const plan = data.plan || 'free'
  const status = data.status || 'active'
  
  // Handle both old format (aiCredits) and new format (credits object)
  const credits = data.credits || {}
  const lastResetDate = data.lastResetDate?.toDate() || now
  
  // Parse dates - support both formats
  const lastDailyReset = credits.lastDailyReset?.toDate() || lastResetDate
  const lastMonthlyReset = credits.lastMonthlyReset?.toDate() || now
  const lastUnlimitedReset = credits.lastUnlimitedReset?.toDate() || now
  
  // Check if we need to reset credits
  let needsUpdate = false
  const updates: Record<string, unknown> = {}
  
  // For free users, use aiCredits field (compatible with server)
  if (plan === 'free') {
    const aiCredits = data.aiCredits ?? PLAN_LIMITS.free.dailyCredits
    
    // Reset daily credits if new day
    if (!isSameDay(lastDailyReset, now)) {
      updates.aiCredits = PLAN_LIMITS.free.dailyCredits
      updates.lastResetDate = Timestamp.fromDate(now)
      needsUpdate = true
    }
    
    if (needsUpdate) {
      updates.updatedAt = Timestamp.fromDate(now)
      await updateDoc(userRef, updates)
    }
    
    const currentAiCredits = needsUpdate ? PLAN_LIMITS.free.dailyCredits : aiCredits
    const dailyCreditsUsed = PLAN_LIMITS.free.dailyCredits - currentAiCredits
    
    return {
      odg: plan,
      status: status,
      credits: {
        dailyCredits: PLAN_LIMITS.free.dailyCredits,
        dailyCreditsUsed: Math.max(0, dailyCreditsUsed),
        lastDailyReset: needsUpdate ? now : lastDailyReset,
        monthlyCredits: PLAN_LIMITS.pro.monthlyCredits,
        monthlyCreditsUsed: 0,
        lastMonthlyReset: now,
        dailyUnlimitedUsed: 0,
        lastUnlimitedReset: now,
      },
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      currentPeriodStart: data.currentPeriodStart?.toDate(),
      currentPeriodEnd: data.currentPeriodEnd?.toDate(),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      createdAt: data.createdAt?.toDate() || now,
      updatedAt: data.updatedAt?.toDate() || now,
    }
  }
  
  // For pro users, use credits.monthlyCreditsUsed
  if (plan === 'pro') {
    const monthlyCredits = credits.monthlyCredits || PLAN_LIMITS.pro.monthlyCredits
    let monthlyCreditsUsed = credits.monthlyCreditsUsed || 0
    
    // Reset monthly credits if new month
    if (!isSameMonth(lastMonthlyReset, now)) {
      updates['credits.monthlyCreditsUsed'] = 0
      updates['credits.lastMonthlyReset'] = Timestamp.fromDate(now)
      monthlyCreditsUsed = 0
      needsUpdate = true
    }
    
    if (needsUpdate) {
      updates.updatedAt = Timestamp.fromDate(now)
      await updateDoc(userRef, updates)
    }
    
    return {
      odg: plan,
      status: status,
      credits: {
        dailyCredits: PLAN_LIMITS.free.dailyCredits,
        dailyCreditsUsed: 0,
        lastDailyReset: now,
        monthlyCredits: monthlyCredits,
        monthlyCreditsUsed: monthlyCreditsUsed,
        lastMonthlyReset: needsUpdate ? now : lastMonthlyReset,
        dailyUnlimitedUsed: 0,
        lastUnlimitedReset: now,
      },
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      currentPeriodStart: data.currentPeriodStart?.toDate(),
      currentPeriodEnd: data.currentPeriodEnd?.toDate(),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      createdAt: data.createdAt?.toDate() || now,
      updatedAt: data.updatedAt?.toDate() || now,
    }
  }
  
  // For unlimited users
  let dailyUnlimitedUsed = credits.dailyUnlimitedUsed || 0
  
  if (!isSameDay(lastUnlimitedReset, now)) {
    updates['credits.dailyUnlimitedUsed'] = 0
    updates['credits.lastUnlimitedReset'] = Timestamp.fromDate(now)
    dailyUnlimitedUsed = 0
    needsUpdate = true
  }
  
  if (needsUpdate) {
    updates.updatedAt = Timestamp.fromDate(now)
    await updateDoc(userRef, updates)
  }
  
  return {
    odg: plan,
    status: status,
    credits: {
      dailyCredits: PLAN_LIMITS.free.dailyCredits,
      dailyCreditsUsed: 0,
      lastDailyReset: now,
      monthlyCredits: PLAN_LIMITS.pro.monthlyCredits,
      monthlyCreditsUsed: 0,
      lastMonthlyReset: now,
      dailyUnlimitedUsed: dailyUnlimitedUsed,
      lastUnlimitedReset: needsUpdate ? now : lastUnlimitedReset,
    },
    stripeCustomerId: data.stripeCustomerId,
    stripeSubscriptionId: data.stripeSubscriptionId,
    currentPeriodStart: data.currentPeriodStart?.toDate(),
    currentPeriodEnd: data.currentPeriodEnd?.toDate(),
    cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    createdAt: data.createdAt?.toDate() || now,
    updatedAt: data.updatedAt?.toDate() || now,
  }
}

/**
 * Check if user can make an AI request
 */
export function canUseAI(subscription: UserSubscriptionData): { allowed: boolean; reason?: string; remaining?: number } {
  const { odg: plan, status, credits } = subscription
  
  // Check if subscription is active
  if (status !== 'active' && status !== 'trialing') {
    return { allowed: false, reason: 'Subscription is not active' }
  }
  
  switch (plan) {
    case 'free': {
      const remaining = credits.dailyCredits - credits.dailyCreditsUsed
      if (remaining <= 0) {
        return { allowed: false, reason: 'Daily limit reached. Upgrade for more!', remaining: 0 }
      }
      return { allowed: true, remaining }
    }
    
    case 'pro': {
      const remaining = credits.monthlyCredits - credits.monthlyCreditsUsed
      if (remaining <= 0) {
        return { allowed: false, reason: 'Monthly limit reached. Upgrade to Unlimited!', remaining: 0 }
      }
      return { allowed: true, remaining }
    }
    
    case 'unlimited': {
      // Fair use: soft limit of 50/day, but we allow more
      const used = credits.dailyUnlimitedUsed
      const fairUseLimit = PLAN_LIMITS.unlimited.dailyFairUse
      
      // Always allow, but warn if approaching limit
      if (used >= fairUseLimit * 2) {
        // Hard limit at 100/day to prevent abuse
        return { allowed: false, reason: 'Please try again tomorrow', remaining: 0 }
      }
      
      return { allowed: true, remaining: fairUseLimit - used }
    }
    
    default:
      return { allowed: false, reason: 'Unknown plan' }
  }
}

/**
 * Use one AI credit
 */
export async function useAICredit(userId: string): Promise<{ success: boolean; remaining: number }> {
  const subscription = await getUserSubscription(userId)
  const canUse = canUseAI(subscription)
  
  if (!canUse.allowed) {
    return { success: false, remaining: 0 }
  }
  
  const userRef = doc(db, 'users', userId)
  const now = new Date()
  
  switch (subscription.odg) {
    case 'free':
      await updateDoc(userRef, {
        'credits.dailyCreditsUsed': subscription.credits.dailyCreditsUsed + 1,
        updatedAt: Timestamp.fromDate(now),
      })
      return { 
        success: true, 
        remaining: subscription.credits.dailyCredits - subscription.credits.dailyCreditsUsed - 1 
      }
    
    case 'pro':
      await updateDoc(userRef, {
        'credits.monthlyCreditsUsed': subscription.credits.monthlyCreditsUsed + 1,
        updatedAt: Timestamp.fromDate(now),
      })
      return { 
        success: true, 
        remaining: subscription.credits.monthlyCredits - subscription.credits.monthlyCreditsUsed - 1 
      }
    
    case 'unlimited':
      await updateDoc(userRef, {
        'credits.dailyUnlimitedUsed': subscription.credits.dailyUnlimitedUsed + 1,
        updatedAt: Timestamp.fromDate(now),
      })
      return { 
        success: true, 
        remaining: PLAN_LIMITS.unlimited.dailyFairUse - subscription.credits.dailyUnlimitedUsed - 1 
      }
    
    default:
      return { success: false, remaining: 0 }
  }
}

/**
 * Get remaining credits display string
 */
export function getCreditsDisplay(subscription: UserSubscriptionData): string {
  const { odg: plan, credits } = subscription
  
  switch (plan) {
    case 'free': {
      const remaining = credits.dailyCredits - credits.dailyCreditsUsed
      return `${remaining}/${credits.dailyCredits} today`
    }
    
    case 'pro': {
      const remaining = credits.monthlyCredits - credits.monthlyCreditsUsed
      return `${remaining}/${credits.monthlyCredits} this month`
    }
    
    case 'unlimited': {
      return '∞ Unlimited'
    }
    
    default:
      return 'N/A'
  }
}

/**
 * Check if user should see ads
 */
export function shouldShowAds(subscription: UserSubscriptionData): boolean {
  return subscription.odg === 'free'
}

/**
 * Listen to subscription changes in real-time
 */
export function subscribeToSubscription(
  userId: string, 
  callback: (subscription: UserSubscriptionData) => void
): () => void {
  const userRef = doc(db, 'users', userId)
  
  return onSnapshot(userRef, async (doc) => {
    if (doc.exists()) {
      const subscription = await getUserSubscription(userId)
      callback(subscription)
    }
  })
}

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Uses service account credentials from environment variable
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Parse service account from environment variable
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountJson) {
    console.error('FIREBASE_SERVICE_ACCOUNT is not set');
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
    console.log('Firebase Admin: Initializing with project:', serviceAccount.project_id);
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON format');
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Get Firestore instance
export function getFirestoreAdmin() {
  initializeFirebaseAdmin();
  return admin.firestore();
}

// Get Auth instance for verifying tokens
export function getAuthAdmin() {
  initializeFirebaseAdmin();
  return admin.auth();
}

const DEFAULT_DAILY_CREDITS = 5;

/**
 * Check if two dates are on the same day (UTC)
 * Using UTC ensures consistent behavior across all timezones
 */
function isSameDay(date1, date2) {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

/**
 * Verify Firebase ID token and return user data
 */
export async function verifyIdToken(idToken) {
  const auth = getAuthAdmin();
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
    };
  } catch (error) {
    console.error('Token verification error:', error.code, error.message);
    throw new Error(`Invalid or expired authentication token: ${error.code || error.message}`);
  }
}

/**
 * Get user profile from Firestore
 * Creates new profile if doesn't exist
 * Resets daily credits if needed
 * 
 * Checks subscription status from Stripe webhook data:
 * - plan: 'free' | 'pro' | 'unlimited'
 * - status: 'active' | 'trialing' | 'past_due' | 'canceled'
 */
export async function getUserCredits(userId) {
  const db = getFirestoreAdmin();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  const now = new Date();
  
  if (!userDoc.exists) {
    // Create new user with default credits
    const newUser = {
      aiCredits: DEFAULT_DAILY_CREDITS,
      plan: 'free',
      status: 'active',
      lastResetDate: admin.firestore.Timestamp.fromDate(now),
      createdAt: admin.firestore.Timestamp.fromDate(now),
    };
    await userRef.set(newUser);
    
    return {
      aiCredits: DEFAULT_DAILY_CREDITS,
      plan: 'free',
      status: 'active',
      isPremium: false,
      lastResetDate: now,
    };
  }
  
  const data = userDoc.data();
  const lastResetDate = data.lastResetDate?.toDate() || now;
  
  // Check if user has an active paid subscription
  const plan = data.plan || 'free';
  const status = data.status || 'active';
  const isPaidPlan = plan === 'pro' || plan === 'unlimited';
  const isActiveSubscription = status === 'active' || status === 'trialing';
  const isPremium = isPaidPlan && isActiveSubscription;
  
  // For unlimited plan, no credit limits
  if (plan === 'unlimited' && isActiveSubscription) {
    return {
      aiCredits: Infinity,
      plan: plan,
      status: status,
      isPremium: true,
      lastResetDate: now,
    };
  }
  
  // For pro plan, check monthly credits
  if (plan === 'pro' && isActiveSubscription) {
    const monthlyCredits = data.credits?.monthlyCredits || 100;
    const monthlyCreditsUsed = data.credits?.monthlyCreditsUsed || 0;
    const remainingCredits = Math.max(0, monthlyCredits - monthlyCreditsUsed);
    
    return {
      aiCredits: remainingCredits,
      plan: plan,
      status: status,
      isPremium: true,
      lastResetDate: now,
    };
  }
  
  // Free plan: Check if we need to reset daily credits (new day)
  if (!isSameDay(lastResetDate, now)) {
    await userRef.update({
      aiCredits: DEFAULT_DAILY_CREDITS,
      lastResetDate: admin.firestore.Timestamp.fromDate(now),
    });
    
    return {
      aiCredits: DEFAULT_DAILY_CREDITS,
      plan: plan,
      status: status,
      isPremium: false,
      lastResetDate: now,
    };
  }
  
  return {
    aiCredits: data.aiCredits ?? DEFAULT_DAILY_CREDITS,
    plan: plan,
    status: status,
    isPremium: isPremium,
    lastResetDate: lastResetDate,
  };
}

/**
 * Decrement user's AI credits by 1
 * Returns the updated credit count
 * 
 * For Pro users: increments monthlyCreditsUsed
 * For Unlimited users: no decrement (unlimited usage)
 * For Free users: decrements aiCredits
 */
export async function decrementUserCredits(userId) {
  const db = getFirestoreAdmin();
  const userRef = db.collection('users').doc(userId);
  
  // Use transaction to ensure atomic update
  const newCredits = await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    const data = userDoc.data();
    const plan = data.plan || 'free';
    const status = data.status || 'active';
    const isActiveSubscription = status === 'active' || status === 'trialing';
    
    // Unlimited plan: no credits to decrement
    if (plan === 'unlimited' && isActiveSubscription) {
      return Infinity;
    }
    
    // Pro plan: increment monthlyCreditsUsed
    if (plan === 'pro' && isActiveSubscription) {
      const monthlyCredits = data.credits?.monthlyCredits || 100;
      const monthlyCreditsUsed = (data.credits?.monthlyCreditsUsed || 0) + 1;
      
      transaction.update(userRef, { 
        'credits.monthlyCreditsUsed': monthlyCreditsUsed 
      });
      
      return Math.max(0, monthlyCredits - monthlyCreditsUsed);
    }
    
    // Free plan: decrement aiCredits
    const currentCredits = data.aiCredits ?? 0;
    const updatedCredits = Math.max(0, currentCredits - 1);
    
    transaction.update(userRef, { aiCredits: updatedCredits });
    
    return updatedCredits;
  });
  
  return newCredits;
}

/**
 * Check if user can use AI (has credits or has active paid subscription)
 * Returns { allowed: boolean, reason?: string, remainingCredits?: number }
 * 
 * Subscription Plans:
 * - free: 5 daily credits (reset at midnight UTC)
 * - pro: 100 monthly credits
 * - unlimited: no limits
 */
export async function checkAIUsageAllowed(userId) {
  const userCredits = await getUserCredits(userId);
  
  // Unlimited users have unlimited access
  if (userCredits.plan === 'unlimited' && userCredits.isPremium) {
    return {
      allowed: true,
      isPremium: true,
      plan: 'unlimited',
      remainingCredits: Infinity,
    };
  }
  
  // Pro users have monthly credits
  if (userCredits.plan === 'pro' && userCredits.isPremium) {
    if (userCredits.aiCredits > 0) {
      return {
        allowed: true,
        isPremium: true,
        plan: 'pro',
        remainingCredits: userCredits.aiCredits,
      };
    }
    
    return {
      allowed: false,
      isPremium: true,
      plan: 'pro',
      remainingCredits: 0,
      reason: 'Monthly limit reached. You have used all 100 Pro AI requests for this month. Credits reset on your billing date.',
    };
  }
  
  // Free users: check daily credits
  if (userCredits.aiCredits > 0) {
    return {
      allowed: true,
      isPremium: false,
      plan: 'free',
      remainingCredits: userCredits.aiCredits,
    };
  }
  
  // No credits remaining
  return {
    allowed: false,
    isPremium: false,
    plan: 'free',
    remainingCredits: 0,
    reason: 'Daily limit reached. You have used all 5 free AI requests for today. Credits reset at midnight.',
  };
}

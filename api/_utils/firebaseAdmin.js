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
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
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
    throw new Error('Invalid or expired authentication token');
  }
}

/**
 * Get user profile from Firestore
 * Creates new profile if doesn't exist
 * Resets daily credits if needed
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
      isPremium: false,
      lastResetDate: admin.firestore.Timestamp.fromDate(now),
      createdAt: admin.firestore.Timestamp.fromDate(now),
    };
    await userRef.set(newUser);
    
    return {
      aiCredits: DEFAULT_DAILY_CREDITS,
      isPremium: false,
      lastResetDate: now,
    };
  }
  
  const data = userDoc.data();
  const lastResetDate = data.lastResetDate?.toDate() || now;
  
  // Check if we need to reset daily credits (new day)
  if (!isSameDay(lastResetDate, now) && !data.isPremium) {
    await userRef.update({
      aiCredits: DEFAULT_DAILY_CREDITS,
      lastResetDate: admin.firestore.Timestamp.fromDate(now),
    });
    
    return {
      aiCredits: DEFAULT_DAILY_CREDITS,
      isPremium: data.isPremium || false,
      lastResetDate: now,
    };
  }
  
  return {
    aiCredits: data.aiCredits ?? DEFAULT_DAILY_CREDITS,
    isPremium: data.isPremium || false,
    lastResetDate: lastResetDate,
  };
}

/**
 * Decrement user's AI credits by 1
 * Returns the updated credit count
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
    
    const currentCredits = userDoc.data().aiCredits ?? 0;
    const updatedCredits = Math.max(0, currentCredits - 1);
    
    transaction.update(userRef, { aiCredits: updatedCredits });
    
    return updatedCredits;
  });
  
  return newCredits;
}

/**
 * Check if user can use AI (has credits or is premium)
 * Returns { allowed: boolean, reason?: string, creditsRemaining?: number }
 */
export async function checkAIUsageAllowed(userId) {
  const userCredits = await getUserCredits(userId);
  
  // Premium users have unlimited access
  if (userCredits.isPremium) {
    return {
      allowed: true,
      isPremium: true,
      creditsRemaining: Infinity,
    };
  }
  
  // Check if user has credits
  if (userCredits.aiCredits > 0) {
    return {
      allowed: true,
      isPremium: false,
      creditsRemaining: userCredits.aiCredits,
    };
  }
  
  // No credits remaining
  return {
    allowed: false,
    isPremium: false,
    creditsRemaining: 0,
    reason: 'Daily limit reached. You have used all 5 free AI requests for today. Credits reset at midnight.',
  };
}

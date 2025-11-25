import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

// Validate JWT_SECRET in production
if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error(
    "JWT_SECRET environment variable is required in production and must be at least 32 characters long"
  )
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (process.env.NODE_ENV === "development" ? "dev-secret-key-min-32-chars-for-local" : "")
)

if (!JWT_SECRET.length) {
  throw new Error("JWT_SECRET is required")
}

const TOKEN_NAME = "admin_token"
const TOKEN_EXPIRY = "7d"

// Password hashing functions
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// JWT token functions
export async function generateToken(adminId: string, email: string): Promise<string> {
  const token = await new SignJWT({ adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
    }
  } catch (error) {
    return null
  }
}

// Session management
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_NAME)?.value
}

// Helper functions
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  if (!token) return false

  const payload = await verifyToken(token)
  return payload !== null
}

export async function getAdminFromToken(): Promise<{ adminId: string; email: string } | null> {
  const token = await getAuthToken()
  if (!token) return null

  return verifyToken(token)
}

// Password validation
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" }
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: "Password must include at least one number" }
  }
  return { valid: true }
}

// Rate limiting (simple in-memory implementation)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(email: string): { allowed: boolean; remainingAttempts?: number } {
  const now = Date.now()
  const attempt = loginAttempts.get(email)

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(email, { count: 1, resetTime: now + 60 * 60 * 1000 }) // 1 hour
    return { allowed: true, remainingAttempts: 4 }
  }

  if (attempt.count >= 5) {
    return { allowed: false }
  }

  attempt.count++
  return { allowed: true, remainingAttempts: 5 - attempt.count }
}

export function resetRateLimit(email: string) {
  loginAttempts.delete(email)
}

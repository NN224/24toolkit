export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import {
  verifyPassword,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  getAdminFromToken,
  checkRateLimit,
  resetRateLimit,
} from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { sanitizeEmail } from "@/lib/security/sanitize"

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    let sanitizedEmail
    try {
      sanitizedEmail = sanitizeEmail(email)
    } catch (error) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    const rateLimit = checkRateLimit(sanitizedEmail)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please try again in 1 hour." },
        { status: 429 },
      )
    }

    const supabase = await createClient()
    const { data: admin, error } = await supabase.from("admin_users").select("*").eq("email", sanitizedEmail).single()

    if (error || !admin) {
      // Don't log sensitive information in production
      if (process.env.NODE_ENV === "development") {
        console.error("[AUTH ERROR] Admin not found:", { email: sanitizedEmail, error: error?.message })
      }
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, admin.password_hash)
    
    if (!isValidPassword) {
      // Don't log sensitive information in production
      if (process.env.NODE_ENV === "development") {
        console.error("[AUTH ERROR] Invalid password for:", sanitizedEmail)
      }
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    resetRateLimit(sanitizedEmail)

    const token = await generateToken(admin.id, admin.email)
    await setAuthCookie(token)

    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during login" }, { status: 500 })
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  try {
    await clearAuthCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during logout" }, { status: 500 })
  }
}

// GET /api/admin/auth - Check session
export async function GET() {
  try {
    const admin = await getAdminFromToken()

    if (!admin) {
      return NextResponse.json({ authenticated: false })
    }

    // Get full admin details from database
    const supabase = await createClient()
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id, email, name")
      .eq("id", admin.adminId)
      .single()

    if (!adminData) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
      },
    })
  } catch (error) {
    console.error("[v0] Session check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}

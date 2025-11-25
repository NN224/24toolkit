export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { generateComparison } from "@/lib/groq"
import { saveComparison } from "@/lib/db/comparisons"
import { getComparisonBySlug } from "@/lib/comparisons-data"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/security/rate-limiter"
import { sanitizeProductName, sanitizeEmail, detectSpam } from "@/lib/security/sanitize"

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

function generateSlug(product1: string, product2: string): string {
  const normalized1 = normalizeProductName(product1)
  const normalized2 = normalizeProductName(product2)

  const [first, second] = [normalized1, normalized2].sort()
  return `${first}-vs-${second}`
}

function validateInput(product1: string, product2: string): { valid: boolean; error?: string } {
  if (!product1?.trim() || !product2?.trim()) {
    return { valid: false, error: "Both products are required" }
  }

  if (product1.length < 3 || product1.length > 100) {
    return { valid: false, error: "Product 1 name must be between 3 and 100 characters" }
  }

  if (product2.length < 3 || product2.length > 100) {
    return { valid: false, error: "Product 2 name must be between 3 and 100 characters" }
  }

  if (product1.toLowerCase().trim() === product2.toLowerCase().trim()) {
    return { valid: false, error: "Products must be different" }
  }

  if (detectSpam(product1) || detectSpam(product2)) {
    return { valid: false, error: "Invalid product names" }
  }

  return { valid: true }
}

async function checkExistingComparison(slug: string) {
  const staticComparison = getComparisonBySlug(slug)
  if (staticComparison) {
    return { exists: true, status: "approved", data: staticComparison }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("comparisons_dynamic")
      .select("*")
      .or(`product_a.eq.${slug.split("-vs-")[0]},product_b.eq.${slug.split("-vs-")[1]}`)
      .or(`product_a.eq.${slug.split("-vs-")[1]},product_b.eq.${slug.split("-vs-")[0]}`)
      .single()

    if (data) {
      return { exists: true, status: data.status, data }
    }
  } catch (error) {
    // No existing comparison found
  }

  return { exists: false }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("[v0] GROQ_API_KEY is not configured")
      return NextResponse.json(
        {
          success: false,
          error: "AI service is not configured. Please add GROQ_API_KEY to environment variables.",
          code: "MISSING_API_KEY",
        },
        { status: 500 },
      )
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimit = checkRateLimit(ip, { maxRequests: 5, windowMs: 60 * 60 * 1000 })

    if (!rateLimit.allowed) {
      const headers = getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Maximum 5 generations per hour.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429, headers },
      )
    }

    const body = await request.json()
    const { product1, product2, category, language = "en", email, notifyOnApproval = false } = body

    const sanitizedProduct1 = sanitizeProductName(product1)
    const sanitizedProduct2 = sanitizeProductName(product2)
    let sanitizedEmail = null

    if (email) {
      try {
        sanitizedEmail = sanitizeEmail(email)
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid email format",
            code: "INVALID_EMAIL",
          },
          { status: 400 },
        )
      }
    }

    const validation = validateInput(sanitizedProduct1, sanitizedProduct2)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          code: "INVALID_INPUT",
        },
        { status: 400 },
      )
    }

    const slug = generateSlug(sanitizedProduct1, sanitizedProduct2)
    const existing = await checkExistingComparison(slug)

    if (existing.exists) {
      if (existing.status === "approved") {
        return NextResponse.json({
          success: true,
          status: "approved",
          message: "This comparison already exists!",
          slug,
          data: existing.data,
        })
      }

      if (existing.status === "pending") {
        return NextResponse.json({
          success: true,
          status: "pending",
          message: "This comparison has already been submitted and is under review.",
          estimated_review_time: "24-48 hours",
        })
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[v0] Generating comparison with AI:", {
        product1: sanitizedProduct1,
        product2: sanitizedProduct2,
        category,
      })
    }

    let aiResult
    try {
      aiResult = await generateComparison(sanitizedProduct1, sanitizedProduct2, category, language)
      if (process.env.NODE_ENV === "development") {
        console.log("[v0] AI generation successful")
      }
    } catch (error) {
      console.error("[v0] AI generation failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return NextResponse.json(
        {
          success: false,
          error: `Failed to generate comparison: ${errorMessage}. Please try again or contact support.`,
          code: "AI_ERROR",
        },
        { status: 500 },
      )
    }

    const comparisonData = {
      summary: aiResult.summary,
      product_a_score: 85,
      product_b_score: 82,
      product_a_strengths: aiResult.pros_cons.product1.pros,
      product_b_strengths: aiResult.pros_cons.product2.pros,
      product_a_weaknesses: aiResult.pros_cons.product1.cons,
      product_b_weaknesses: aiResult.pros_cons.product2.cons,
      winner: aiResult.verdict.overall.toLowerCase().includes(sanitizedProduct1.toLowerCase())
        ? sanitizedProduct1
        : sanitizedProduct2,
      recommendation: aiResult.verdict.overall,
      sections: aiResult.comparison_sections,
      faqs: aiResult.faqs,
    }

    let savedSuccessfully = false
    try {
      await saveComparison(sanitizedProduct1, sanitizedProduct2, aiResult.category, comparisonData, sanitizedEmail || undefined)
      savedSuccessfully = true
    } catch (error) {
      console.error("[v0] Database save failed:", error)
      // Don't fail the request if database save fails - user still gets the comparison
    }

    return NextResponse.json({
      success: true,
      status: savedSuccessfully ? "pending" : "generated",
      message: "Comparison generated successfully!",
      slug,
      comparisonUrl: `/comparison/${slug}`,
      isPending: savedSuccessfully,
      data: {
        title: `${sanitizedProduct1} vs ${sanitizedProduct2}`,
        optionA: { name: sanitizedProduct1 },
        optionB: { name: sanitizedProduct2 },
        summary: aiResult.summary,
        product_a_score: 85,
        product_b_score: 82,
        product_a_strengths: aiResult.pros_cons.product1.pros,
        product_b_strengths: aiResult.pros_cons.product2.pros,
        product_a_weaknesses: aiResult.pros_cons.product1.cons,
        product_b_weaknesses: aiResult.pros_cons.product2.cons,
        recommendation: aiResult.verdict.overall,
        sections: aiResult.comparison_sections,
        faqs: aiResult.faqs,
        category: aiResult.category,
      },
    })
  } catch (error) {
    console.error("[v0] Generate API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        success: false,
        error: `An unexpected error occurred: ${errorMessage}. Please try again.`,
        code: "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    )
  }
}

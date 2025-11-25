export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { generateComparison } from "@/lib/groq"
import { saveComparison } from "@/lib/db/comparisons"

export async function POST(request: Request) {
  try {
    const { productA, productB } = await request.json()

    if (!productA || !productB) {
      return NextResponse.json({ error: "Both products are required" }, { status: 400 })
    }

    const comparison = await generateComparison(productA.trim(), productB.trim())

    // Save to database with pending status for admin moderation
    let saved = false
    let saveMessage = ""

    try {
      const comparisonData = {
        summary: comparison.summary,
        product_a_score: 0,
        product_b_score: 0,
        product_a_strengths: comparison.pros_cons.product1.pros,
        product_b_strengths: comparison.pros_cons.product2.pros,
        product_a_weaknesses: comparison.pros_cons.product1.cons,
        product_b_weaknesses: comparison.pros_cons.product2.cons,
        winner: "pending",
        recommendation: comparison.verdict.overall,
      }

      await saveComparison(
        comparison.product1.name,
        comparison.product2.name,
        comparison.category || "AI Generated",
        comparisonData,
      )

      saved = true
      saveMessage = "Your comparison has been submitted for review and will be published after approval."
    } catch (dbError) {
      console.error("[v0] Failed to save comparison to database:", dbError)
      saved = false
      saveMessage =
        "Database is not configured yet. Please contact admin to enable the moderation system. (See SUPABASE_MIGRATION_INSTRUCTIONS.md)"
    }

    // Transform AI response to match frontend expectations
    const response = {
      productA: comparison.product1.name,
      productB: comparison.product2.name,
      summary: comparison.summary,
      strengthsA: comparison.pros_cons.product1.pros,
      weaknessesA: comparison.pros_cons.product1.cons,
      strengthsB: comparison.pros_cons.product2.pros,
      weaknessesB: comparison.pros_cons.product2.cons,
      recommendation: comparison.verdict.overall,
      saved,
      message: saveMessage,
      // Include full comparison data for advanced features
      fullComparison: comparison,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Error in battle API:", error)

    // Provide user-friendly error messages
    const errorMessage = error instanceof Error ? error.message : "Failed to generate comparison"

    return NextResponse.json(
      {
        error: errorMessage,
        fallback: "Our AI service is temporarily unavailable. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}

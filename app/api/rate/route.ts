export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { comparisonSlug, productChoice, rating } = await request.json()

    if (!comparisonSlug || !productChoice || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (productChoice !== "A" && productChoice !== "B") {
      return NextResponse.json({ error: "Invalid product choice" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const supabase = await createClient()
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Try to insert or update rating
    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        {
          comparison_slug: comparisonSlug,
          product_choice: productChoice,
          rating: rating,
          user_id: user?.id || null,
          ip_address: ipAddress,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: user?.id ? "comparison_slug,product_choice,user_id" : "comparison_slug,product_choice,ip_address",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Error saving rating:", error)
      return NextResponse.json({ error: "Failed to save rating" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in rate API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

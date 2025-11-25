export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { comparisonSlug, productChoice } = await request.json()

    if (!comparisonSlug || !productChoice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (productChoice !== "A" && productChoice !== "B") {
      return NextResponse.json({ error: "Invalid product choice" }, { status: 400 })
    }

    const supabase = await createClient()
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Try to insert or update vote
    const { data, error } = await supabase
      .from("votes")
      .upsert(
        {
          comparison_slug: comparisonSlug,
          product_choice: productChoice,
          user_id: user?.id || null,
          ip_address: ipAddress,
          user_agent: userAgent,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: user?.id ? "comparison_slug,user_id" : "comparison_slug,ip_address",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Error saving vote:", error)
      return NextResponse.json({ error: "Failed to save vote" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in vote API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

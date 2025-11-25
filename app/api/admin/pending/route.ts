import { type NextRequest, NextResponse } from "next/server"
import { getAdminFromToken } from "@/lib/auth"
import { getPendingComparisons } from "@/lib/db/comparisons"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromToken()
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const comparisons = await getPendingComparisons()

    const formattedComparisons = comparisons.map((comp) => ({
      id: comp.id,
      slug: `${comp.product_a.toLowerCase().replace(/\s+/g, "-")}-vs-${comp.product_b.toLowerCase().replace(/\s+/g, "-")}`,
      product1_name: comp.product_a,
      product2_name: comp.product_b,
      category: comp.category,
      submitted_at: comp.created_at,
      content: comp.comparison_data,
    }))

    return NextResponse.json({
      success: true,
      comparisons: formattedComparisons,
      total: comparisons.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching pending comparisons:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pending comparisons" }, { status: 500 })
  }
}

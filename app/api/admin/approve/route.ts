export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { getAdminFromToken } from "@/lib/auth"
import { approveComparison } from "@/lib/db/comparisons"

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromToken()
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { comparisonId } = body

    if (!comparisonId) {
      return NextResponse.json({ success: false, error: "Comparison ID is required" }, { status: 400 })
    }

    const approvedComparison = await approveComparison(comparisonId, admin.adminId)

    // Log admin actions for audit trail (always log for security)
    console.log(`[v0] Admin ${admin.email} approved comparison ${comparisonId}`)

    return NextResponse.json({
      success: true,
      message: "Comparison approved successfully",
      comparison: approvedComparison,
    })
  } catch (error) {
    console.error("[v0] Error approving comparison:", error)
    return NextResponse.json({ success: false, error: "Failed to approve comparison" }, { status: 500 })
  }
}

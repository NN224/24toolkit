export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { getAdminFromToken } from "@/lib/auth"
import { rejectComparison } from "@/lib/db/comparisons"

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromToken()
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { comparisonId, reason } = body

    if (!comparisonId) {
      return NextResponse.json({ success: false, error: "Comparison ID is required" }, { status: 400 })
    }

    if (!reason) {
      return NextResponse.json({ success: false, error: "Rejection reason is required" }, { status: 400 })
    }

    const validReasons = ["Inappropriate content", "Spam", "Low quality", "Duplicate", "Other"]
    if (!validReasons.includes(reason) && !reason.startsWith("Other:")) {
      return NextResponse.json({ success: false, error: "Invalid rejection reason" }, { status: 400 })
    }

    const rejectedComparison = await rejectComparison(comparisonId, admin.adminId, reason)

    // Log admin actions for audit trail (always log for security)
    console.log(`[v0] Admin ${admin.email} rejected comparison ${comparisonId} - Reason: ${reason}`)

    return NextResponse.json({
      success: true,
      message: "Comparison rejected successfully",
      comparison: rejectedComparison,
    })
  } catch (error) {
    console.error("[v0] Error rejecting comparison:", error)
    return NextResponse.json({ success: false, error: "Failed to reject comparison" }, { status: 500 })
  }
}

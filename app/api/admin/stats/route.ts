export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { getAdminFromToken } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromToken()
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { count: totalComparisons } = await supabase
      .from("comparisons")
      .select("*", { count: "exact", head: true })

    const { count: pendingCount } = await supabase
      .from("comparisons")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    const { count: publishedCount } = await supabase
      .from("comparisons")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    const { count: rejectedCount } = await supabase
      .from("comparisons")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected")

    const stats = {
      total_comparisons: totalComparisons || 0,
      pending: pendingCount || 0,
      published: publishedCount || 0,
      rejected: rejectedCount || 0,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("[Admin] Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}

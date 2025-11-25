import { type NextRequest, NextResponse } from "next/server"
import { getVoteStats } from "@/lib/api/voting"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 })
    }

    const stats = await getVoteStats(slug)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in vote stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

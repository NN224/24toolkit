export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

// Cache analytics for 2 minutes (120 seconds)
export const revalidate = 120

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "week"

    // Note: This endpoint returns mock data
    // To implement: Aggregate analytics data from database tables (views, votes, ratings)
    // Calculate metrics: total views, active users, top comparisons, views by category
    const mockAnalytics = {
      period,
      totalViews: 1234567,
      totalComparisons: 72,
      activeUsers: 45000,
      averageRating: 4.8,
      topComparisons: [
        { slug: "iphone-vs-samsung", title: "iPhone vs Samsung", views: 25400 },
        { slug: "netflix-vs-disney", title: "Netflix vs Disney Plus", views: 15200 },
        { slug: "airbnb-vs-hotel", title: "Airbnb vs Hotels", views: 13200 },
      ],
      viewsByCategory: {
        Technology: 45000,
        Streaming: 32000,
        Travel: 18000,
        Lifestyle: 15000,
        Shopping: 12000,
      },
      recentActivity: [
        {
          type: "view",
          comparison: "Netflix vs Disney Plus",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          type: "view",
          comparison: "iPhone vs Samsung",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }

    return NextResponse.json(mockAnalytics)
  } catch (error) {
    console.error("Error in analytics API:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

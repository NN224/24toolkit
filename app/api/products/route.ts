export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

// Cache products for 5 minutes (300 seconds) - static data
export const revalidate = 300

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const locale = searchParams.get("locale") || "en"

    // Note: This endpoint returns mock data
    // To implement: Query the comparisons table from Supabase with filtering by category and locale
    // Example: SELECT * FROM comparisons WHERE is_published = true AND category = $1
    const mockProducts = [
      {
        id: "1",
        slug: "netflix-vs-disney",
        title: locale === "ar" ? "نتفليكس مقابل ديزني بلس" : "Netflix vs Disney Plus",
        description: locale === "ar" ? "مقارنة شاملة لخدمات البث" : "Comprehensive comparison of streaming services",
        category: locale === "ar" ? "خدمات البث" : "Streaming Services",
        views: 15200,
        lastUpdated: "2025-01-15",
      },
      {
        id: "2",
        slug: "iphone-vs-samsung",
        title: locale === "ar" ? "آيفون مقابل سامسونج جالاكسي" : "iPhone vs Samsung Galaxy",
        description: locale === "ar" ? "المواجهة النهائية للهواتف الذكية" : "The ultimate smartphone showdown",
        category: locale === "ar" ? "التكنولوجيا" : "Technology",
        views: 25400,
        lastUpdated: "2025-01-10",
      },
      {
        id: "3",
        slug: "airbnb-vs-hotel",
        title: locale === "ar" ? "Airbnb مقابل الفنادق" : "Airbnb vs Hotels",
        description: locale === "ar" ? "قارن خيارات الإقامة لرحلتك" : "Compare accommodation options for your trip",
        category: locale === "ar" ? "السفر والإقامة" : "Travel & Accommodation",
        views: 13200,
        lastUpdated: "2025-01-12",
      },
    ]

    // Filter by category if provided
    const filteredProducts = category
      ? mockProducts.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()))
      : mockProducts

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
    })
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

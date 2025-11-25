export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

// Cache individual product for 5 minutes (300 seconds)
export const revalidate = 300

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Note: This endpoint returns mock data
    // To implement: Query the comparisons table from Supabase by slug
    // Example: SELECT * FROM comparisons WHERE slug = $1 AND is_published = true
    const mockProducts: Record<string, any> = {
      "netflix-vs-disney": {
        id: "1",
        slug: "netflix-vs-disney",
        title: "Netflix vs Disney Plus",
        description: "Comprehensive comparison of Netflix and Disney Plus streaming services",
        category: "Streaming Services",
        views: 15200,
        lastUpdated: "2025-01-15",
        content: {
          optionA: {
            name: "Netflix",
            pros: [
              "Largest content library",
              "Award-winning originals",
              "Multiple subscription tiers",
              "Available worldwide",
            ],
          },
          optionB: {
            name: "Disney Plus",
            pros: ["Exclusive Disney content", "Family-friendly", "Lower price", "4K included"],
          },
          sections: [
            {
              title: "Content Library",
              content: "Netflix has the largest library with 15,000+ titles...",
            },
            {
              title: "Pricing",
              content: "Netflix offers three tiers starting at $6.99/month...",
            },
          ],
          verdict: "Choose Netflix for variety, Disney Plus for family content and value.",
        },
      },
      "iphone-vs-samsung": {
        id: "2",
        slug: "iphone-vs-samsung",
        title: "iPhone vs Samsung Galaxy",
        description: "The ultimate smartphone comparison",
        category: "Technology",
        views: 25400,
        lastUpdated: "2025-01-10",
        content: {
          optionA: {
            name: "iPhone",
            pros: ["iOS ecosystem", "Long-term support", "Superior video", "Privacy features"],
          },
          optionB: {
            name: "Samsung Galaxy",
            pros: ["Customizable Android", "Better displays", "More RAM", "Expandable storage"],
          },
          sections: [
            {
              title: "Design & Build",
              content: "Both feature premium materials and excellent build quality...",
            },
            {
              title: "Performance",
              content: "iPhone's A-series chips lead in single-core performance...",
            },
          ],
          verdict: "Choose iPhone for simplicity and ecosystem, Samsung for customization and features.",
        },
      },
    }

    const product = mockProducts[slug]

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error in product API:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

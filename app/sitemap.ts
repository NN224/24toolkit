import type { MetadataRoute } from "next"
import { comparisons } from "@/lib/comparisons-data"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.productsvs.com"

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-battle`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quick-decision`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Static comparisons from comparisons-data.ts
  const staticComparisons: MetadataRoute.Sitemap = comparisons.map((comparison) => ({
    url: `${baseUrl}/comparison/${comparison.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Dynamic comparisons from database (approved only - pending excluded for SEO)
  let dynamicComparisons: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("comparisons_dynamic")
      .select("product_a, product_b, updated_at")
      .eq("status", "approved")
      .order("updated_at", { ascending: false })

    if (!error && data) {
      // Generate slugs from product names and create sitemap entries
      dynamicComparisons = data.map((comparison) => {
        const slug = `${comparison.product_a.toLowerCase().replace(/\s+/g, "-")}-vs-${comparison.product_b.toLowerCase().replace(/\s+/g, "-")}`
        return {
          url: `${baseUrl}/comparison/${slug}`,
          lastModified: new Date(comparison.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }
      })
    }
  } catch (error) {
    console.error("Error fetching dynamic comparisons for sitemap:", error)
  }

  return [...staticPages, ...staticComparisons, ...dynamicComparisons]
}

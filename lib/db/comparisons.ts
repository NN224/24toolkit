import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export interface DynamicComparison {
  id: string
  product_a: string
  product_b: string
  category: string
  comparison_data: {
    summary: string
    product_a_score: number
    product_b_score: number
    product_a_strengths: string[]
    product_b_strengths: string[]
    product_a_weaknesses: string[]
    product_b_weaknesses: string[]
    winner: string
    recommendation: string
    faqs?: {
      question: string
      answer: string
    }[]
  }
  status: "pending" | "approved" | "rejected"
  submitted_by?: string
  reviewed_by?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  approved_at?: string
  views?: number
  notification_email?: string
}

export async function getPendingComparisons() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("comparisons_dynamic")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as DynamicComparison[]
}

export async function getApprovedComparisons() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("comparisons_dynamic")
    .select("*")
    .eq("status", "approved")
    .order("approved_at", { ascending: false })

  if (error) throw error
  return data as DynamicComparison[]
}

export async function approveComparison(id: string, reviewerId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("comparisons_dynamic")
    .update({
      status: "approved",
      reviewed_by: reviewerId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function rejectComparison(id: string, reviewerId: string, reason: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("comparisons_dynamic")
    .update({
      status: "rejected",
      reviewed_by: reviewerId,
      rejection_reason: reason,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function saveComparison(
  productA: string,
  productB: string,
  category: string,
  comparisonData: DynamicComparison["comparison_data"],
  email?: string,
) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("comparisons_dynamic")
    .insert({
      product_a: productA,
      product_b: productB,
      category,
      comparison_data: comparisonData,
      status: "pending",
      notification_email: email || null,
      views: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getComparisonBySlug(slug: string, statuses: string[] = ["approved"]) {
  const supabase = await createClient()

  // Generate slug from product names (assuming slug format is "product-a-vs-product-b")
  const { data, error } = await supabase
    .from("comparisons_dynamic")
    .select("*")
    .in("status", statuses)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching comparison by slug:", error)
    return null
  }

  // Find the comparison that matches the slug
  const comparison = data?.find((comp) => {
    const generatedSlug = `${comp.product_a.toLowerCase().replace(/\s+/g, "-")}-vs-${comp.product_b.toLowerCase().replace(/\s+/g, "-")}`
    return generatedSlug === slug
  })

  if (!comparison) return null

  // Transform to match the static comparison format
  // Map AI-generated sections to the frontend format
  const sections = comparison.comparison_data.sections
    ? comparison.comparison_data.sections.map((section: any) => ({
      title: section.title,
      content: `${comparison.product_a}: ${section.product1_points.join(", ")}. ${comparison.product_b}: ${section.product2_points.join(", ")}.${section.winner !== "tie" ? ` Winner: ${section.winner === "product1" ? comparison.product_a : comparison.product_b}.` : ""}`,
    }))
    : [
      {
        title: "Overview",
        content: comparison.comparison_data.summary,
      },
      {
        title: "Strengths & Weaknesses",
        content: `${comparison.product_a} excels in: ${comparison.comparison_data.product_a_strengths.join(", ")}. However, it has weaknesses in: ${comparison.comparison_data.product_a_weaknesses.join(", ")}. On the other hand, ${comparison.product_b} is strong in: ${comparison.comparison_data.product_b_strengths.join(", ")}, but struggles with: ${comparison.comparison_data.product_b_weaknesses.join(", ")}.`,
      },
    ]

  return {
    slug,
    title: `${comparison.product_a} vs ${comparison.product_b}`,
    description: comparison.comparison_data.summary,
    category: comparison.category,
    views: comparison.views?.toString() || "0",
    lastUpdated: new Date(comparison.updated_at).toLocaleDateString(),
    status: comparison.status,
    optionA: {
      name: comparison.product_a,
      pros: comparison.comparison_data.product_a_strengths,
    },
    optionB: {
      name: comparison.product_b,
      pros: comparison.comparison_data.product_b_strengths,
    },
    sections,
    verdict: comparison.comparison_data.recommendation,
    faqs: comparison.comparison_data.faqs,
  }
}

export async function incrementViews(slug: string) {
  const supabase = await createClient()

  // Find the comparison by slug
  const { data: comparisons, error: fetchError } = await supabase
    .from("comparisons_dynamic")
    .select("*")
    .eq("status", "approved")

  if (fetchError) {
    console.error("[v0] Error fetching comparison for view increment:", fetchError)
    return
  }

  const comparison = comparisons?.find((comp) => {
    const generatedSlug = `${comp.product_a.toLowerCase().replace(/\s+/g, "-")}-vs-${comp.product_b.toLowerCase().replace(/\s+/g, "-")}`
    return generatedSlug === slug
  })

  if (!comparison) return

  // Increment views in database
  const { error } = await supabase
    .from("comparisons_dynamic")
    .update({ views: (comparison.views || 0) + 1 })
    .eq("id", comparison.id)

  if (error) {
    console.error("[v0] Error incrementing views:", error)
  }
}

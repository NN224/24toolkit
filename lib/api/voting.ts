import { createClient } from "@/lib/supabase/server"

export interface VoteStats {
  productAVotes: number
  productBVotes: number
  totalVotes: number
  productAPercentage: number
  productBPercentage: number
}

export interface RatingStats {
  product: "A" | "B"
  averageRating: number
  totalRatings: number
  rating1: number
  rating2: number
  rating3: number
  rating4: number
  rating5: number
}

export async function getVoteStats(slug: string): Promise<VoteStats> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_vote_stats", { slug })

  if (error) {
    console.error("Error fetching vote stats:", error)
    return {
      productAVotes: 0,
      productBVotes: 0,
      totalVotes: 0,
      productAPercentage: 0,
      productBPercentage: 0,
    }
  }

  const stats = data[0] || {}
  return {
    productAVotes: Number(stats.product_a_votes) || 0,
    productBVotes: Number(stats.product_b_votes) || 0,
    totalVotes: Number(stats.total_votes) || 0,
    productAPercentage: Number(stats.product_a_percentage) || 0,
    productBPercentage: Number(stats.product_b_percentage) || 0,
  }
}

export async function getRatingStats(slug: string): Promise<RatingStats[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_rating_stats", { slug })

  if (error) {
    console.error("Error fetching rating stats:", error)
    return []
  }

  return (data || []).map((stat: any) => ({
    product: stat.product,
    averageRating: Number(stat.average_rating) || 0,
    totalRatings: Number(stat.total_ratings) || 0,
    rating1: Number(stat.rating_1) || 0,
    rating2: Number(stat.rating_2) || 0,
    rating3: Number(stat.rating_3) || 0,
    rating4: Number(stat.rating_4) || 0,
    rating5: Number(stat.rating_5) || 0,
  }))
}

export async function getUserVote(slug: string, ipAddress: string): Promise<"A" | "B" | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("votes")
    .select("product_choice")
    .eq("comparison_slug", slug)
    .eq("ip_address", ipAddress)
    .single()

  return data?.product_choice || null
}

export async function getUserRating(slug: string, product: "A" | "B", ipAddress: string): Promise<number | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("ratings")
    .select("rating")
    .eq("comparison_slug", slug)
    .eq("product_choice", product)
    .eq("ip_address", ipAddress)
    .single()

  return data?.rating || null
}

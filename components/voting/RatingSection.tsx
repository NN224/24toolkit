"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingSectionProps {
  comparisonSlug: string
  productAName: string
  productBName: string
}

export function RatingSection({ comparisonSlug, productAName, productBName }: RatingSectionProps) {
  const [ratingA, setRatingA] = useState(0)
  const [ratingB, setRatingB] = useState(0)
  const [hoverA, setHoverA] = useState(0)
  const [hoverB, setHoverB] = useState(0)
  const [statsA, setStatsA] = useState({ averageRating: 0, totalRatings: 0 })
  const [statsB, setStatsB] = useState({ averageRating: 0, totalRatings: 0 })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRatingStats()
  }, [comparisonSlug])

  const fetchRatingStats = async () => {
    try {
      const response = await fetch(`/api/rate/stats?slug=${comparisonSlug}`)
      if (response.ok) {
        const data = await response.json()
        const productAStats = data.find((s: any) => s.product === "A")
        const productBStats = data.find((s: any) => s.product === "B")

        if (productAStats) setStatsA(productAStats)
        if (productBStats) setStatsB(productBStats)
      }
    } catch (error) {
      console.error("Error fetching rating stats:", error)
    }
  }

  const handleRate = async (product: "A" | "B", rating: number) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comparisonSlug,
          productChoice: product,
          rating,
        }),
      })

      if (response.ok) {
        if (product === "A") setRatingA(rating)
        else setRatingB(rating)
        await fetchRatingStats()
      }
    } catch (error) {
      console.error("Error rating:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const StarRating = ({
    product,
    currentRating,
    hover,
    setHover,
    onRate,
    productName,
    stats,
  }: {
    product: "A" | "B"
    currentRating: number
    hover: number
    setHover: (v: number) => void
    onRate: (rating: number) => void
    productName: string
    stats: { averageRating: number; totalRatings: number }
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{productName}</h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{stats.averageRating.toFixed(1)}</span>
          <span>({stats.totalRatings})</span>
        </div>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            disabled={currentRating > 0 || isLoading}
            className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                star <= (hover || currentRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Rate Each Product</h3>
      <p className="text-muted-foreground mb-6">Share your experience with these products</p>

      <div className="space-y-6">
        <StarRating
          product="A"
          currentRating={ratingA}
          hover={hoverA}
          setHover={setHoverA}
          onRate={(rating) => handleRate("A", rating)}
          productName={productAName}
          stats={statsA}
        />

        <StarRating
          product="B"
          currentRating={ratingB}
          hover={hoverB}
          setHover={setHoverB}
          onRate={(rating) => handleRate("B", rating)}
          productName={productBName}
          stats={statsB}
        />
      </div>
    </Card>
  )
}

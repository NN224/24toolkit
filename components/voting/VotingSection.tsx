"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThumbsUp, TrendingUp } from "lucide-react"

interface VotingSectionProps {
  comparisonSlug: string
  productAName: string
  productBName: string
}

export function VotingSection({ comparisonSlug, productAName, productBName }: VotingSectionProps) {
  const [userVote, setUserVote] = useState<"A" | "B" | null>(null)
  const [stats, setStats] = useState({
    productAVotes: 0,
    productBVotes: 0,
    totalVotes: 0,
    productAPercentage: 0,
    productBPercentage: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchVoteStats()
  }, [comparisonSlug])

  const fetchVoteStats = async () => {
    try {
      const response = await fetch(`/api/vote/stats?slug=${comparisonSlug}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching vote stats:", error)
    }
  }

  const handleVote = async (choice: "A" | "B") => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comparisonSlug,
          productChoice: choice,
        }),
      })

      if (response.ok) {
        setUserVote(choice)
        await fetchVoteStats()
      }
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Which is Better?</h3>
      </div>

      <p className="text-muted-foreground mb-6">Cast your vote and see what others think</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant={userVote === "A" ? "default" : "outline"}
          size="lg"
          onClick={() => handleVote("A")}
          disabled={isLoading || userVote !== null}
          className="h-auto py-4 flex flex-col gap-2"
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="font-semibold">{productAName}</span>
          {userVote && (
            <span className="text-sm">
              {stats.productAPercentage}% ({stats.productAVotes} votes)
            </span>
          )}
        </Button>

        <Button
          variant={userVote === "B" ? "default" : "outline"}
          size="lg"
          onClick={() => handleVote("B")}
          disabled={isLoading || userVote !== null}
          className="h-auto py-4 flex flex-col gap-2"
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="font-semibold">{productBName}</span>
          {userVote && (
            <span className="text-sm">
              {stats.productBPercentage}% ({stats.productBVotes} votes)
            </span>
          )}
        </Button>
      </div>

      {userVote && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Votes: {stats.totalVotes}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${stats.productAPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{stats.productAPercentage}%</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-500"
                  style={{ width: `${stats.productBPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{stats.productBPercentage}%</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

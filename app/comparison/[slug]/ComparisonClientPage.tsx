"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, Send, Star, ThumbsUp, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import AdUnit from "@/components/ads/AdUnit"
import MobileStickyAd from "@/components/ads/MobileStickyAd"
import { adsenseConfig } from "@/lib/config/adsense"
import { comparisons } from "@/lib/comparisons-data"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// New Components
import ComparisonHero from "./_components/ComparisonHero"
import ComparisonTable from "./_components/ComparisonTable"
import StickyHeader from "./_components/StickyHeader"
import FAQAccordion from "./_components/FAQAccordion"
import ShareButtons from "./_components/ShareButtons"

interface Comment {
  id: string
  name: string
  email: string
  text: string
  date: string
}

interface Rating {
  value: number
  count: number
}

export default function ComparisonClientPage({
  params,
  initialComparison,
  source,
  isPending = false,
}: {
  params: { slug: string }
  initialComparison: any
  source: "static" | "dynamic"
  isPending?: boolean
}) {
  const comparison = initialComparison

  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentForm, setCommentForm] = useState({ name: "", email: "", text: "" })
  const [viewCount, setViewCount] = useState<number>(0)
  const [pollVote, setPollVote] = useState<string | null>(null)
  const [pollResults, setPollResults] = useState({ optionA: 0, optionB: 0 })
  const [relatedComparisons, setRelatedComparisons] = useState<typeof comparisons>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRatings = localStorage.getItem(`ratings-${params.slug}`)
      const savedComments = localStorage.getItem(`comments-${params.slug}`)

      if (savedRatings) {
        const ratingsData: Rating = JSON.parse(savedRatings)
        setAverageRating(ratingsData.value)
        setRatingCount(ratingsData.count)
      }

      if (savedComments) {
        setComments(JSON.parse(savedComments))
      }

      const pollKey = `poll-${params.slug}`
      const savedPoll = localStorage.getItem(pollKey)
      if (savedPoll) {
        setPollResults(JSON.parse(savedPoll))
      }

      const userVoteKey = `poll-vote-${params.slug}`
      const userVote = localStorage.getItem(userVoteKey)
      if (userVote) {
        setPollVote(userVote)
      }
    }
  }, [params.slug])

  useEffect(() => {
    if (comparison) {
      const sameCategory = comparisons
        .filter((c) => c.category === comparison.category && c.slug !== comparison.slug)
        .slice(0, 4)

      const crossCategory = comparisons
        .filter((c) => c.category !== comparison.category && c.slug !== comparison.slug)
        .slice(0, 2)

      setRelatedComparisons([...sameCategory, ...crossCategory])
    }
  }, [comparison])

  useEffect(() => {
    if (typeof window !== "undefined" && source === "static") {
      const viewKey = `views-${params.slug}`
      const currentViews = Number.parseInt(localStorage.getItem(viewKey) || "0")
      const newViews = currentViews + 1
      setViewCount(newViews)
      localStorage.setItem(viewKey, newViews.toString())
    }
  }, [params.slug, source])

  const handleRatingClick = (value: number) => {
    setRating(value)
    const newCount = ratingCount + 1
    const newAverage = (averageRating * ratingCount + value) / newCount

    setAverageRating(newAverage)
    setRatingCount(newCount)

    if (typeof window !== "undefined") {
      localStorage.setItem(`ratings-${params.slug}`, JSON.stringify({ value: newAverage, count: newCount }))
    }
    toast.success("Thank you for rating!")
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentForm.name || !commentForm.email || !commentForm.text) return

    const newComment: Comment = {
      id: Date.now().toString(),
      name: commentForm.name,
      email: commentForm.email,
      text: commentForm.text,
      date: new Date().toLocaleDateString(),
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)

    if (typeof window !== "undefined") {
      localStorage.setItem(`comments-${params.slug}`, JSON.stringify(updatedComments))
    }

    setCommentForm({ name: "", email: "", text: "" })
    toast.success("Comment posted successfully!")
  }

  const handlePollVote = (option: "A" | "B") => {
    if (pollVote) return

    const newResults = {
      optionA: option === "A" ? pollResults.optionA + 1 : pollResults.optionA,
      optionB: option === "B" ? pollResults.optionB + 1 : pollResults.optionB,
    }

    setPollResults(newResults)
    setPollVote(option)

    if (typeof window !== "undefined") {
      localStorage.setItem(`poll-${params.slug}`, JSON.stringify(newResults))
      localStorage.setItem(`poll-vote-${params.slug}`, option)
    }
    toast.success("Vote recorded!")
  }

  const scrollToVote = () => {
    document.getElementById("voting-section")?.scrollIntoView({ behavior: "smooth" })
  }

  if (!comparison) {
    return (
      <PageLayout currentPath={`/comparison/${params.slug}`}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Comparison Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            This comparison doesn't exist yet, but you can create it!
          </p>
          <Button asChild size="lg">
            <Link href="/#ai-battle">Generate with AI Battle</Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  const totalVotes = pollResults.optionA + pollResults.optionB
  const percentageA = totalVotes > 0 ? Math.round((pollResults.optionA / totalVotes) * 100) : 0
  const percentageB = totalVotes > 0 ? Math.round((pollResults.optionB / totalVotes) * 100) : 0

  return (
    <PageLayout currentPath={`/comparison/${params.slug}`}>
      <StickyHeader
        title={comparison.title}
        product1={comparison.optionA.name}
        product2={comparison.optionB.name}
        onVoteClick={scrollToVote}
      />

      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Comparisons", href: "/en" }, { label: comparison.title }]}
        />
      </div>

      {isPending && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 p-4 rounded-xl text-center font-medium">
            ⏳ Pending Review: This comparison is currently under moderation.
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mb-8">
        <AdUnit slot={adsenseConfig.slots.comparison_header} format="horizontal" responsive={true} />
      </div>

      <ComparisonHero comparison={comparison} viewCount={viewCount} />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main Content */}
          <main className="space-y-16">

            {/* Quick Comparison Table */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Quick Comparison</h2>
                <ShareButtons title={comparison.title} slug={params.slug} />
              </div>
              <ComparisonTable comparison={comparison} />
            </section>

            {/* Detailed Analysis */}
            <section className="space-y-12">
              <h2 className="text-3xl font-bold border-b pb-4">Detailed Analysis</h2>
              {comparison.sections.map((section: any, index: number) => (
                <div key={index} className="prose dark:prose-invert max-w-none">
                  <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                    {section.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {section.content}
                  </p>
                </div>
              ))}
            </section>

            <div className="py-8">
              <AdUnit slot={adsenseConfig.slots.comparison_infeed} format="rectangle" responsive={true} />
            </div>

            {/* Voting Section */}
            <section id="voting-section" className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Community Vote</h2>
                <p className="text-blue-100 text-lg">Which option do you prefer? Cast your vote!</p>
              </div>

              {!pollVote ? (
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <button
                    onClick={() => handlePollVote("A")}
                    className="group relative overflow-hidden rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 p-8 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <span className="text-2xl font-bold">{comparison.optionA.name}</span>
                      <ThumbsUp className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                  <button
                    onClick={() => handlePollVote("B")}
                    className="group relative overflow-hidden rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 p-8 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <span className="text-2xl font-bold">{comparison.optionB.name}</span>
                      <ThumbsUp className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-6 bg-white/10 rounded-xl p-8 backdrop-blur-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>{comparison.optionA.name}</span>
                      <span>{percentageA}%</span>
                    </div>
                    <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageA}%` }}
                        className={`h-full ${pollVote === "A" ? "bg-green-400" : "bg-white/50"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>{comparison.optionB.name}</span>
                      <span>{percentageB}%</span>
                    </div>
                    <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageB}%` }}
                        className={`h-full ${pollVote === "B" ? "bg-green-400" : "bg-white/50"}`}
                      />
                    </div>
                  </div>

                  <p className="text-center text-blue-100 mt-6 pt-6 border-t border-white/10">
                    You voted for <span className="font-bold">{pollVote === "A" ? comparison.optionA.name : comparison.optionB.name}</span>
                  </p>
                </div>
              )}
            </section>

            {/* Rating Section */}
            <section className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Rate this Comparison</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-4xl font-bold text-orange-500">{averageRating > 0 ? averageRating.toFixed(1) : "0.0"}</span>
                <div className="flex flex-col items-start text-sm text-muted-foreground">
                  <span>/ 5.0</span>
                  <span>{ratingCount} ratings</span>
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= (hoverRating || rating)
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            {comparison.faqs && <FAQAccordion items={comparison.faqs} />}

            {/* Comments Section */}
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Discussion</h2>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-4 mb-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    required
                    className="bg-white dark:bg-gray-950"
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    required
                    className="bg-white dark:bg-gray-950"
                  />
                </div>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                  required
                  className="bg-white dark:bg-gray-950 min-h-[120px]"
                />
                <Button type="submit" className="w-full md:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </Button>
              </form>

              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No comments yet. Be the first to start the discussion!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{comment.name[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{comment.name}</div>
                            <div className="text-xs text-muted-foreground">{comment.date}</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div className="sticky top-24 space-y-8">
              <AdUnit
                slot={adsenseConfig.slots.comparison_sidebar}
                format="rectangle"
                responsive={false}
                style={{ minHeight: "600px" }}
              />

              {/* Related Comparisons Widget */}
              {relatedComparisons.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4">Related Comparisons</h3>
                    <div className="space-y-4">
                      {relatedComparisons.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/comparison/${related.slug}`}
                          className="block group"
                        >
                          <div className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                            {related.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {related.category}
                          </div>
                          <Separator className="mt-3" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>

        {/* Footer Ad */}
        <div className="mt-16">
          <AdUnit slot={adsenseConfig.slots.comparison_footer} format="horizontal" responsive={true} />
        </div>

        {/* Related Comparisons Grid (Mobile/Tablet) */}
        <section className="mt-16 lg:hidden">
          <h2 className="text-2xl font-bold mb-6">Related Comparisons</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {relatedComparisons.map((related) => (
              <Link
                key={related.slug}
                href={`/comparison/${related.slug}`}
                className="block p-6 bg-card border rounded-xl hover:shadow-lg transition-all"
              >
                <h3 className="font-bold mb-2">{related.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {related.description}
                </p>
                <span className="text-xs bg-secondary px-2 py-1 rounded-md">
                  {related.category}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/en">Browse All Comparisons</Link>
          </Button>
        </div>
      </div>

      <MobileStickyAd />
    </PageLayout>
  )
}

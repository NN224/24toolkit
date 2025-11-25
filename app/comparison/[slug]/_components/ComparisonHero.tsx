"use client"

import { motion } from "framer-motion"
import { Calendar, Eye, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Comparison } from "@/lib/comparisons-data"

interface ComparisonHeroProps {
  comparison: Comparison
  viewCount: number
}

export default function ComparisonHero({ comparison, viewCount }: ComparisonHeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            {comparison.category}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {comparison.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {comparison.description}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated {comparison.lastUpdated}</span>
            </div>
          </div>
        </motion.div>

        {/* Verdict Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24 text-yellow-500" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-sm font-semibold mb-4">
                <Trophy className="w-4 h-4" />
                <span>Our Verdict</span>
              </div>
              <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100 italic">
                "{comparison.verdict}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

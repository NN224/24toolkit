"use client"

import { FileText, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface Stats {
  total_comparisons: number
  pending: number
  published: number
  rejected: number
}

interface StatsCardsProps {
  stats: Stats | null
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Comparisons",
      value: stats?.total_comparisons || 0,
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      trend: "+12% this week",
    },
    {
      title: "Pending Reviews",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      trend: "Requires attention",
    },
    {
      title: "Published",
      value: stats?.published || 0,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      trend: "+5% this week",
    },
    {
      title: "Rejected",
      value: stats?.rejected || 0,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      trend: "Low quality content",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className={`relative overflow-hidden rounded-2xl border ${card.border} bg-white/5 backdrop-blur-sm p-6 group`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <card.icon className={`w-24 h-24 ${card.color}`} />
          </div>

          <div className="relative z-10">
            <div className={`inline-flex p-3 rounded-xl ${card.bg} ${card.color} mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>

            <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-bold text-white">{card.value}</span>
              <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                {index !== 1 && <TrendingUp className="w-3 h-3 text-green-500" />}
                {card.trend}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

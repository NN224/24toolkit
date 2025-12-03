import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red'
  isLoading?: boolean
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30'
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/30'
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30'
  },
  amber: {
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  },
  red: {
    gradient: 'from-red-500 to-rose-500',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30'
  }
}

export default function StatCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
  isLoading = false
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 transition-all shadow-lg hover:shadow-purple-500/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-purple-300/70 font-medium mb-2">
            {title}
          </p>
          {isLoading ? (
            <div className="h-8 w-32 bg-purple-500/10 rounded-lg animate-pulse" />
          ) : (
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {value}
            </h3>
          )}
        </div>

        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg shadow-${color}-500/30`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>

      {change && !isLoading && (
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <>
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-sm font-medium text-green-400">{change}</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown size={16} className="text-red-400" />
              <span className="text-sm font-medium text-red-400">{change}</span>
            </>
          )}
          {trend === 'neutral' && (
            <span className="text-sm font-medium text-muted-foreground">{change}</span>
          )}
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </motion.div>
  )
}

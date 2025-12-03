import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/admin/StatCard'
import { Users, DollarSign, Zap, Crown, TrendingUp, Clock } from 'lucide-react'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface DashboardStats {
  totalUsers: number
  activeSubscriptions: number
  aiRequestsToday: number
  revenueThisMonth: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    aiRequestsToday: 0,
    revenueThisMonth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)

      // Get total users count (simplified - you'll need proper implementation)
      const usersRef = collection(db, 'users')
      const usersSnapshot = await getDocs(query(usersRef))
      const totalUsers = usersSnapshot.size

      // Get active subscriptions (example - adjust based on your data structure)
      const subsRef = collection(db, 'subscriptions')
      const activeSubsQuery = query(subsRef, where('status', '==', 'active'))
      const subsSnapshot = await getDocs(activeSubsQuery)
      const activeSubscriptions = subsSnapshot.size

      // Get AI requests today (example)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTimestamp = Timestamp.fromDate(today)
      
      const aiUsageRef = collection(db, 'ai-usage')
      const todayQuery = query(aiUsageRef, where('timestamp', '>=', todayTimestamp))
      const aiSnapshot = await getDocs(todayQuery)
      const aiRequestsToday = aiSnapshot.size

      // Revenue calculation would come from Stripe API
      // This is a placeholder
      const revenueThisMonth = activeSubscriptions * 7.5 // Average

      setStats({
        totalUsers,
        activeSubscriptions,
        aiRequestsToday,
        revenueThisMonth
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12%"
          trend="up"
          icon={Users}
          color="blue"
          isLoading={isLoading}
        />

        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          change="+15%"
          trend="up"
          icon={Crown}
          color="amber"
          isLoading={isLoading}
        />

        <StatCard
          title="AI Requests Today"
          value={stats.aiRequestsToday.toLocaleString()}
          change="+8%"
          trend="up"
          icon={Zap}
          color="purple"
          isLoading={isLoading}
        />

        <StatCard
          title="Revenue (MTD)"
          value={`$${stats.revenueThisMonth.toFixed(2)}`}
          change="+23%"
          trend="up"
          icon={DollarSign}
          color="green"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.a
          href="/admin/users"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group p-6 bg-card/50 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 rounded-2xl transition-all shine-effect"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Users size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors">
              Manage Users
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            View and manage all registered users
          </p>
        </motion.a>

        <motion.a
          href="/admin/ai-analytics"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group p-6 bg-card/50 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 rounded-2xl transition-all shine-effect"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors">
              AI Analytics
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor AI usage and costs
          </p>
        </motion.a>

        <motion.a
          href="/admin/revenue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group p-6 bg-card/50 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 rounded-2xl transition-all shine-effect"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors">
              Revenue
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Track subscriptions and earnings
          </p>
        </motion.a>
      </div>

      {/* Recent Activity */}
      <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock size={24} className="text-purple-400" />
          <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl animate-pulse">
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Activity will appear here as users interact with your platform</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

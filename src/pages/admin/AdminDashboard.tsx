import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/admin/StatCard'
import { Users, DollarSign, Zap, Crown, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Try to load from Firebase, fallback to demo data
      try {
        const { collection, getDocs, query, where, Timestamp } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        // Get total users count
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(query(usersRef))
        const totalUsers = usersSnapshot.size

        // Get active subscriptions
        let activeSubscriptions = 0
        usersSnapshot.docs.forEach(doc => {
          const plan = doc.data().plan
          if (plan === 'pro' || plan === 'unlimited') {
            activeSubscriptions++
          }
        })

        // Get AI requests today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayTimestamp = Timestamp.fromDate(today)
        
        let aiRequestsToday = 0
        try {
          const aiUsageRef = collection(db, 'ai-usage')
          const todayQuery = query(aiUsageRef, where('timestamp', '>=', todayTimestamp))
          const aiSnapshot = await getDocs(todayQuery)
          aiRequestsToday = aiSnapshot.size
        } catch {
          // Collection might not exist yet
        }

        // Calculate estimated revenue
        const revenueThisMonth = (activeSubscriptions * 7.5)

        setStats({
          totalUsers,
          activeSubscriptions,
          aiRequestsToday,
          revenueThisMonth
        })
      } catch (firebaseError) {
        console.warn('Firebase not available, using demo data:', firebaseError)
        // Use demo data if Firebase fails
        setStats({
          totalUsers: 156,
          activeSubscriptions: 23,
          aiRequestsToday: 847,
          revenueThisMonth: 172.50
        })
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
      setError('Failed to load statistics')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/30 to-slate-900/30 backdrop-blur-sm border border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-sky-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-sm sm:text-base text-purple-300/70">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
          title="Active Subs"
          value={stats.activeSubscriptions}
          change="+15%"
          trend="up"
          icon={Crown}
          color="amber"
          isLoading={isLoading}
        />

        <StatCard
          title="AI Today"
          value={stats.aiRequestsToday.toLocaleString()}
          change="+8%"
          trend="up"
          icon={Zap}
          color="purple"
          isLoading={isLoading}
        />

        <StatCard
          title="Revenue"
          value={`$${stats.revenueThisMonth.toFixed(0)}`}
          change="+23%"
          trend="up"
          icon={DollarSign}
          color="green"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link to="/admin/users">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="group p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-blue-500/50 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-blue-500/20"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                <Users size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                Manage Users
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-purple-300/60">
              View and manage all registered users
            </p>
          </motion.div>
        </Link>

        <Link to="/admin/ai-analytics">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="group p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/50 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                <TrendingUp size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                AI Analytics
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-purple-300/60">
              Monitor AI usage and costs
            </p>
          </motion.div>
        </Link>

        <Link to="/admin/revenue">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="group p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-green-500/50 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-green-500/20 sm:col-span-1 col-span-1"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30">
                <DollarSign size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                Revenue
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-purple-300/60">
              Track subscriptions and earnings
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Clock size={20} className="text-purple-400 sm:w-6 sm:h-6" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Recent Activity</h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl animate-pulse">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-2 sm:h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <p className="text-sm sm:text-base">No recent activity to display</p>
              <p className="text-xs sm:text-sm mt-2">Activity will appear here as users interact with your platform</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

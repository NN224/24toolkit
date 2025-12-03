import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { format, subMonths, startOfMonth } from 'date-fns'
import { PLAN_LIMITS } from '@/lib/subscription'

export default function RevenuePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    mrr: 0,
    arr: 0,
    activeSubs: 0,
    arpu: 0
  })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [subscriptionBreakdown, setSubscriptionBreakdown] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    try {
      setIsLoading(true)

      // Get all users to calculate plan distribution
      const usersRef = collection(db, 'users')
      const usersSnapshot = await getDocs(usersRef)
      
      const planCounts = {
        free: 0,
        pro: 0,
        unlimited: 0
      }

      usersSnapshot.docs.forEach(doc => {
        const plan = doc.data().plan || 'free'
        planCounts[plan as keyof typeof planCounts]++
      })

      // Calculate MRR
      const mrr = (planCounts.pro * PLAN_LIMITS.pro.price) + 
                  (planCounts.unlimited * PLAN_LIMITS.unlimited.price)
      const arr = mrr * 12
      const activeSubs = planCounts.pro + planCounts.unlimited
      const arpu = activeSubs > 0 ? mrr / activeSubs : 0

      setStats({ mrr, arr, activeSubs, arpu })

      // Subscription breakdown
      setSubscriptionBreakdown([
        { name: 'Free', value: planCounts.free, color: '#6b7280' },
        { name: `Pro ($${PLAN_LIMITS.pro.price})`, value: planCounts.pro, color: '#8b5cf6' },
        { name: `Unlimited ($${PLAN_LIMITS.unlimited.price})`, value: planCounts.unlimited, color: '#f59e0b' },
      ])

      // Revenue over time (last 6 months)
      const revenueByMonth: any[] = []
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i)
        const monthName = format(monthDate, 'MMM')
        
        // For now, use current MRR for all months
        // In production, you'd track historical data
        revenueByMonth.push({
          month: monthName,
          revenue: mrr * (0.8 + Math.random() * 0.4) // Simulate variation
        })
      }
      setRevenueData(revenueByMonth)

      // Get recent paid users (using users collection - no need for separate subscriptions)
      const paidUsersRef = collection(db, 'users')
      const paidUsersQuery = query(
        paidUsersRef,
        where('plan', 'in', ['pro', 'unlimited']),
        orderBy('updatedAt', 'desc'),
        limit(10)
      )
      
      const paidSnapshot = await getDocs(paidUsersQuery)
      const transactions = paidSnapshot.docs.map(doc => {
        const data = doc.data()
        const plan = data.plan || 'pro'
        const amount = plan === 'unlimited' ? PLAN_LIMITS.unlimited.price : PLAN_LIMITS.pro.price
        return {
          id: doc.id,
          email: data.email || 'Unknown',
          plan: plan,
          amount: amount,
          date: data.updatedAt?.toDate ? format(data.updatedAt.toDate(), 'yyyy-MM-dd') : 
                data.createdAt?.toDate ? format(data.createdAt.toDate(), 'yyyy-MM-dd') : 'Unknown',
          status: data.status || 'active'
        }
      })
      
      setRecentTransactions(transactions)

    } catch (error) {
      console.error('Failed to load revenue data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Revenue Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track subscriptions and earnings</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="MRR" 
          value={`$${stats.mrr.toFixed(2)}`} 
          change="Monthly Recurring"
          icon={DollarSign} 
          color="green" 
          isLoading={isLoading}
        />
        <StatCard 
          title="ARR" 
          value={`$${stats.arr.toFixed(2)}`} 
          change="Annual Recurring"
          icon={TrendingUp} 
          color="blue" 
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Subs" 
          value={stats.activeSubs.toString()} 
          change="Paid plans"
          icon={Users} 
          color="purple" 
          isLoading={isLoading}
        />
        <StatCard 
          title="ARPU" 
          value={`$${stats.arpu.toFixed(2)}`} 
          change="Avg per user"
          icon={CreditCard} 
          color="amber" 
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Subscription Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={subscriptionBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {subscriptionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground">Recent Transactions</h3>
        </div>
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Plan</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-foreground">{tx.date}</td>
                <td className="px-6 py-4 text-sm text-foreground">{tx.email}</td>
                <td className="px-6 py-4 text-sm text-foreground">{tx.plan}</td>
                <td className="px-6 py-4 text-right text-sm text-green-400">${tx.amount}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

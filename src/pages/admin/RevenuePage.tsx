import { motion } from 'framer-motion'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export default function RevenuePage() {
  const revenueData = [
    { month: 'Jan', revenue: 2450 },
    { month: 'Feb', revenue: 3100 },
    { month: 'Mar', revenue: 2800 },
    { month: 'Apr', revenue: 3500 },
    { month: 'May', revenue: 4200 },
  ]

  const subscriptionBreakdown = [
    { name: 'Free', value: 1147, color: '#6b7280' },
    { name: 'Pro ($4.99)', value: 67, color: '#8b5cf6' },
    { name: 'Unlimited ($9.99)', value: 20, color: '#f59e0b' },
  ]

  const recentTransactions = [
    { id: '1', email: 'user1@example.com', plan: 'Pro', amount: 4.99, date: '2024-01-15', status: 'completed' },
    { id: '2', email: 'user2@example.com', plan: 'Unlimited', amount: 9.99, date: '2024-01-14', status: 'completed' },
    { id: '3', email: 'user3@example.com', plan: 'Pro', amount: 4.99, date: '2024-01-13', status: 'completed' },
  ]

  const mrr = 67 * 4.99 + 20 * 9.99
  const arr = mrr * 12

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Revenue Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track subscriptions and earnings</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="MRR" value={`$${mrr.toFixed(2)}`} change="+23%" trend="up" icon={DollarSign} color="green" />
        <StatCard title="ARR" value={`$${arr.toFixed(2)}`} change="+23%" trend="up" icon={TrendingUp} color="blue" />
        <StatCard title="Active Subs" value="87" change="+15%" trend="up" icon={Users} color="purple" />
        <StatCard title="ARPU" value={`$${(mrr / 87).toFixed(2)}`} change="+5%" trend="up" icon={CreditCard} color="amber" />
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

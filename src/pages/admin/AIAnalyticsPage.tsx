import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Brain, Zap, DollarSign, TrendingUp, Clock } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export default function AIAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Mock data
  const usageOverTime = [
    { date: 'Jan 1', requests: 450 },
    { date: 'Jan 8', requests: 680 },
    { date: 'Jan 15', requests: 820 },
    { date: 'Jan 22', requests: 950 },
    { date: 'Jan 29', requests: 1100 },
  ]

  const requestsByTool = [
    { tool: 'Text Rewriter', count: 2340, cost: 45.60 },
    { tool: 'Email Writer', count: 1890, cost: 38.20 },
    { tool: 'Content Generator', count: 1650, cost: 32.40 },
    { tool: 'Code Explainer', count: 980, cost: 19.80 },
    { tool: 'Resume Builder', count: 750, cost: 15.20 },
  ]

  const modelDistribution = [
    { name: 'GPT-4', value: 45, color: '#8b5cf6' },
    { name: 'Claude-3', value: 35, color: '#06b6d4' },
    { name: 'GPT-3.5', value: 20, color: '#10b981' },
  ]

  const topUsers = [
    { email: 'user1@example.com', requests: 450, cost: 9.20 },
    { email: 'user2@example.com', requests: 380, cost: 7.80 },
    { email: 'user3@example.com', requests: 320, cost: 6.50 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Analytics</h1>
          <p className="text-muted-foreground mt-1">Monitor AI usage and costs</p>
        </div>

        <div className="flex items-center gap-2 bg-card border border-white/10 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range === '7d' && 'Last 7 Days'}
              {range === '30d' && 'Last 30 Days'}
              {range === '90d' && 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Requests" value="45,678" change="+12%" trend="up" icon={Zap} color="purple" />
        <StatCard title="AI Cost (MTD)" value="$234.56" change="+8%" trend="up" icon={DollarSign} color="green" />
        <StatCard title="Avg Response Time" value="1.2s" change="-15%" trend="down" icon={Clock} color="blue" />
        <StatCard title="Success Rate" value="98.5%" change="+2%" trend="up" icon={TrendingUp} color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-6">AI Requests Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageOverTime}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="requests" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRequests)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Model Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-6">AI Model Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={modelDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {modelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Requests by Tool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-6">Requests by Tool</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={requestsByTool}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="tool" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground">Top Users by AI Usage</h3>
        </div>
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Requests</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {topUsers.map((user, i) => (
              <tr key={i} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                <td className="px-6 py-4 text-right text-sm text-foreground">{user.requests}</td>
                <td className="px-6 py-4 text-right text-sm text-green-400">\${user.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Brain, Zap, DollarSign, TrendingUp, Clock } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { format, subDays, startOfDay } from 'date-fns'

interface AIUsageData {
  userId: string
  userEmail?: string
  tool: string
  model?: string
  timestamp: any
  cost?: number
  success: boolean
}

export default function AIAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [usageOverTime, setUsageOverTime] = useState<any[]>([])
  const [requestsByTool, setRequestsByTool] = useState<any[]>([])
  const [modelDistribution, setModelDistribution] = useState<any[]>([])
  const [topUsers, setTopUsers] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalCost: 0,
    avgResponseTime: 0,
    successRate: 0
  })

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      
      // Calculate date range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = startOfDay(subDays(new Date(), days))
      const startTimestamp = Timestamp.fromDate(startDate)
      
      // Get AI usage data
      const aiUsageRef = collection(db, 'ai-usage')
      const aiQuery = query(
        aiUsageRef,
        where('timestamp', '>=', startTimestamp),
        orderBy('timestamp', 'desc'),
        limit(1000)
      )
      
      const snapshot = await getDocs(aiQuery)
      const usageData: AIUsageData[] = snapshot.docs.map(doc => ({
        userId: doc.data().userId,
        userEmail: doc.data().userEmail,
        tool: doc.data().tool || 'Unknown',
        model: doc.data().model,
        timestamp: doc.data().timestamp,
        cost: doc.data().cost || 0,
        success: doc.data().success !== false
      }))

      // Calculate stats
      calculateStats(usageData, days)
      
    } catch (error) {
      console.error('Failed to load analytics:', error)
      // Set empty data on error
      setUsageOverTime([])
      setRequestsByTool([])
      setModelDistribution([])
      setTopUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (data: AIUsageData[], days: number) => {
    // Total requests
    const totalRequests = data.length
    
    // Total cost
    const totalCost = data.reduce((sum, item) => sum + (item.cost || 0), 0)
    
    // Success rate
    const successfulRequests = data.filter(item => item.success).length
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
    
    setStats({
      totalRequests,
      totalCost,
      avgResponseTime: 1.2, // Would need actual timing data
      successRate
    })

    // Usage over time
    const dateMap = new Map<string, number>()
    data.forEach(item => {
      if (item.timestamp?.toDate) {
        const date = format(item.timestamp.toDate(), 'MMM dd')
        dateMap.set(date, (dateMap.get(date) || 0) + 1)
      }
    })
    
    const timeData = Array.from(dateMap.entries())
      .map(([date, requests]) => ({ date, requests }))
      .slice(-10)
    setUsageOverTime(timeData.length > 0 ? timeData : [
      { date: format(new Date(), 'MMM dd'), requests: 0 }
    ])

    // Requests by tool
    const toolMap = new Map<string, { count: number, cost: number }>()
    data.forEach(item => {
      const tool = item.tool
      const existing = toolMap.get(tool) || { count: 0, cost: 0 }
      toolMap.set(tool, {
        count: existing.count + 1,
        cost: existing.cost + (item.cost || 0)
      })
    })
    
    const toolData = Array.from(toolMap.entries())
      .map(([tool, stats]) => ({ tool, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    setRequestsByTool(toolData.length > 0 ? toolData : [
      { tool: 'No data', count: 0, cost: 0 }
    ])

    // Model distribution
    const modelMap = new Map<string, number>()
    data.forEach(item => {
      const model = item.model || 'Unknown'
      modelMap.set(model, (modelMap.get(model) || 0) + 1)
    })
    
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    const modelData = Array.from(modelMap.entries())
      .map(([name, value], index) => ({ 
        name, 
        value, 
        color: colors[index % colors.length] 
      }))
    setModelDistribution(modelData.length > 0 ? modelData : [
      { name: 'No data', value: 1, color: '#6b7280' }
    ])

    // Top users
    const userMap = new Map<string, { requests: number, cost: number, email: string }>()
    data.forEach(item => {
      const userId = item.userId
      const email = item.userEmail || 'Unknown'
      const existing = userMap.get(userId) || { requests: 0, cost: 0, email }
      userMap.set(userId, {
        email,
        requests: existing.requests + 1,
        cost: existing.cost + (item.cost || 0)
      })
    })
    
    const userData = Array.from(userMap.values())
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10)
    setTopUsers(userData.length > 0 ? userData : [])
  }

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
        <StatCard 
          title="Total Requests" 
          value={stats.totalRequests.toLocaleString()} 
          change={timeRange} 
          icon={Zap} 
          color="purple" 
          isLoading={isLoading}
        />
        <StatCard 
          title="AI Cost" 
          value={`$${stats.totalCost.toFixed(2)}`} 
          change={timeRange}
          icon={DollarSign} 
          color="green" 
          isLoading={isLoading}
        />
        <StatCard 
          title="Avg Response" 
          value={`${stats.avgResponseTime.toFixed(1)}s`} 
          change="Estimated"
          icon={Clock} 
          color="blue" 
          isLoading={isLoading}
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats.successRate.toFixed(1)}%`} 
          change={timeRange}
          icon={TrendingUp} 
          color="amber" 
          isLoading={isLoading}
        />
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

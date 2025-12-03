import { motion } from 'framer-motion'
import { Activity, Database, Zap, Globe, CheckCircle, AlertCircle } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export default function SystemHealthPage() {
  const apis = [
    { name: 'Firebase', status: 'healthy', uptime: '99.9%', response: '45ms' },
    { name: 'Stripe', status: 'healthy', uptime: '100%', response: '120ms' },
    { name: 'OpenAI', status: 'healthy', uptime: '98.5%', response: '1200ms' },
    { name: 'Vercel', status: 'healthy', uptime: '99.8%', response: '35ms' },
  ]

  const recentErrors = [
    { time: '2024-01-15 10:30', level: 'warning', message: 'High AI usage detected' },
    { time: '2024-01-15 09:15', level: 'error', message: 'Failed to process payment' },
    { time: '2024-01-14 18:45', level: 'info', message: 'Database backup completed' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Health</h1>
        <p className="text-muted-foreground mt-1">Monitor system status and performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Uptime" value="99.9%" change="Last 30 days" icon={Activity} color="green" />
        <StatCard title="Avg Response" value="234ms" change="-12ms" trend="down" icon={Zap} color="blue" />
        <StatCard title="Error Rate" value="0.02%" change="-0.01%" trend="down" icon={AlertCircle} color="amber" />
        <StatCard title="Database Size" value="2.3 GB" change="+120MB" trend="up" icon={Database} color="purple" />
      </div>

      {/* API Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">API Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apis.map((api) => (
            <div key={api.name} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-blue-400" />
                  <h4 className="font-semibold text-foreground">{api.name}</h4>
                </div>
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="text-foreground font-medium">{api.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response:</span>
                  <span className="text-foreground font-medium">{api.response}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Errors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground">Recent Logs</h3>
        </div>
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Level</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentErrors.map((log, i) => (
              <tr key={i} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm text-muted-foreground">{log.time}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    log.level === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    log.level === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

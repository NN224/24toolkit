import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPageAdmin() {
  const [settings, setSettings] = useState({
    siteName: '24Toolkit',
    maintenanceMode: false,
    newSignups: true,
    defaultTheme: 'dark',
    freeDailyLimit: 10,
    proMonthlyLimit: 1000,
    enableAITools: true,
    primaryAIProvider: 'openai',
    proPrice: 4.99,
    unlimitedPrice: 9.99,
    showAnnualPlans: true,
    annualDiscount: 17,
    emailNotifications: true,
    slackAlerts: false,
    alertEmail: 'admin@24toolkit.com'
  })

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your platform</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90 transition-opacity font-medium">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* General */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <SettingsIcon size={20} className="text-purple-400" />
          General
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
            <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-foreground" />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Disable access to the site</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-medium text-foreground">New User Signups</p>
              <p className="text-sm text-muted-foreground">Allow new registrations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.newSignups} onChange={(e) => setSettings({...settings, newSignups: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* AI Limits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">AI Limits</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Free Daily Limit</label>
              <input type="number" value={settings.freeDailyLimit} onChange={(e) => setSettings({...settings, freeDailyLimit: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Pro Monthly Limit</label>
              <input type="number" value={settings.proMonthlyLimit} onChange={(e) => setSettings({...settings, proMonthlyLimit: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-foreground" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Pricing</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Pro Price ($)</label>
              <input type="number" step="0.01" value={settings.proPrice} onChange={(e) => setSettings({...settings, proPrice: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Unlimited Price ($)</label>
              <input type="number" step="0.01" value={settings.unlimitedPrice} onChange={(e) => setSettings({...settings, unlimitedPrice: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-foreground" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

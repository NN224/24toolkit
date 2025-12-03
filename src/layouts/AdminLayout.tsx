import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/Logo'
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  DollarSign, 
  Activity, 
  Settings,
  LogOut,
  RefreshCw,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/ai-analytics', icon: Brain, label: 'AI Analytics' },
  { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
  { to: '/admin/system', icon: Activity, label: 'System' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900/50 backdrop-blur-xl border-r border-purple-500/20 fixed h-full shadow-2xl shadow-purple-500/10">
        {/* Logo */}
        <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/50 to-slate-900/50">
          <div className="flex items-center gap-3 mb-2">
            <Logo className="w-10 h-10" />
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">24Toolkit</h2>
              <span className="text-xs text-purple-300/70">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-sky-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`
                }
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-purple-500/20 bg-gradient-to-t from-slate-950/80 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Admin'}
                className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-lg shadow-purple-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                {user?.displayName?.[0] || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-purple-100 truncate">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-xs text-purple-300/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all border border-red-500/30 text-sm font-medium hover:scale-[1.02]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-sky-400 to-purple-400 bg-clip-text text-transparent hidden lg:block">
                Admin Dashboard
              </h1>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-all border border-purple-500/20 text-sm font-medium text-purple-300"
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <a
                  href="/"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:scale-[1.02] transition-transform text-sm font-medium shadow-lg shadow-purple-500/30"
                >
                  Back to Site
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-64 h-full bg-slate-900/95 backdrop-blur-xl border-r border-purple-500/20 overflow-y-auto"
              >
                {/* Same sidebar content */}
                <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/50 to-slate-900/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Logo className="w-10 h-10" />
                    <div>
                      <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">24Toolkit</h2>
                      <span className="text-xs text-purple-300/70">Admin Panel</span>
                    </div>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-600/20 to-sky-500/20 text-purple-400 border border-purple-500/30'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                          }`
                        }
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    )
                  })}
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-120px)]">
          {children}
        </div>

        {/* Admin Footer */}
        <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-xl mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-purple-300/80 font-medium">
                  © {new Date().getFullYear()} 24Toolkit Admin
                </p>
                <p className="text-xs text-purple-300/50 mt-1">
                  Manage your platform with ease
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href="/docs"
                  className="text-sm text-purple-300/70 hover:text-purple-300 transition-colors"
                >
                  Documentation
                </a>
                <a
                  href="/support"
                  className="text-sm text-purple-300/70 hover:text-purple-300 transition-colors"
                >
                  Support
                </a>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-green-300 font-medium">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

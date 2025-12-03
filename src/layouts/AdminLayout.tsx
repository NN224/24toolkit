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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-white/10 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Logo className="w-10 h-10" />
            <div>
              <h2 className="text-lg font-bold text-foreground">24Toolkit</h2>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
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
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Admin'}
                className="w-10 h-10 rounded-full border-2 border-purple-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 flex items-center justify-center text-white font-bold">
                {user?.displayName?.[0] || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <h1 className="text-xl sm:text-2xl font-bold text-foreground hidden lg:block">
                Admin Dashboard
              </h1>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <a
                  href="/"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90 transition-opacity text-sm font-medium"
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
                className="w-64 h-full bg-card border-r border-white/10 overflow-y-auto"
              >
                {/* Same sidebar content */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Logo className="w-10 h-10" />
                    <div>
                      <h2 className="text-lg font-bold text-foreground">24Toolkit</h2>
                      <span className="text-xs text-muted-foreground">Admin Panel</span>
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
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

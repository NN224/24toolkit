import { useState, useRef, useEffect } from 'react'
import { User, SignOut, CaretDown, Gear } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 flex items-center justify-center">
            <User size={20} weight="bold" className="text-white" />
          </div>
        )}
        
        <span className="hidden md:block text-sm font-medium text-foreground max-w-[150px] truncate">
          {user.displayName || user.email}
        </span>
        
        <CaretDown
          size={16}
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-border">
              <p className="font-medium text-foreground truncate">{user.displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <div className="px-4 py-2 border-t border-white/10">
                <button
                  onClick={() => {
                    navigate('/settings')
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Gear size={18} />
                  <span className="text-sm font-medium">الإعدادات</span>
                </button>
              </div>
              
              <div className="px-4 py-3 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <SignOut size={18} />
                  <span className="text-sm font-medium">تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

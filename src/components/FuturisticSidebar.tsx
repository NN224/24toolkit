import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Brain,
  TextT,
  Code,
  ImageSquare,
  ShieldCheck,
  Sparkle,
  Calculator,
  Gear,
  List,
  X,
  CreditCard
} from '@phosphor-icons/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Logo from '@/components/Logo'
import { useAuth } from '@/contexts/AuthContext'

const categories = [
  { id: 'ai', label: 'AI Tools', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { id: 'text', label: 'Text Tools', icon: TextT, color: 'from-blue-500 to-cyan-500' },
  { id: 'dev', label: 'Dev Tools', icon: Code, color: 'from-green-500 to-emerald-500' },
  { id: 'image', label: 'Image Tools', icon: ImageSquare, color: 'from-orange-500 to-red-500' },
  { id: 'security', label: 'Security', icon: ShieldCheck, color: 'from-violet-500 to-purple-500' },
  { id: 'calc', label: 'Calculators', icon: Calculator, color: 'from-teal-500 to-cyan-500' },
  { id: 'fun', label: 'Fun Tools', icon: Sparkle, color: 'from-pink-500 to-rose-500' }
]

export default function FuturisticSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <TooltipProvider>
      <>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-white/10 transition-all"
          style={{ boxShadow: '0 0 8px rgba(109,40,217,0.3)' }}
        >
          <List size={24} className="text-foreground" />
        </button>

        {isMobileOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <aside
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 bg-[#0a0f1e] border-r border-white/10 overflow-y-auto"
              style={{ boxShadow: 'inset 0 0 6px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)' }}
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg bg-card/50 hover:bg-white/10 transition-colors"
                >
                  <X size={24} className="text-foreground" />
                </button>
              </div>
              <SidebarContent user={user} onNavigate={() => setIsMobileOpen(false)} />
            </aside>
          </>
        )}

        <aside
          className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-20 flex-col bg-[#0a0f1e]/95 backdrop-blur-sm border-r border-white/10"
          style={{ boxShadow: 'inset 0 0 6px rgba(255,255,255,0.05)' }}
        >
          <SidebarContent user={user} showTooltips={true} />
        </aside>
      </>
    </TooltipProvider>
  )
}

interface SidebarContentProps {
  user: any
  showTooltips?: boolean
  onNavigate?: () => void
}

function SidebarContent({ user, showTooltips = false, onNavigate }: SidebarContentProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'

  const handleCategoryClick = (categoryId: string) => {
    if (isHomePage) {
      const element = document.getElementById(categoryId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      navigate(`/#${categoryId}`)
    }
    onNavigate?.()
  }

  const getCategoryActive = (categoryId: string) => {
    if (location.hash) {
      return location.hash === `#${categoryId}`
    }
    return false
  }

  return (
    <div className="flex flex-col h-full p-3 gap-4">
      <Link to="/" onClick={onNavigate} className="flex items-center justify-center group mb-2">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 backdrop-blur-md border border-violet-500/30 hover:border-violet-400/50 hover:scale-105 transition-all overflow-hidden shadow-lg shadow-violet-500/10">
          <Logo 
            width={44} 
            height={44}
            compact={true}
            className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
          />
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = getCategoryActive(category.id)
          
          const button = (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center justify-center p-3 rounded-xl transition-all group relative w-full ${
                isActive 
                  ? 'bg-accent/20 border-2 border-accent/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-2 border-transparent hover:border-white/10'
              }`}
              style={isActive ? { boxShadow: '0 0 8px rgba(109,40,217,0.3)' } : {}}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'bold'} className="text-white" />
              </div>
            </button>
          )

          if (showTooltips) {
            return (
              <Tooltip key={category.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {category.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return button
        })}
      </nav>

      <div className="pt-4 border-t border-white/10 space-y-3">
        {/* Pricing Button */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button 
              onClick={() => { navigate('/pricing'); onNavigate?.() }}
              className={`flex items-center justify-center p-3 rounded-xl transition-all w-full group border-2 ${
                location.pathname === '/pricing'
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent hover:border-white/10'
              }`}
              style={location.pathname === '/pricing' ? { boxShadow: '0 0 8px rgba(109,40,217,0.3)' } : {}}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <CreditCard size={20} weight="bold" className="text-white" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            Pricing
          </TooltipContent>
        </Tooltip>

        {/* Settings Button */}
        {user ? (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button 
                onClick={() => { navigate('/settings'); onNavigate?.() }}
                className={`flex items-center justify-center p-3 rounded-xl transition-all w-full group border-2 ${
                  location.pathname === '/settings'
                    ? 'bg-white/10 border-white/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  <Gear size={20} weight="bold" className="text-white" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Settings
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button 
                onClick={() => { navigate('/sign-in'); onNavigate?.() }}
                className="flex items-center justify-center p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all w-full group border-2 border-transparent hover:border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  <Gear size={20} weight="bold" className="text-white" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Sign In
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

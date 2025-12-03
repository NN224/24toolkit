import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlass, Microphone, User, Moon, Sun, Lightning, SignIn } from '@phosphor-icons/react'
import { searchTools, allTools, type Tool } from '@/lib/tools-data'
import { useTheme } from '@/components/ThemeProvider'
import { toast } from 'sonner'
import { UserMenu } from '@/components/UserMenu'
import { useAuth } from '@/contexts/AuthContext'
import { CreditsBadge } from '@/components/ai/CreditsBadge'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// SpeechRecognition types for cross-browser support
type SpeechRecognitionType = typeof window.SpeechRecognition extends undefined 
  ? typeof window.webkitSpeechRecognition 
  : typeof window.SpeechRecognition

/**
 * Get the SpeechRecognition constructor from the window object.
 * Supports both standard and webkit-prefixed versions.
 */
function getSpeechRecognition(): SpeechRecognitionType | undefined {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

/**
 * Detect if the user is on macOS.
 * Uses navigator.platform (deprecated but widely supported) with userAgent fallback.
 */
function getIsMac(): boolean {
  if (typeof window === 'undefined') return false
  // Modern approach with userAgentData (Chrome 90+)
  const uaData = (navigator as { userAgentData?: { platform?: string } }).userAgentData
  if (uaData?.platform) {
    return uaData.platform.toLowerCase().includes('mac')
  }
  // Fallback to navigator.platform and userAgent
  return /mac/i.test(navigator.platform) || /mac/i.test(navigator.userAgent)
}

export default function FuturisticHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Tool[]>([])
  const [isListening, setIsListening] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  
  // Dynamic tool count and OS-aware keyboard shortcut
  const toolCount = useMemo(() => allTools.length, [])
  const isMac = useMemo(() => getIsMac(), [])
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Listen for login modal open events (from AI tools when credits exhausted)
  // Now redirects to sign-in page instead of showing modal
  useEffect(() => {
    const handleOpenLoginModal = () => {
      const currentPath = window.location.pathname
      navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}&mode=signin`)
    }

    window.addEventListener('open-login-modal', handleOpenLoginModal)
    return () => window.removeEventListener('open-login-modal', handleOpenLoginModal)
  }, [navigate])

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery)
      setSearchResults(results.slice(0, 8))
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSelectTool = (path: string) => {
    navigate(path)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const startVoiceSearch = () => {
    const SpeechRecognitionCtor = getSpeechRecognition()
    
    if (!SpeechRecognitionCtor) {
      toast.error(t('header.voiceNotSupported'))
      return
    }

    try {
      const recognition = new SpeechRecognitionCtor()
      
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
        toast.info(t('header.listening'))
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setSearchOpen(true)
        toast.success(t('header.searchingFor', { query: transcript }))
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false)
        // Provide more helpful error messages based on error type
        const errorMessages: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone not available.',
          'not-allowed': 'Microphone permission denied.',
          'network': 'Network error occurred.',
        }
        toast.error(errorMessages[event.error] || t('header.voiceRecognitionError'))
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (error) {
      toast.error(t('header.voiceSearchFailed'))
      setIsListening(false)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 lg:left-20 bg-[#0a0f1e]/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 max-w-2xl bg-card/50 rounded-xl px-4 py-3 flex items-center gap-3 group transition-all focus:ring-2 focus:ring-accent focus:outline-none border border-white/10"
              style={{ boxShadow: '0 0 8px rgba(109,40,217,0.3)' }}
            >
              <MagnifyingGlass size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1 ltr:text-left rtl:text-right">
                {t('header.searchPlaceholder', { count: toolCount })}
              </span>
              <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold text-muted-foreground bg-white/5 border border-white/10 rounded">
                {shortcutHint}
              </kbd>
            </button>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              <button 
                onClick={startVoiceSearch}
                className={`p-2 rounded-lg bg-card/50 transition-all border border-white/10 ${
                  isListening ? 'animate-pulse' : ''
                }`}
                style={isListening ? { boxShadow: '0 0 8px rgba(109,40,217,0.5)' } : {}}
              >
                <Microphone 
                  size={20} 
                  weight={isListening ? 'fill' : 'regular'}
                  className={isListening ? 'text-accent' : 'text-foreground'} 
                />
              </button>

              <div className="hidden md:flex items-center gap-1 p-1 bg-card/50 rounded-lg border border-white/10">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Moon size={14} weight={theme === 'dark' ? 'fill' : 'regular'} className="inline mr-1" />
                  Dark
                </button>
                <button
                  onClick={() => setTheme('cyber')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    theme === 'cyber' 
                      ? 'bg-gradient-to-r from-green-500 to-pink-500 text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Lightning size={14} weight={theme === 'cyber' ? 'fill' : 'regular'} className="inline mr-1" />
                  Cyber
                </button>
                <button
                  onClick={() => setTheme('minimal')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    theme === 'minimal' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Sun size={14} weight={theme === 'minimal' ? 'fill' : 'regular'} className="inline mr-1" />
                  Minimal
                </button>
              </div>

              {/* AI Credits Badge - shown for logged-in users */}
              {user && <CreditsBadge />}

              {/* User Menu or Sign In */}
              {user ? (
                <UserMenu />
              ) : (
                <button 
                  onClick={() => navigate('/sign-in')}
                  className="group relative flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-sky-500 text-white font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 border border-white/20 min-w-[44px]"
                  style={{ boxShadow: '0 4px 15px rgba(109,40,217,0.4)' }}
                  aria-label={t('header.signIn')}
                >
                  <SignIn size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline text-sm whitespace-nowrap">{t('header.signIn')}</span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-sky-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity pointer-events-none" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setSearchOpen(false)}
          />
          <div
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-accent/30"
              style={{ boxShadow: '0 0 20px rgba(109,40,217,0.4)' }}
            >
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-accent/10 via-transparent to-accent/10">
                <div className="flex items-center gap-3">
                  <MagnifyingGlass size={24} className="text-accent" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('header.searchForTools')}
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground"
                    aria-label={t('header.searchAriaLabel')}
                  />
                  <button 
                    onClick={startVoiceSearch}
                    className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${
                      isListening ? 'text-accent animate-pulse' : 'text-muted-foreground'
                    }`}
                  >
                    <Microphone size={20} weight={isListening ? 'fill' : 'regular'} />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {searchQuery.trim() === '' ? (
                  <>
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      {t('header.quickSearchTips')}
                    </div>
                    <div className="px-3 py-8 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('header.typeToSearch', { count: toolCount })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('header.searchExamples')}
                      </p>
                    </div>
                  </>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      {t('header.foundResults', { count: searchResults.length })}
                    </div>
                    {searchResults.map((tool) => {
                      const Icon = tool.icon
                      return (
                        <SearchResult
                          key={tool.id}
                          title={tool.title}
                          description={tool.description}
                          icon={<Icon size={24} weight="duotone" />}
                          badge={tool.isAI ? 'AI' : undefined}
                          onClick={() => handleSelectTool(tool.path)}
                        />
                      )
                    })}
                  </>
                ) : (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    {t('header.noToolsFound', { query: searchQuery })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function SearchResult({ 
  title, 
  description, 
  icon, 
  badge, 
  onClick 
}: { 
  title: string
  description: string
  icon: React.ReactNode
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-all group"
    >
      <span className="text-foreground/80 group-hover:text-accent transition-colors">{icon}</span>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground group-hover:text-accent transition-colors">
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}

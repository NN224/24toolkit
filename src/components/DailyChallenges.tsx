import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, CheckCircle, Circle, Gift, Sparkle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { allTools } from '@/lib/tools-data'

interface Challenge {
  id: string
  titleKey: string
  descriptionKey: string
  target: number
  type: 'tools_used' | 'ai_tools' | 'specific_category' | 'any_tool'
  category?: string
  rewardKey: string
  icon: any
  color: string
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'use_3_tools',
    titleKey: 'challenges.use3Tools.title',
    descriptionKey: 'challenges.use3Tools.description',
    target: 3,
    type: 'tools_used',
    rewardKey: 'challenges.use3Tools.reward',
    icon: Target,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'use_ai_tool',
    titleKey: 'challenges.useAITool.title',
    descriptionKey: 'challenges.useAITool.description',
    target: 1,
    type: 'ai_tools',
    rewardKey: 'challenges.useAITool.reward',
    icon: Sparkle,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'explore_category',
    titleKey: 'challenges.exploreCategory.title',
    descriptionKey: 'challenges.exploreCategory.description',
    target: 2,
    type: 'specific_category',
    category: 'dev',
    rewardKey: 'challenges.exploreCategory.reward',
    icon: Gift,
    color: 'from-green-500 to-emerald-500'
  }
]

const STORAGE_KEY = 'daily-challenges'

interface ChallengeProgress {
  date: string
  challenges: {
    [id: string]: {
      progress: number
      completed: boolean
      toolsUsed: string[]
    }
  }
}

export function DailyChallenges() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [progress, setProgress] = useState<ChallengeProgress | null>(null)

  // Load or initialize progress
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem(STORAGE_KEY)
    
    if (saved) {
      const parsed = JSON.parse(saved) as ChallengeProgress
      // Reset if it's a new day
      if (parsed.date !== today) {
        initializeProgress(today)
      } else {
        setProgress(parsed)
      }
    } else {
      initializeProgress(today)
    }
  }, [])

  // Listen for tool usage
  useEffect(() => {
    const handleToolUsed = (event: CustomEvent) => {
      const toolId = event.detail.toolName || event.detail.toolId
      updateChallengeProgress(toolId)
    }

    window.addEventListener('tool-used', handleToolUsed as EventListener)
    window.addEventListener('track-tool-usage', handleToolUsed as EventListener)
    
    return () => {
      window.removeEventListener('tool-used', handleToolUsed as EventListener)
      window.removeEventListener('track-tool-usage', handleToolUsed as EventListener)
    }
  }, [progress])

  const initializeProgress = (date: string) => {
    const initial: ChallengeProgress = {
      date,
      challenges: {}
    }
    
    DAILY_CHALLENGES.forEach(challenge => {
      initial.challenges[challenge.id] = {
        progress: 0,
        completed: false,
        toolsUsed: []
      }
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    setProgress(initial)
  }

  const updateChallengeProgress = (toolId: string) => {
    if (!progress) return
    
    const tool = allTools.find(t => t.id === toolId)
    if (!tool) return

    const newProgress = { ...progress }
    
    DAILY_CHALLENGES.forEach(challenge => {
      const cp = newProgress.challenges[challenge.id]
      if (cp.completed || cp.toolsUsed.includes(toolId)) return
      
      let shouldCount = false
      
      switch (challenge.type) {
        case 'tools_used':
          shouldCount = true
          break
        case 'ai_tools':
          shouldCount = tool.isAI || false
          break
        case 'specific_category':
          shouldCount = tool.category === challenge.category
          break
        case 'any_tool':
          shouldCount = true
          break
      }
      
      if (shouldCount) {
        cp.toolsUsed.push(toolId)
        cp.progress = cp.toolsUsed.length
        
        if (cp.progress >= challenge.target) {
          cp.completed = true
        }
      }
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
    setProgress(newProgress)
  }

  const completedCount = progress 
    ? Object.values(progress.challenges).filter(c => c.completed).length 
    : 0

  const suggestTool = (challenge: Challenge) => {
    let tools = allTools
    
    if (challenge.type === 'ai_tools') {
      tools = allTools.filter(t => t.isAI)
    } else if (challenge.type === 'specific_category' && challenge.category) {
      tools = allTools.filter(t => t.category === challenge.category)
    }
    
    const randomTool = tools[Math.floor(Math.random() * tools.length)]
    navigate(randomTool.path)
  }

  if (!progress) return null

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Trophy size={22} weight="fill" className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('challenges.title')}</h3>
            <p className="text-xs text-muted-foreground">{t('challenges.subtitle')}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-foreground">{completedCount}</span>
          <span className="text-muted-foreground">/{DAILY_CHALLENGES.length}</span>
        </div>
      </div>

      {/* Challenges */}
      <div className="space-y-3">
        {DAILY_CHALLENGES.map((challenge, index) => {
          const cp = progress.challenges[challenge.id]
          const Icon = challenge.icon
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border transition-all ${
                cp.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-card/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  cp.completed 
                    ? 'bg-green-500' 
                    : `bg-gradient-to-br ${challenge.color}`
                }`}>
                  {cp.completed ? (
                    <CheckCircle size={22} weight="fill" className="text-white" />
                  ) : (
                    <Icon size={22} weight="fill" className="text-white" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm sm:text-base ${
                    cp.completed ? 'text-green-400' : 'text-foreground'
                  }`}>
                    {t(challenge.titleKey)}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {t(challenge.descriptionKey)}
                  </p>
                </div>
                
                {/* Progress */}
                <div className="text-right flex-shrink-0">
                  {cp.completed ? (
                    <span className="text-green-400 text-sm font-bold">✓ {t('challenges.completed')}</span>
                  ) : (
                    <>
                      <div className="text-sm font-bold text-foreground">
                        {cp.progress}/{challenge.target}
                      </div>
                      <button
                        onClick={() => suggestTool(challenge)}
                        className="text-xs text-accent hover:underline"
                      >
                        {t('challenges.suggest')}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              {!cp.completed && (
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cp.progress / challenge.target) * 100}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${challenge.color}`}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* All completed message */}
      {completedCount === DAILY_CHALLENGES.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center"
        >
          <Trophy size={32} weight="fill" className="text-yellow-500 mx-auto mb-2" />
          <p className="text-foreground font-bold">{t('challenges.allCompleted')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('challenges.comeBackTomorrow')}</p>
        </motion.div>
      )}
    </div>
  )
}

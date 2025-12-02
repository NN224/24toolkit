import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, ArrowClockwise, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function PomodoroTimer() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('pomodoro-timer')
  useSEO(metadata)

  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  const durations = {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0Yc4AAAAAAAAAAAAAAAAAAAAAAA==')
    audio.play().catch(() => {})

    if (mode === 'work') {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)
      
      if (newCount % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(durations.longBreak)
        toast.success(t('tools.pomodoroTimer.longBreakMessage'))
      } else {
        setMode('break')
        setTimeLeft(durations.break)
        toast.success(t('tools.pomodoroTimer.shortBreakMessage'))
      }
    } else {
      setMode('work')
      setTimeLeft(durations.work)
      toast.success(t('tools.pomodoroTimer.breakOverMessage'))
    }
  }

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode])
  }

  const switchMode = (newMode: 'work' | 'break' | 'longBreak') => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(durations[newMode])
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const getModeColor = () => {
    switch(mode) {
      case 'work': return 'from-red-500 to-orange-500'
      case 'break': return 'from-green-500 to-emerald-500'
      case 'longBreak': return 'from-blue-500 to-cyan-500'
    }
  }

  const getModeLabel = () => {
    switch(mode) {
      case 'work': return `🎯 ${t('tools.pomodoroTimer.focusSession')}`
      case 'break': return `☕ ${t('tools.pomodoroTimer.shortBreak')}`
      case 'longBreak': return `🌟 ${t('tools.pomodoroTimer.longBreak')}`
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.pomodoroTimer.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.pomodoroTimer.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card className={`bg-gradient-to-br ${getModeColor()}`}>
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <div className="text-2xl font-semibold text-white">
                  {getModeLabel()}
                </div>

                <motion.div
                  key={`${mode}-${timeLeft}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-9xl font-mono font-bold text-white"
                >
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </motion.div>

                <div className="flex gap-2 justify-center pt-4">
                  {!isRunning ? (
                    <Button onClick={start} size="lg" className="gap-2 bg-white text-foreground hover:bg-white/90">
                      <Play size={24} />
                      {t('tools.pomodoroTimer.start')}
                    </Button>
                  ) : (
                    <Button onClick={pause} size="lg" className="gap-2 bg-white text-foreground hover:bg-white/90">
                      <Pause size={24} />
                      {t('tools.pomodoroTimer.pause')}
                    </Button>
                  )}
                  <Button onClick={reset} size="lg" variant="outline" className="gap-2 bg-white/20 text-white border-white hover:bg-white/30">
                    <ArrowClockwise size={24} />
                    {t('tools.common.reset')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.pomodoroTimer.modeSelection')}</CardTitle>
              <CardDescription>
                {t('tools.pomodoroTimer.modeSelectionDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => switchMode('work')}
                  variant={mode === 'work' ? 'default' : 'outline'}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg">🎯</div>
                    <div className="text-xs">{t('tools.pomodoroTimer.work25m')}</div>
                  </div>
                </Button>

                <Button
                  onClick={() => switchMode('break')}
                  variant={mode === 'break' ? 'default' : 'outline'}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg">☕</div>
                    <div className="text-xs">{t('tools.pomodoroTimer.break5m')}</div>
                  </div>
                </Button>

                <Button
                  onClick={() => switchMode('longBreak')}
                  variant={mode === 'longBreak' ? 'default' : 'outline'}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg">🌟</div>
                    <div className="text-xs">{t('tools.pomodoroTimer.long15m')}</div>
                  </div>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle size={24} className="text-green-600" />
                  <span className="font-semibold">{t('tools.pomodoroTimer.completedToday')}</span>
                </div>
                <span className="text-2xl font-bold text-primary">{completedPomodoros}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

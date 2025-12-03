import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Pause, ArrowClockwise } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function CountdownTimer() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('countdown-timer')
  useSEO({ ...metadata, canonicalPath: '/tools/countdown-timer' })

  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            const audio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0Yc4AAAAAAAAAAAAAAAAAAAAAAA==')
            audio.play().catch(() => {})
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60 + seconds)
    }
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
  }

  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.countdownTimer.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.countdownTimer.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.countdownTimer.timerDisplay')}</CardTitle>
              <CardDescription>
                {t('tools.countdownTimer.timeRemaining')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-8xl font-mono font-bold text-primary">
                  {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                {!isRunning ? (
                  <Button onClick={startTimer} size="lg" className="gap-2">
                    <Play size={24} />
                    {t('tools.countdownTimer.start')}
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} size="lg" className="gap-2" variant="secondary">
                    <Pause size={24} />
                    {t('tools.countdownTimer.pause')}
                  </Button>
                )}
                <Button onClick={resetTimer} size="lg" variant="outline" className="gap-2">
                  <ArrowClockwise size={24} />
                  {t('tools.common.reset')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {!isRunning && timeLeft === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.countdownTimer.setTimer')}</CardTitle>
                <CardDescription>
                  {t('tools.countdownTimer.configureDuration')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minutes">{t('tools.countdownTimer.minutes')}</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min={0}
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seconds">{t('tools.countdownTimer.seconds')}</Label>
                    <Input
                      id="seconds"
                      type="number"
                      min={0}
                      max={59}
                      value={seconds}
                      onChange={(e) => setSeconds(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => { setMinutes(1); setSeconds(0) }} variant="outline" className="flex-1">
                    {t('tools.countdownTimer.oneMin')}
                  </Button>
                  <Button onClick={() => { setMinutes(5); setSeconds(0) }} variant="outline" className="flex-1">
                    {t('tools.countdownTimer.fiveMin')}
                  </Button>
                  <Button onClick={() => { setMinutes(10); setSeconds(0) }} variant="outline" className="flex-1">
                    {t('tools.countdownTimer.tenMin')}
                  </Button>
                  <Button onClick={() => { setMinutes(25); setSeconds(0) }} variant="outline" className="flex-1">
                    {t('tools.countdownTimer.twentyFiveMin')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="countdown-timer" category="fun" />
    </div>
  )
}

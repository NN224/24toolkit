import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, ArrowClockwise } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function Stopwatch() {
  // Set SEO metadata
  const metadata = getPageMetadata('stopwatch')
  useSEO(metadata)

  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)

    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(milliseconds).padStart(2, '0')
    }
  }

  const { minutes, seconds, milliseconds } = formatTime(time)

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Stopwatch
          </h1>
          <p className="text-lg text-muted-foreground">
            Precise stopwatch for timing activities, workouts, or tasks.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Time Elapsed</CardTitle>
            <CardDescription>
              Minutes : Seconds : Milliseconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-7xl md:text-8xl font-mono font-bold text-primary">
                {minutes}:{seconds}
                <span className="text-5xl md:text-6xl text-muted-foreground">.{milliseconds}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              {!isRunning ? (
                <Button onClick={start} size="lg" className="gap-2 px-8">
                  <Play size={24} />
                  Start
                </Button>
              ) : (
                <Button onClick={pause} size="lg" className="gap-2 px-8" variant="secondary">
                  <Pause size={24} />
                  Pause
                </Button>
              )}
              <Button onClick={reset} size="lg" variant="outline" className="gap-2 px-8">
                <ArrowClockwise size={24} />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

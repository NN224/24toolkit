import { useEffect, useState } from 'react'

export type MoodMode = 'morning' | 'day' | 'evening' | 'night'

export function useMoodMode() {
  const [moodMode, setMoodMode] = useState<MoodMode>('night')

  useEffect(() => {
    const updateMood = () => {
      const hour = new Date().getHours()
      
      if (hour >= 5 && hour < 12) {
        setMoodMode('morning')
      } else if (hour >= 12 && hour < 17) {
        setMoodMode('day')
      } else if (hour >= 17 && hour < 21) {
        setMoodMode('evening')
      } else {
        setMoodMode('night')
      }
    }

    updateMood()
    const interval = setInterval(updateMood, 60000)

    return () => clearInterval(interval)
  }, [])

  return moodMode
}

export function getMoodGradient(mood: MoodMode): string {
  switch (mood) {
    case 'morning':
      return 'from-sky-400 via-blue-400 to-cyan-400'
    case 'day':
      return 'from-pink-400 via-rose-400 to-violet-500'
    case 'evening':
      return 'from-orange-400 via-pink-500 to-rose-500'
    case 'night':
    default:
      return 'from-purple-600 via-violet-500 to-sky-500'
  }
}

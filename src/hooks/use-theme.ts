import { useState, useEffect } from 'react'

export type Theme = 'dark' | 'cyber' | 'minimal'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('24toolkit-theme') as Theme
      return stored || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'cyber', 'minimal')
    root.classList.add(theme)
    localStorage.setItem('24toolkit-theme', theme)
  }, [theme])

  return { theme, setTheme }
}

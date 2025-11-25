"use client"

import { useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Get stored theme preference
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      setTheme(stored)
    }

    // Get system preference
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    setResolvedTheme(stored === "system" || !stored ? systemPreference : (stored as "light" | "dark"))
  }, [])

  useEffect(() => {
    const root = document.documentElement

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light"
        setResolvedTheme(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    root.style.colorScheme = newTheme
  }

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setResolvedTheme(systemPreference)
      applyTheme(systemPreference)
    } else {
      setResolvedTheme(newTheme)
      applyTheme(newTheme)
    }
  }

  // Apply theme on mount
  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  return {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
  }
}

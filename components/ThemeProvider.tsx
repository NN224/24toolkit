"use client"

import type React from "react"

import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on mount
    const stored = localStorage.getItem("theme")
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const theme = stored === "system" || !stored ? systemPreference : stored

    document.documentElement.classList.add(theme)
    document.documentElement.style.colorScheme = theme
  }, [])

  return <>{children}</>
}

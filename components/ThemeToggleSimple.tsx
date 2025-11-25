"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "@/lib/hooks/use-theme"

export function ThemeToggleSimple() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".theme-toggle-wrapper")) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isOpen])

  const getIcon = () => {
    if (resolvedTheme === "dark") {
      return "🌙"
    }
    return "☀️"
  }

  return (
    <div className="theme-toggle-wrapper" style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "0.5rem",
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1.2rem",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-secondary)"
          e.currentTarget.style.borderColor = "var(--text)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent"
          e.currentTarget.style.borderColor = "var(--border)"
        }}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
      >
        {getIcon()}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            background: "var(--bg-primary)",
            border: "2px solid var(--border)",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            padding: "0.5rem",
            minWidth: "150px",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-in",
          }}
        >
          <button
            onClick={() => {
              setTheme("light")
              setIsOpen(false)
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: theme === "light" ? "var(--bg-secondary)" : "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "0.9rem",
              fontWeight: theme === "light" ? 600 : 500,
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (theme !== "light") {
                e.currentTarget.style.background = "var(--bg-secondary)"
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== "light") {
                e.currentTarget.style.background = "transparent"
              }
            }}
            aria-label="Switch to light theme"
          >
            <span>☀️</span>
            <span>Light</span>
            {theme === "light" && <span style={{ marginLeft: "auto" }}>✓</span>}
          </button>

          <button
            onClick={() => {
              setTheme("dark")
              setIsOpen(false)
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: theme === "dark" ? "var(--bg-secondary)" : "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "0.9rem",
              fontWeight: theme === "dark" ? 600 : 500,
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (theme !== "dark") {
                e.currentTarget.style.background = "var(--bg-secondary)"
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== "dark") {
                e.currentTarget.style.background = "transparent"
              }
            }}
            aria-label="Switch to dark theme"
          >
            <span>🌙</span>
            <span>Dark</span>
            {theme === "dark" && <span style={{ marginLeft: "auto" }}>✓</span>}
          </button>

          <button
            onClick={() => {
              setTheme("system")
              setIsOpen(false)
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: theme === "system" ? "var(--bg-secondary)" : "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "0.9rem",
              fontWeight: theme === "system" ? 600 : 500,
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (theme !== "system") {
                e.currentTarget.style.background = "var(--bg-secondary)"
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== "system") {
                e.currentTarget.style.background = "transparent"
              }
            }}
            aria-label="Use system theme"
          >
            <span>💻</span>
            <span>System</span>
            {theme === "system" && <span style={{ marginLeft: "auto" }}>✓</span>}
          </button>
        </div>
      )}
    </div>
  )
}


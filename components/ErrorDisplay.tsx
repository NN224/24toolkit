"use client"

import React from "react"
import Link from "next/link"

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  showRetry?: boolean
  showHome?: boolean
  icon?: React.ReactNode
  variant?: "error" | "warning" | "info"
}

export default function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry,
  showRetry = true,
  showHome = true,
  icon,
  variant = "error",
}: ErrorDisplayProps) {
  const colors = {
    error: {
      bg: "linear-gradient(135deg, #fee 0%, #fdd 100%)",
      border: "#f44336",
      text: "#c62828",
      icon: "❌",
      button: "#f44336",
    },
    warning: {
      bg: "linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)",
      border: "#ff9800",
      text: "#e65100",
      icon: "⚠️",
      button: "#ff9800",
    },
    info: {
      bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      border: "#2196F3",
      text: "#1565c0",
      icon: "ℹ️",
      button: "#2196F3",
    },
  }

  const color = colors[variant]

  return (
    <div
      style={{
        padding: "3rem 2rem",
        margin: "2rem auto",
        maxWidth: "600px",
        background: color.bg,
        border: `3px solid ${color.border}`,
        borderRadius: "20px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
        textAlign: "center",
        animation: "fadeIn 0.5s ease-in",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "4rem",
          marginBottom: "1.5rem",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
        }}
      >
        {icon || color.icon}
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          marginBottom: "1rem",
          color: color.text,
        }}
      >
        {title}
      </h2>

      {/* Message */}
      <p
        style={{
          fontSize: "1.1rem",
          lineHeight: 1.7,
          color: color.text,
          opacity: 0.9,
          marginBottom: "2rem",
        }}
      >
        {message}
      </p>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: "0.875rem 2rem",
              background: color.button,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "all 0.2s ease",
              boxShadow: `0 4px 12px ${color.button}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = `0 6px 16px ${color.button}60`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = `0 4px 12px ${color.button}40`
            }}
          >
            🔄 Try Again
          </button>
        )}

        {showHome && (
          <Link
            href="/"
            style={{
              padding: "0.875rem 2rem",
              background: "transparent",
              color: color.text,
              border: `2px solid ${color.border}`,
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1rem",
              display: "inline-block",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = color.border
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = color.text
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            🏠 Go Home
          </Link>
        )}
      </div>
    </div>
  )
}


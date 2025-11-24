"use client"

import React from "react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  variant?: "default" | "gradient" | "pulse"
}

export default function LoadingSpinner({ size = "md", text, variant = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  const borderSize = {
    sm: "border-2",
    md: "border-3",
    lg: "border-4",
    xl: "border-4",
  }

  if (variant === "pulse") {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            width: size === "sm" ? "32px" : size === "md" ? "48px" : size === "lg" ? "64px" : "80px",
            height: size === "sm" ? "32px" : size === "md" ? "48px" : size === "lg" ? "64px" : "80px",
            margin: "0 auto 1rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            animation: "pulse 1.5s ease-in-out infinite",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
          }}
        />
        {text && (
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: "1rem" }}>
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            width: size === "sm" ? "32px" : size === "md" ? "48px" : size === "lg" ? "64px" : "80px",
            height: size === "sm" ? "32px" : size === "md" ? "48px" : size === "lg" ? "64px" : "80px",
            margin: "0 auto",
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #667eea)",
            padding: "4px",
            animation: "spin 1s linear infinite",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "var(--bg-primary)",
            }}
          />
        </div>
        {text && (
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: "1rem" }}>
            {text}
          </p>
        )}
      </div>
    )
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div
        style={{
          width: size === "sm" ? "32px" : size === "md" ? "48px" : size === "lg" ? "64px" : "80px",
          height: size === "sm" ? "32px" : size === "md" ? "48px" : size === "lg" ? "64px" : "80px",
          border: `${size === "sm" ? "3px" : size === "md" ? "4px" : "5px"} solid var(--border)`,
          borderTop: `${size === "sm" ? "3px" : size === "md" ? "4px" : "5px"} solid var(--text)`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto",
        }}
      />
      {text && (
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: "1rem" }}>
          {text}
        </p>
      )}
    </div>
  )
}


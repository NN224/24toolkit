"use client"

import React from "react"
import Link from "next/link"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "600px", width: "100%" }}>
            {/* Enhanced Error Display */}
            <div
              style={{
                padding: "3rem 2rem",
                background: "linear-gradient(135deg, #fee 0%, #fdd 100%)",
                border: "3px solid #f44336",
                borderRadius: "20px",
                boxShadow: "0 12px 32px rgba(244, 67, 54, 0.2)",
                animation: "fadeIn 0.5s ease-in",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: "5rem",
                  marginBottom: "1.5rem",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                ⚠️
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  marginBottom: "1rem",
                  color: "#c62828",
                }}
              >
                Something went wrong
              </h1>

              {/* Message */}
              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  color: "#c62828",
                  opacity: 0.9,
                  marginBottom: "2rem",
                }}
              >
                We're sorry, but something unexpected happened. Please try refreshing the page or go back home.
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
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "0.875rem 2rem",
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(244, 67, 54, 0.6)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(244, 67, 54, 0.4)"
                  }}
                >
                  🔄 Refresh Page
                </button>
                <Link
                  href="/"
                  style={{
                    padding: "0.875rem 2rem",
                    background: "transparent",
                    color: "#c62828",
                    border: "2px solid #f44336",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    display: "inline-block",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f44336"
                    e.currentTarget.style.color = "#fff"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "#c62828"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  🏠 Go Home
                </Link>
              </div>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details
                style={{
                  marginTop: "2rem",
                  textAlign: "left",
                  background: "#f5f5f5",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "2px solid #e0e0e0",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#333",
                    marginBottom: "1rem",
                  }}
                >
                  🔍 Error Details (Development)
                </summary>
                <pre
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "#fff",
                    borderRadius: "8px",
                    overflow: "auto",
                    fontSize: "0.875rem",
                    border: "1px solid #e0e0e0",
                    maxHeight: "300px",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n\nStack:\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

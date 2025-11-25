"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

interface PendingBannerProps {
  product1: string
  product2: string
  submittedAt?: string
  email?: string
  onEmailSubmit?: (email: string) => void
  comparisonSlug?: string | null
  comparisonUrl?: string
}

export default function PendingBanner({
  product1,
  product2,
  submittedAt,
  email,
  onEmailSubmit,
  comparisonSlug,
  comparisonUrl,
}: PendingBannerProps) {
  const [notifyEmail, setNotifyEmail] = useState(email || "")
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifyEmail.trim()) return

    setIsSubmitting(true)

    // Call the parent callback if provided
    if (onEmailSubmit) {
      onEmailSubmit(notifyEmail)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setEmailSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2.5rem",
        background: "linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)",
        border: "3px solid #4CAF50",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(76, 175, 80, 0.2)",
        animation: "slideIn 0.5s ease-out",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⏳</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem", color: "#2e7d32" }}>
          Comparison Under Review
        </h2>
      </div>

      {/* Success Message */}
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "2px solid #4CAF50",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.5rem" }}>✅</span>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
            Your comparison has been generated successfully!
          </p>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📋</span>
            <strong>Comparison:</strong>
          </div>
          <p style={{ fontSize: "1.1rem", margin: "0 0 0 2rem", color: "#1976d2", fontWeight: 600 }}>
            {product1} vs {product2}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🔍</span>
          <strong>Status:</strong>
          <span
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "0.25rem 0.75rem",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Under Review
          </span>
        </div>
      </div>

      {/* Information */}
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "2px solid #e0e0e0",
        }}
      >
        <p style={{ fontSize: "1rem", lineHeight: 1.6, marginBottom: "1rem", color: "#424242" }}>
          Our team is reviewing this comparison to ensure quality and accuracy before publishing.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#1976d2" }}>
          <span style={{ fontSize: "1.2rem" }}>⏰</span>
          <strong>Estimated time:</strong>
          <span>24-48 hours</span>
        </div>
      </div>

      {/* Email Notification */}
      {!emailSubmitted ? (
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "2px solid #e0e0e0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📧</span>
            <p style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Get notified when approved:</p>
          </div>
          <form onSubmit={handleEmailSubmit} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="email@example.com"
              required
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4CAF50"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0"
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = "#45a049"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#4CAF50"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              {isSubmitting ? "Submitting..." : "Notify Me"}
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            background: "#d4edda",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "2px solid #4CAF50",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>✅</span>
          <strong style={{ color: "#155724" }}>Email notification set! We'll notify you when it's approved.</strong>
        </div>
      )}

      {/* View Comparison Link */}
      {comparisonSlug && comparisonUrl && (
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "2px solid #1976d2",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>🔗</span>
            <strong style={{ color: "#1976d2" }}>Preview Your Comparison:</strong>
          </div>
          <Link
            href={comparisonUrl}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1565c0"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1976d2"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            View Comparison Page →
          </Link>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.75rem", marginBottom: 0 }}>
            You can view your comparison now, but it will be marked as "Under Review" until approved.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/en"
          style={{
            flex: "1",
            minWidth: "180px",
            padding: "1rem",
            background: "#fff",
            color: "#000",
            border: "2px solid #000",
            borderRadius: "8px",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#000"
            e.currentTarget.style.color = "#fff"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff"
            e.currentTarget.style.color = "#000"
          }}
        >
          Browse Other Comparisons
        </Link>
        <button
          onClick={() => window.location.reload()}
          style={{
            flex: "1",
            minWidth: "180px",
            padding: "1rem",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#45a049"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#4CAF50"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          Generate Another
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

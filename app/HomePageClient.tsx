"use client"

import type React from "react"

import { useState, useRef } from "react"
import PageLayout from "@/components/page-layout"
import Link from "next/link"
import PendingBanner from "@/components/PendingBanner"
import ComparisonLoadingSkeleton from "@/components/ComparisonLoadingSkeleton"
import ErrorDisplay from "@/components/ErrorDisplay"
import SuccessAnimation from "@/components/SuccessAnimation"
import { useKeyboardNavigation } from "@/lib/hooks/use-keyboard-navigation"

export default function HomePageClient() {
  const [productA, setProductA] = useState("")
  const [productB, setProductB] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isPending, setIsPending] = useState(false)
  const [comparisonSlug, setComparisonSlug] = useState<string | null>(null)
  const [comparisonStatus, setComparisonStatus] = useState<"pending" | "approved" | "generated" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)

  useKeyboardNavigation(formRef, {
    onEscape: () => {
      if (!loading) {
        setProductA("")
        setProductB("")
        setResult(null)
        setIsPending(false)
        setComparisonSlug(null)
        setComparisonStatus(null)
        setError(null)
        setShowSuccess(false)
      }
    },
  })

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productA.trim() || !productB.trim()) {
      setError("Please enter both products to compare")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setIsPending(false)

    try {
      if (process.env.NODE_ENV === "development") {
      console.log("[v0] Sending comparison request:", { productA, productB })
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product1: productA.trim(),
          product2: productB.trim(),
        }),
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // Response is not JSON (likely an error page)
        const text = await response.text()
        console.error("[v0] Non-JSON response:", text)
        throw new Error("Server returned an invalid response. Please check if the API key is configured.")
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      if (data.success && data.data) {
        // Debug logging only in development
        if (process.env.NODE_ENV === "development") {
          console.log("[v0] Comparison generated successfully")
        }
        
        // Set comparison status and slug
        setComparisonStatus(data.status || "generated")
        setComparisonSlug(data.slug || null)
        
        // Always show result immediately, regardless of status
        // If already approved, still show result but can redirect
        if (data.status === "approved" && data.slug) {
          // Show result briefly then redirect
        setResult({
          productA: data.data.optionA.name,
          productB: data.data.optionB.name,
          summary: data.data.summary,
          scoreA: data.data.product_a_score || 85,
          scoreB: data.data.product_b_score || 80,
          strengthsA: data.data.product_a_strengths || [],
          strengthsB: data.data.product_b_strengths || [],
          weaknessesA: data.data.product_a_weaknesses || [],
          weaknessesB: data.data.product_b_weaknesses || [],
          recommendation: data.data.recommendation || "",
            isPending: data.isPending || false,
            slug: data.slug,
            comparisonUrl: data.comparisonUrl,
          })
          // Redirect after showing result
          setTimeout(() => {
            window.location.href = data.comparisonUrl || `/comparison/${data.slug}`
          }, 2000)
          return
        }
        
        // Show result immediately (pending or generated)
        setIsPending(false) // Don't show PendingBanner, show result instead
        setResult({
          productA: data.data.optionA.name,
          productB: data.data.optionB.name,
          summary: data.data.summary,
          scoreA: data.data.product_a_score || 85,
          scoreB: data.data.product_b_score || 80,
          strengthsA: data.data.product_a_strengths || [],
          strengthsB: data.data.product_b_strengths || [],
          weaknessesA: data.data.product_a_weaknesses || [],
          weaknessesB: data.data.product_b_weaknesses || [],
          recommendation: data.data.recommendation || "",
          isPending: data.isPending || false,
          slug: data.slug,
          comparisonUrl: data.comparisonUrl,
        })
        
        // Show success animation
        setShowSuccess(true)
      } else {
        throw new Error(data.error || "Failed to generate comparison")
      }
    } catch (error) {
      console.error("[v0] Error generating comparison:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate comparison. Please try again."
      
      // Determine error type
      let variant: "error" | "warning" | "info" = "error"
      if (errorMessage.includes("rate limit") || errorMessage.includes("Rate limit")) {
        variant = "warning"
      } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
        variant = "info"
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    if (productA.trim() && productB.trim()) {
      handleCompare(new Event("submit") as any)
    }
  }

  const handleSwap = () => {
    const temp = productA
    setProductA(productB)
    setProductB(temp)
  }

  const handleShareKeyDown = (e: React.KeyboardEvent, platform: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleShare(platform)
    }
  }

  const handleShare = (platform: string) => {
    const text = `Check out this comparison: ${result.productA} vs ${result.productB}`
    // Use comparison URL if available, otherwise use current page
    const url = result.comparisonUrl 
      ? `${window.location.origin}${result.comparisonUrl}`
      : window.location.href

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank")
        break
      case "reddit":
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
          "_blank",
        )
        break
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank")
        break
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
        break
      case "copy":
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
        break
    }
  }

  const handleEmailNotification = (email: string) => {
    // Email notification feature - store email in database for future notifications
    // This can be implemented by creating an API endpoint to store notification preferences
    // Debug logging only in development
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] Email notification requested:", email)
    }
  }

  return (
    <PageLayout currentPath="/">
      {/* Success Animation */}
      <SuccessAnimation
        show={showSuccess}
        onComplete={() => setShowSuccess(false)}
        message="Comparison Generated Successfully!"
      />
      <section className="hero-section" style={{ padding: "60px 0 40px", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: "1.5rem", lineHeight: 1.2 }}>
            Compare <span style={{ color: "var(--primary-color, #000)" }}>Everything</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", marginBottom: "2.5rem", opacity: 0.8 }}>
            70+ Detailed Comparisons in English & Arabic
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "3rem",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: 0.7,
            }}
          >
            Make informed decisions faster with comprehensive, unbiased comparisons across technology, lifestyle,
            services, and more.
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 0 60px" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", textAlign: "center", marginBottom: "2rem", fontWeight: 700 }}>
            🤖 AI Battle - Compare Anything
          </h2>
          <form ref={formRef} onSubmit={handleCompare} aria-label="Product comparison form">
            <div
              className="compare-form-grid grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center mb-8"
            >
              <div>
                <label
                  htmlFor="productA"
                  style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Product A
                </label>
                <input
                  type="text"
                  id="productA"
                  value={productA}
                  onChange={(e) => setProductA(e.target.value)}
                  placeholder="e.g., iPhone 15 Pro"
                  aria-label="First product to compare"
                  aria-required="true"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1rem",
                    border: "2px solid var(--border)",
                    background: "var(--bg-primary)",
                    borderRadius: "8px",
                  }}
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={handleSwap}
                className="swap-button"
                aria-label="Swap products (Alt + W)"
                title="Swap products (Alt + W)"
                onKeyDown={(e) => {
                  if (e.altKey && e.key === "w") {
                    e.preventDefault()
                    handleSwap()
                  }
                }}
                style={{
                  padding: "0.75rem",
                  background: "var(--bg-secondary)",
                  border: "2px solid var(--border)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  marginTop: "2rem",
                  borderRadius: "8px",
                  minWidth: "48px",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={loading}
              >
                ⇄
              </button>

              <div>
                <label
                  htmlFor="productB"
                  style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Product B
                </label>
                <input
                  type="text"
                  id="productB"
                  value={productB}
                  onChange={(e) => setProductB(e.target.value)}
                  placeholder="e.g., Samsung Galaxy S24 Ultra"
                  aria-label="Second product to compare"
                  aria-required="true"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1rem",
                    border: "2px solid var(--border)",
                    background: "var(--bg-primary)",
                    borderRadius: "8px",
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                className="cta-button"
                disabled={loading}
                aria-label="Compare products (Enter)"
                style={{
                  padding: "1rem 3rem",
                  fontSize: "1.1rem",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  background: "#000",
                  color: "#fff",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  fontWeight: 700,
                }}
              >
                {loading ? "Generating Comparison..." : "Compare with AI"}
              </button>
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", opacity: 0.6 }}>
                Press Enter to compare • Press Escape to clear
              </p>
            </div>
          </form>

          {loading && (
            <div style={{ marginTop: "2rem" }}>
              {/* Enhanced Loading State */}
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                  borderRadius: "20px",
                  border: "2px solid #e9ecef",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* Animated Spinner */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 2rem",
                    position: "relative",
                  }}
                >
                  {/* Outer rotating ring */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
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
                        background: "#ffffff",
                      }}
                    />
            </div>
                  {/* Inner pulsing dot */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      animation: "pulse 1.5s ease-in-out infinite",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.5)",
                    }}
                  />
                </div>

                {/* Loading Text */}
                <div>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "#333",
                      marginBottom: "0.5rem",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    AI is analyzing your comparison...
                  </p>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", opacity: 0.8 }}>
                    This may take a few moments
                  </p>
                </div>

                {/* Progress Dots */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    marginTop: "1.5rem",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        animation: `bounce 1.4s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Skeleton Preview */}
              <ComparisonLoadingSkeleton />
            </div>
          )}

          {/* Error Display */}
          {error && !loading && (
            <ErrorDisplay
              title={error.includes("rate limit") ? "Rate Limit Exceeded" : "Error Generating Comparison"}
              message={error}
              onRetry={handleRetry}
              showRetry={true}
              showHome={false}
              variant={error.includes("rate limit") ? "warning" : error.includes("network") ? "info" : "error"}
            />
          )}

          {result && !loading && !error && (
            <div style={{ marginTop: "3rem", animation: "fadeIn 0.5s ease-in" }}>
              <div
                style={{
                  padding: "2.5rem",
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  border: "3px solid var(--border)",
                  marginBottom: "2rem",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "2.2rem", marginBottom: "0.5rem", fontWeight: 800 }}>
                    {result.productA} vs {result.productB}
                  </h2>
                  <p style={{ fontSize: "1.1rem", opacity: 0.7 }}>AI-Powered Comparison Results</p>
                  {result.comparisonUrl && (
                    <Link
                      href={result.comparisonUrl}
                      style={{
                        display: "inline-block",
                        marginTop: "1rem",
                        padding: "0.75rem 1.5rem",
                        background: "#000",
                        color: "#fff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#333"
                        e.currentTarget.style.transform = "translateY(-2px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#000"
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      عرض الصفحة الكاملة →
                    </Link>
                  )}
                </div>

                {/* Score Comparison - Enhanced Design */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    gap: "2.5rem",
                    alignItems: "center",
                    marginBottom: "2.5rem",
                    padding: "2rem",
                    background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                    borderRadius: "20px",
                    border: "2px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1.5rem",
                      background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
                      borderRadius: "16px",
                      border: `3px solid ${result.scoreA >= (result.scoreB || 80) ? "#4CAF50" : "#e0e0e0"}`,
                      boxShadow: result.scoreA >= (result.scoreB || 80) ? "0 8px 24px rgba(76, 175, 80, 0.2)" : "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "4rem",
                        fontWeight: 900,
                        marginBottom: "0.5rem",
                        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {result.scoreA || 85}
                      {result.scoreA >= (result.scoreB || 80) && (
                        <span
                          style={{
                            fontSize: "2.5rem",
                            marginLeft: "0.5rem",
                            filter: "drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))",
                          }}
                        >
                          👑
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        height: "16px",
                        background: "#e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "1rem",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${result.scoreA || 85}%`,
                          background: "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)",
                          transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 8px rgba(76, 175, 80, 0.4)",
                        }}
                      />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "1.2rem", color: "#333" }}>{result.productA}</p>
                  </div>

                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      opacity: 0.4,
                      color: "#666",
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    VS
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      padding: "1.5rem",
                      background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
                      borderRadius: "16px",
                      border: `3px solid ${result.scoreB > (result.scoreA || 85) ? "#2196F3" : "#e0e0e0"}`,
                      boxShadow: result.scoreB > (result.scoreA || 85) ? "0 8px 24px rgba(33, 150, 243, 0.2)" : "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "4rem",
                        fontWeight: 900,
                        marginBottom: "0.5rem",
                        background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {result.scoreB || 80}
                      {result.scoreB > (result.scoreA || 85) && (
                        <span
                          style={{
                            fontSize: "2.5rem",
                            marginLeft: "0.5rem",
                            filter: "drop-shadow(0 2px 4px rgba(33, 150, 243, 0.3))",
                          }}
                        >
                          👑
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        height: "16px",
                        background: "#e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "1rem",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${result.scoreB || 80}%`,
                          background: "linear-gradient(90deg, #2196F3 0%, #1976D2 100%)",
                          transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 8px rgba(33, 150, 243, 0.4)",
                        }}
                      />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "1.2rem", color: "#333" }}>{result.productB}</p>
                  </div>
                </div>

                <div
                  style={{
                    padding: "2rem",
                    background: "linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)",
                    borderRadius: "12px",
                    border: "2px solid #ffc107",
                    marginTop: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.15rem",
                      lineHeight: 1.9,
                      color: "#333",
                      textAlign: "center",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                  {result.summary}
                </p>
                </div>
              </div>

              <div
                style={{
                  padding: "2.5rem",
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "2px solid #e9ecef",
                  marginBottom: "2rem",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.75rem",
                    marginBottom: "2rem",
                    textAlign: "center",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ⚡ Quick Comparison
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1.5rem",
                      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      borderRadius: "12px",
                      border: "2px solid #4CAF50",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>💪</div>
                    <div style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#4CAF50" }}>
                      Best For
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 500, color: "#333", lineHeight: 1.6 }}>
                      {result.strengthsA?.[0] || "Premium features"}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1.5rem",
                      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      borderRadius: "12px",
                      border: "2px solid #2196F3",
                      boxShadow: "0 4px 12px rgba(33, 150, 243, 0.15)",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>💪</div>
                    <div style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#2196F3" }}>
                      Best For
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 500, color: "#333", lineHeight: 1.6 }}>
                      {result.strengthsB?.[0] || "Value for money"}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    padding: "2.5rem",
                    border: "4px solid #4CAF50",
                    background: "linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 12px 32px rgba(76, 175, 80, 0.25)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: "slideUp 0.6s ease-out",
                  }}
                  className="product-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(76, 175, 80, 0.35)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(76, 175, 80, 0.25)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{result.productA}</h3>
                    {(result.scoreA || 85) >= (result.scoreB || 80) && <span style={{ fontSize: "1.5rem" }}>👑</span>}
                  </div>

                  <h4
                    style={{
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                      color: "#4CAF50",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>✓</span> Strengths
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                    {result.strengthsA.map((strength: string, index: number) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "0.75rem",
                          paddingLeft: "1.5rem",
                          position: "relative",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: "#4CAF50",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>

                  <h4
                    style={{
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                      color: "#f44336",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>✗</span> Weaknesses
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {result.weaknessesA.map((weakness: string, index: number) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "0.75rem",
                          paddingLeft: "1.5rem",
                          position: "relative",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: "#f44336",
                            fontWeight: "bold",
                          }}
                        >
                          ✗
                        </span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    padding: "2.5rem",
                    border: "4px solid #2196F3",
                    background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 12px 32px rgba(33, 150, 243, 0.25)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: "slideUp 0.6s ease-out 0.1s backwards",
                  }}
                  className="product-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(33, 150, 243, 0.35)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(33, 150, 243, 0.25)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{result.productB}</h3>
                    {(result.scoreB || 80) > (result.scoreA || 85) && <span style={{ fontSize: "1.5rem" }}>👑</span>}
                  </div>

                  <h4
                    style={{
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                      color: "#4CAF50",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>✓</span> Strengths
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                    {result.strengthsB.map((strength: string, index: number) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "0.75rem",
                          paddingLeft: "1.5rem",
                          position: "relative",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: "#4CAF50",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>

                  <h4
                    style={{
                      fontSize: "1.1rem",
                      marginBottom: "0.75rem",
                      color: "#f44336",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>✗</span> Weaknesses
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {result.weaknessesB.map((weakness: string, index: number) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "0.75rem",
                          paddingLeft: "1.5rem",
                          position: "relative",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: "#f44336",
                            fontWeight: "bold",
                          }}
                        >
                          ✗
                        </span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                style={{
                  padding: "3rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "3px solid #764ba2",
                  borderRadius: "20px",
                  boxShadow: "0 16px 48px rgba(102, 126, 234, 0.4)",
                  marginBottom: "2rem",
                  animation: "slideUp 0.6s ease-out 0.2s backwards",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    filter: "blur(40px)",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: "2.5rem", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))" }}>🎯</span>
                  <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                    Our Recommendation
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "1.2rem",
                    lineHeight: 1.9,
                    color: "#fff",
                    opacity: 0.98,
                    position: "relative",
                    zIndex: 1,
                    fontWeight: 500,
                  }}
                >
                  {result.recommendation}
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  background: "var(--bg-secondary)",
                  borderRadius: "12px",
                  border: "2px solid var(--border)",
                }}
                role="region"
                aria-label="Share comparison options"
              >
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", textAlign: "center", fontWeight: 700 }}>
                  Share This Comparison
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <button
                    onClick={() => handleShare("twitter")}
                    onKeyDown={(e) => handleShareKeyDown(e, "twitter")}
                    aria-label="Share on Twitter"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#1DA1F2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(29, 161, 242, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>

                  <button
                    onClick={() => handleShare("facebook")}
                    onKeyDown={(e) => handleShareKeyDown(e, "facebook")}
                    aria-label="Share on Facebook"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#1877F2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(24, 119, 242, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>

                  <button
                    onClick={() => handleShare("linkedin")}
                    onKeyDown={(e) => handleShareKeyDown(e, "linkedin")}
                    aria-label="Share on LinkedIn"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#0A66C2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(10, 102, 194, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.065 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </button>

                  <button
                    onClick={() => handleShare("whatsapp")}
                    onKeyDown={(e) => handleShareKeyDown(e, "whatsapp")}
                    aria-label="Share on WhatsApp"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#25D366",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .\16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp
                  </button>

                  <button
                    onClick={() => handleShare("reddit")}
                    onKeyDown={(e) => handleShareKeyDown(e, "reddit")}
                    aria-label="Share on Reddit"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#FF4500",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 69, 0, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                    Reddit
                  </button>

                  <button
                    onClick={() => handleShare("telegram")}
                    onKeyDown={(e) => handleShareKeyDown(e, "telegram")}
                    aria-label="Share on Telegram"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#0088cc",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 136, 204, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    Telegram
                  </button>

                  <button
                    onClick={() => handleShare("email")}
                    onKeyDown={(e) => handleShareKeyDown(e, "email")}
                    aria-label="Share via Email"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#EA4335",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(234, 67, 53, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                    </svg>
                    Email
                  </button>

                  <button
                    onClick={() => handleShare("copy")}
                    onKeyDown={(e) => handleShareKeyDown(e, "copy")}
                    aria-label="Copy link to clipboard"
                    style={{
                      padding: "0.875rem 1rem",
                      background: "#000",
                      color: "#fff",
                      border: "2px solid #000",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--bg-secondary, #f9f9f9)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>Trending Comparisons</h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.7 }}>Most viewed comparisons this month</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {trendingComparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/comparison/${comparison.slug}`}
                aria-label={`View comparison: ${comparison.title}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "var(--bg-primary)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "2px solid var(--border)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
                className="trending-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>🔥</span>
                  <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>{comparison.views} views</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>{comparison.title}</h3>
                <p style={{ fontSize: "0.9rem", opacity: 0.7, lineHeight: 1.5 }}>{comparison.description}</p>
                <div style={{ marginTop: "1rem", fontSize: "0.85rem", opacity: 0.6 }}>{comparison.category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem", fontWeight: 700 }}>
            How It Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            {howItWorksSteps.map((step, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #000 0%, #333 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    margin: "0 auto 1.5rem",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", fontWeight: 600 }}>{step.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--bg-secondary, #f9f9f9)" }}>
        <div className="container">
          <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem", fontWeight: 700 }}>
            Trusted by Thousands
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {enhancedStats.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
                <div style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "0.5rem", color: stat.color }}>
                  {stat.value}
                </div>
                <p style={{ opacity: 0.7, fontSize: "1.1rem", fontWeight: 500 }}>{stat.label}</p>
                <p style={{ fontSize: "0.9rem", opacity: 0.6, marginTop: "0.5rem" }}>{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem", fontWeight: 700 }}>
            Browse by Category
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {categories.map((category) => (
              <div
                key={category.title}
                className="category-card"
                style={{
                  background: "var(--bg-primary, #fff)",
                  padding: "2rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{category.icon}</div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", fontWeight: 600 }}>{category.title}</h3>
                <p style={{ opacity: 0.7, fontSize: "0.95rem" }}>{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--bg-secondary, #f5f5f5)" }}>
        <div className="container">
          <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem", fontWeight: 700 }}>
            Why Choose Products VS?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {features.map((feature) => (
              <div key={feature.title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", fontWeight: 600 }}>{feature.title}</h3>
                <p style={{ opacity: 0.7 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{stat.value}</div>
                <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(135deg, #000 0%, #333 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem", fontWeight: 700, color: "#fff" }}>
            Ready to Make Better Decisions?
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "2.5rem",
              opacity: 0.9,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Explore our comprehensive comparisons and find exactly what you're looking for.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/en"
              className="cta-button"
              style={{
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                textDecoration: "none",
                background: "#fff",
                color: "#000",
                borderRadius: "8px",
                display: "inline-block",
                fontWeight: 600,
              }}
            >
              Browse All Comparisons
            </Link>
            <Link
              href="/contact"
              className="cta-button"
              style={{
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                textDecoration: "none",
                background: "transparent",
                color: "#fff",
                border: "2px solid #fff",
                borderRadius: "8px",
                display: "inline-block",
                fontWeight: 600,
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }

        .trending-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #000;
        }

        @media (max-width: 768px) {
          .compare-form-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 1rem !important;
          }

          .swap-button {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            padding: 0.5rem !important;
            font-size: 1.2rem !important;
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
            min-height: 48px !important;
            align-self: center !important;
            transform: rotate(90deg) !important;
          }

          .hero-section h1 {
            font-size: 2.5rem !important;
          }

          .hero-subtitle {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </PageLayout>
  )
}

const categories = [
  { icon: "📱", title: "Technology", description: "Smartphones, Laptops, Software" },
  { icon: "🎬", title: "Entertainment", description: "Streaming, Gaming, Music" },
  { icon: "🚗", title: "Automotive", description: "Cars, Electric Vehicles" },
  { icon: "💼", title: "Business", description: "E-commerce, Tools, Services" },
  { icon: "🏠", title: "Lifestyle", description: "Home, Health, Food" },
  { icon: "💰", title: "Finance", description: "Banking, Crypto, Payments" },
]

const features = [
  {
    icon: "🌍",
    title: "Bilingual Content",
    description: "All comparisons available in both English and Arabic for global accessibility.",
  },
  {
    icon: "📊",
    title: "Data-Driven Analysis",
    description: "Comprehensive research with verified facts, specs, and real user reviews.",
  },
  {
    icon: "🔄",
    title: "Regular Updates",
    description: "Our comparisons are updated monthly to reflect current prices and features.",
  },
  {
    icon: "⚡",
    title: "Fast & Clean",
    description: "Minimal design, no clutter, blazing fast loading speeds.",
  },
  {
    icon: "🎯",
    title: "Unbiased Reviews",
    description: "Editorial independence maintained even with affiliate partnerships.",
  },
  {
    icon: "🆓",
    title: "100% Free",
    description: "All comparisons are free to access, no registration required.",
  },
]

const stats = [
  { value: "70+", label: "Detailed Comparisons" },
  { value: "2", label: "Languages Supported" },
  { value: "15+", label: "Categories Covered" },
  { value: "2025", label: "Year Established" },
]

const trendingComparisons = [
  {
    slug: "iphone-vs-samsung",
    title: "iPhone vs Samsung Galaxy",
    description: "The ultimate smartphone showdown",
    category: "Technology",
    views: "25.4K",
  },
  {
    slug: "android-vs-ios",
    title: "Android vs iOS",
    description: "Operating system comparison",
    category: "Technology",
    views: "22.1K",
  },
  {
    slug: "playstation-vs-xbox",
    title: "PlayStation 5 vs Xbox Series X",
    description: "Next-gen gaming console comparison",
    category: "Technology",
    views: "21.6K",
  },
  {
    slug: "mac-vs-pc",
    title: "Mac vs PC",
    description: "Which computer is right for you?",
    category: "Technology",
    views: "19.8K",
  },
  {
    slug: "netflix-vs-prime",
    title: "Netflix vs Amazon Prime Video",
    description: "Streaming services compared",
    category: "Streaming",
    views: "18.5K",
  },
  {
    slug: "keto-vs-paleo",
    title: "Keto vs Paleo Diet",
    description: "Popular diets compared",
    category: "Health",
    views: "16.7K",
  },
]

const howItWorksSteps = [
  {
    title: "Choose Your Topic",
    description:
      "Browse 70+ comparisons across technology, lifestyle, and more, or use AI Battle for custom comparisons.",
  },
  {
    title: "Read Detailed Analysis",
    description: "Get comprehensive breakdowns with pros, cons, pricing, and expert insights for each option.",
  },
  {
    title: "Make Informed Decision",
    description: "Use our unbiased recommendations to choose the best option for your specific needs and budget.",
  },
  {
    title: "Share & Save",
    description: "Save favorites, share comparisons with friends, and come back anytime for reference.",
  },
]

const enhancedStats = [
  { icon: "📊", value: "70+", label: "Detailed Comparisons", subtext: "Across 9 categories", color: "#000" },
  { icon: "🌍", value: "2", label: "Languages", subtext: "English & Arabic", color: "#000" },
  { icon: "👥", value: "50K+", label: "Monthly Visitors", subtext: "Making better decisions", color: "#000" },
  { icon: "⭐", value: "4.8/5", label: "User Rating", subtext: "Based on feedback", color: "#000" },
]

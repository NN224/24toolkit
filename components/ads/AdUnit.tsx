"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { adsenseConfig } from "@/lib/config/adsense"

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdUnitProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function AdUnit({ slot, format = "auto", responsive = true, className = "", style = {} }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    // Lazy loading: only load ad when it enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { rootMargin: "200px" },
    )

    if (adRef.current) {
      observer.observe(adRef.current)
    }

    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible && window.adsbygoogle && adRef.current) {
      try {
        // Push ad to AdSense
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error("AdSense error:", error)
        setAdError(true)
      }
    }
  }, [isVisible])

  // Development placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{
          background: "#f0f0f0",
          border: "2px dashed #ccc",
          padding: "2rem",
          textAlign: "center",
          color: "#666",
          ...style,
        }}
      >
        <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Advertisement</div>
        <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
          Slot: {slot} | Format: {format}
        </div>
      </div>
    )
  }

  if (adError) {
    return null // Hide ad if there's an error
  }

  return (
    <div ref={adRef} className={`ad-container ${className}`} style={style}>
      <div style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.5rem", textAlign: "center" }}>
        Advertisement
      </div>
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", ...style }}
          data-ad-client={adsenseConfig.publisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  )
}

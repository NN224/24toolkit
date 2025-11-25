"use client"

import { useState } from "react"
import AdUnit from "./AdUnit"
import { adsenseConfig } from "@/lib/config/adsense"

export default function MobileStickyAd() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div
      className="mobile-sticky-ad"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        padding: "0.5rem",
        display: "none",
      }}
    >
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: "absolute",
          top: "0.25rem",
          right: "0.25rem",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          fontSize: "0.75rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
        }}
        aria-label="Close ad"
      >
        ×
      </button>
      <AdUnit slot={adsenseConfig.slots.mobile_sticky} format="horizontal" responsive={true} />
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-sticky-ad {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}

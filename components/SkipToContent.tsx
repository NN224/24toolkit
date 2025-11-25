"use client"

import { useState } from "react"

export default function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false)

  const handleSkip = () => {
    const mainContent = document.querySelector("main")
    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1")
      mainContent.focus()
      mainContent.addEventListener(
        "blur",
        () => {
          mainContent.removeAttribute("tabindex")
        },
        { once: true },
      )
    }
  }

  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault()
        handleSkip()
      }}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      className="skip-to-content"
      style={{
        position: "fixed",
        top: isVisible ? "1rem" : "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        padding: "1rem 2rem",
        background: "#000",
        color: "#fff",
        fontWeight: 600,
        textDecoration: "none",
        borderRadius: "4px",
        transition: "top 0.2s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      Skip to main content (Alt + S)
    </a>
  )
}

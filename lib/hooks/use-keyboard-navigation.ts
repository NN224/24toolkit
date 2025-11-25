"use client"

import { useEffect, useCallback, type RefObject } from "react"

/**
 * Hook for managing keyboard navigation and focus trapping
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLElement>(
  containerRef: RefObject<T | null>,
  options: {
    onEscape?: () => void
    onEnter?: () => void
    trapFocus?: boolean
    autoFocus?: boolean
  } = {},
) {
  const { onEscape, onEnter, trapFocus = false, autoFocus = false } = options

  // Get all focusable elements
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []

    const selector = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ")

    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(selector))
  }, [containerRef])

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Escape key
      if (event.key === "Escape" && onEscape) {
        event.preventDefault()
        onEscape()
        return
      }

      // Enter key
      if (event.key === "Enter" && onEnter) {
        event.preventDefault()
        onEnter()
        return
      }

      // Tab key for focus trapping
      if (trapFocus && event.key === "Tab") {
        const focusableElements = getFocusableElements()
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    },
    [onEscape, onEnter, trapFocus, getFocusableElements],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Auto focus first element
    if (autoFocus) {
      const focusableElements = getFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }

    // Add event listener
    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  }, [containerRef, autoFocus, handleKeyDown, getFocusableElements])

  return { getFocusableElements }
}

/**
 * Hook for skip to main content functionality
 */
export function useSkipToContent() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + S to skip to main content
      if (event.altKey && event.key === "s") {
        event.preventDefault()
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
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])
}

/**
 * Hook for managing focus restoration
 */
export function useFocusRestore(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement

    return () => {
      // Restore focus when component unmounts
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])
}

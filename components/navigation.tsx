"use client"

import Link from "next/link"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple"
import { useKeyboardNavigation } from "@/lib/hooks/use-keyboard-navigation"

interface NavigationProps {
  currentPath?: string
  locale?: "en" | "ar"
}

export default function Navigation({ currentPath = "/", locale = "en" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useKeyboardNavigation(mobileMenuRef, {
    onEscape: () => setIsMenuOpen(false),
    trapFocus: isMenuOpen,
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      closeMenu()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "/") {
        e.preventDefault()
        const searchInput = document.querySelector(".search-input") as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".navbar")) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMenuOpen])

  const isActive = (path: string) => currentPath === path

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm" aria-label="Main navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex-shrink-0 text-2xl font-semibold tracking-tight text-[var(--text)] transition-opacity hover:opacity-70" aria-label="Products VS Home">
          Products <span className="font-normal">VS</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xs md:block" role="search" aria-label="Search products">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search products... (Alt + /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 pl-10 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:border-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--text)]/10 search-input"
              aria-label="Search products"
            />
          </div>
        </form>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <div className="relative w-6 h-5">
            <span className={`absolute top-0 left-0 w-full h-0.5 bg-[var(--text)] transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-[var(--text)] -translate-y-1/2 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text)] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>

        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-auto flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-6 bg-[var(--bg)] md:bg-transparent border-b md:border-b-0 border-[var(--border)] p-6 md:p-0 shadow-lg md:shadow-none max-h-[calc(100vh-60px)] md:max-h-none overflow-y-auto md:overflow-visible`}
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <form onSubmit={handleSearch} className="md:hidden mb-4" role="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" size={18} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 pl-10 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:border-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--text)]/10 search-input"
                aria-label="Search products"
              />
            </div>
          </form>

          <Link
            href="/"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            aria-current={isActive("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/en"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/en") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            aria-current={isActive("/en") ? "page" : undefined}
          >
            Comparisons
          </Link>
          <Link
            href="/category/technology"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${currentPath.startsWith("/category") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            title="Browse by category"
          >
            Categories
          </Link>
          <Link
            href="/ai-battle"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/ai-battle") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            aria-current={isActive("/ai-battle") ? "page" : undefined}
          >
            AI Battle
          </Link>
          <Link
            href="/favorites"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/favorites") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            aria-current={isActive("/favorites") ? "page" : undefined}
          >
            Favorites
          </Link>
          <Link
            href="/about"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/about") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            aria-current={isActive("/about") ? "page" : undefined}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`py-3 md:py-0 border-b md:border-b-0 border-[var(--border)] text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/contact") ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            onClick={closeMenu}
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            Contact
          </Link>

          <div className="flex items-center py-3 md:py-0 border-b md:border-b-0 border-[var(--border)]">
            <ThemeToggleSimple />
          </div>

          <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
            <Link
              href={locale === "en" ? "/ar" : "/en"}
              className="block w-full md:w-auto rounded-md px-4 py-2 text-center text-sm font-medium uppercase tracking-wider transition-all border-2 bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)]"
              onClick={closeMenu}
              aria-label={`Switch to ${locale === "en" ? "Arabic" : "English"}`}
            >
              {locale === "en" ? "العربية" : "English"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

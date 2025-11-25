"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { comparisons } from "@/lib/comparisons-data"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof comparisons>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = comparisons.filter(
      (comp) =>
        comp.title.toLowerCase().includes(searchQuery) ||
        comp.description.toLowerCase().includes(searchQuery) ||
        comp.category.toLowerCase().includes(searchQuery) ||
        comp.optionA.name.toLowerCase().includes(searchQuery) ||
        comp.optionB.name.toLowerCase().includes(searchQuery),
    )

    setResults(filtered.slice(0, 8))
    setIsOpen(filtered.length > 0)
  }, [query])

  return (
    <div ref={searchRef} style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search comparisons..."
          style={{
            width: "100%",
            padding: "0.75rem 1rem 0.75rem 2.75rem",
            fontSize: "1rem",
            border: "2px solid var(--border)",
            borderRadius: "8px",
            background: "var(--bg-primary)",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
        />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.5,
          }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            right: 0,
            background: "var(--bg-primary)",
            border: "2px solid var(--border)",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/comparison/${result.slug}`}
              onClick={() => {
                setIsOpen(false)
                setQuery("")
              }}
              style={{
                display: "block",
                padding: "1rem",
                textDecoration: "none",
                color: "inherit",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{result.title}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{result.description}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "0.25rem" }}>{result.category}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

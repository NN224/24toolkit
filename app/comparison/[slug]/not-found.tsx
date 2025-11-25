"use client"

import PageLayout from "@/components/page-layout"
import Link from "next/link"

export default function ComparisonNotFound() {
  return (
    <PageLayout>
      <section style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🔍</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>Comparison Not Found</h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.7,
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            We don't have this comparison yet, but you can create it instantly with our AI-powered comparison tool!
          </p>

          {/* AI Battle CTA */}
          <div
            style={{
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              padding: "2.5rem",
              borderRadius: "16px",
              border: "3px solid var(--border)",
              marginBottom: "3rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Generate This Comparison</h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "2rem", lineHeight: 1.6 }}>
              Use our AI Battle tool to create a detailed comparison between any two products, services, or concepts in
              seconds!
            </p>
            <Link
              href="/#ai-battle"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "#000",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Try AI Battle Now
            </Link>
          </div>

          {/* Alternative actions */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "1.5rem" }}>Or explore our content:</h3>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/en"
                style={{
                  padding: "0.875rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "var(--bg-primary)",
                  color: "var(--text)",
                  border: "2px solid var(--border)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#000"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                }}
              >
                Browse 70+ Comparisons
              </Link>
              <Link
                href="/"
                style={{
                  padding: "0.875rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "transparent",
                  color: "var(--text)",
                  border: "2px solid var(--border)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#000"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                }}
              >
                Go to Homepage
              </Link>
            </div>
          </div>

          {/* Popular comparisons */}
          <div style={{ marginTop: "3rem", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "1.5rem", textAlign: "center" }}>
              Popular Comparisons
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {popularComparisons.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/comparison/${comp.slug}`}
                  style={{
                    padding: "1.25rem",
                    background: "var(--bg-primary)",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{comp.title}</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>{comp.category}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

const popularComparisons = [
  { slug: "iphone-vs-samsung", title: "iPhone vs Samsung", category: "Technology" },
  { slug: "android-vs-ios", title: "Android vs iOS", category: "Technology" },
  { slug: "netflix-vs-prime", title: "Netflix vs Prime Video", category: "Streaming" },
  { slug: "mac-vs-pc", title: "Mac vs PC", category: "Technology" },
]

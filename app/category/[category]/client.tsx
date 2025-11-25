"use client"
import Link from "next/link"
import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { comparisons } from "@/lib/comparisons-data"

const categoryInfo: Record<string, { title: string; description: string; icon: string }> = {
  technology: {
    title: "Technology Comparisons",
    description:
      "Compare the latest tech products, gadgets, and services. From smartphones to laptops, gaming consoles to software platforms.",
    icon: "💻",
  },
  "entertainment-streaming": {
    title: "Entertainment & Streaming Comparisons",
    description:
      "Compare streaming services, music platforms, and entertainment options. Find the best service for your needs.",
    icon: "🎬",
  },
  "travel-accommodation": {
    title: "Travel & Accommodation Comparisons",
    description: "Compare travel booking platforms, accommodation options, and transportation services.",
    icon: "✈️",
  },
  "lifestyle-health": {
    title: "Lifestyle & Health Comparisons",
    description: "Compare diets, fitness options, and lifestyle choices. Make informed decisions for your wellbeing.",
    icon: "🏃",
  },
  "ecommerce-shopping": {
    title: "E-commerce & Shopping Comparisons",
    description: "Compare online marketplaces, shopping platforms, and e-commerce solutions.",
    icon: "🛒",
  },
  automotive: {
    title: "Automotive Comparisons",
    description: "Compare vehicles, car buying options, and automotive technologies.",
    icon: "🚗",
  },
  "finance-cryptocurrency": {
    title: "Finance & Cryptocurrency Comparisons",
    description: "Compare investment options, cryptocurrencies, and financial products.",
    icon: "💰",
  },
  "food-beverages": {
    title: "Food & Beverages Comparisons",
    description: "Compare food choices, beverages, and dietary options.",
    icon: "☕",
  },
}

export default function CategoryPageClient({
  category,
  params,
}: { category: { title: string; description: string; icon: string }; params: { category: string } }) {
  // Filter comparisons by category with normalized category names
  const categoryComparisons = comparisons.filter((comp) => {
    const normalizedCategory = comp.category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")
    return normalizedCategory === params.category
  })

  // Get related categories (exclude current)
  const relatedCategories = Object.keys(categoryInfo)
    .filter((cat) => cat !== params.category)
    .slice(0, 3)

  return (
    <PageLayout currentPath={`/category/${params.category}`}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.title }]} />

      <section style={{ padding: "60px 0" }}>
        <div className="container">
          {/* Category header with icon and description */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{category.icon}</div>
            <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>{category.title}</h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "800px", margin: "0 auto" }}>
              {category.description}
            </p>
            <div style={{ marginTop: "2rem" }}>
              <span
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  fontSize: "0.9rem",
                }}
              >
                {categoryComparisons.length} Comparisons
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 700 }}>All Comparisons</h2>

          {/* Comparison grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "2rem",
              marginBottom: "4rem",
            }}
          >
            {categoryComparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/comparison/${comparison.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "var(--bg-primary)",
                  padding: "2rem",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"
                  e.currentTarget.style.borderColor = "#000"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = "var(--border)"
                }}
              >
                <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.75rem" }}>{comparison.title}</h3>
                <p style={{ fontSize: "0.95rem", opacity: 0.7, lineHeight: 1.6, marginBottom: "1rem" }}>
                  {comparison.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    fontSize: "0.85rem",
                    opacity: 0.6,
                    alignItems: "center",
                  }}
                >
                  <span>👁️ {comparison.views}</span>
                  <span>📅 {comparison.lastUpdated}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Related categories section */}
          <div style={{ marginTop: "4rem", padding: "3rem", background: "var(--bg-secondary)", borderRadius: "12px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>Explore Other Categories</h2>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}
            >
              {relatedCategories.map((catKey) => {
                const cat = categoryInfo[catKey]
                return (
                  <Link
                    key={catKey}
                    href={`/category/${catKey}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      background: "var(--bg-primary)",
                      padding: "2rem",
                      border: "2px solid var(--border)",
                      borderRadius: "12px",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)"
                      e.currentTarget.style.borderColor = "#000"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.borderColor = "var(--border)"
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{cat.icon}</div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600 }}>{cat.title}</h3>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* CTA section */}
          <div style={{ marginTop: "4rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Can't find what you're looking for?</h3>
            <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
              Use our AI Battle to generate a custom comparison instantly
            </p>
            <Link
              href="/#ai-battle"
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "#000",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              Generate Custom Comparison
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

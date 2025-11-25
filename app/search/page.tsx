"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Search, TrendingUp } from "lucide-react"

// Sample products data - in real app, this would come from API/database
const allProducts = [
  { id: 1, name: "iPhone 15 Pro", category: "Smartphones", slug: "iphone-15-pro-vs-samsung-galaxy-s24-ultra" },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    slug: "iphone-15-pro-vs-samsung-galaxy-s24-ultra",
  },
  { id: 3, name: "MacBook Pro M3", category: "Laptops", slug: "macbook-pro-m3-vs-dell-xps-15" },
  { id: 4, name: "Dell XPS 15", category: "Laptops", slug: "macbook-pro-m3-vs-dell-xps-15" },
  { id: 5, name: "Sony WH-1000XM5", category: "Headphones", slug: "sony-wh-1000xm5-vs-bose-qc45" },
  { id: 6, name: "Bose QuietComfort 45", category: "Headphones", slug: "sony-wh-1000xm5-vs-bose-qc45" },
  { id: 7, name: "iPad Pro", category: "Tablets", slug: "ipad-pro-vs-samsung-galaxy-tab-s9" },
  { id: 8, name: "Samsung Galaxy Tab S9", category: "Tablets", slug: "ipad-pro-vs-samsung-galaxy-tab-s9" },
  {
    id: 9,
    name: "Apple Watch Series 9",
    category: "Smartwatches",
    slug: "apple-watch-series-9-vs-samsung-galaxy-watch-6",
  },
  {
    id: 10,
    name: "Samsung Galaxy Watch 6",
    category: "Smartwatches",
    slug: "apple-watch-series-9-vs-samsung-galaxy-watch-6",
  },
]

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<typeof allProducts>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Simulate search delay
    const timer = setTimeout(() => {
      if (query.trim()) {
        const filtered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filtered)
      } else {
        setResults([])
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const popularSearches = [
    "iPhone vs Samsung",
    "MacBook vs Dell",
    "Sony vs Bose",
    "iPad vs Galaxy Tab",
    "Apple Watch vs Galaxy Watch",
  ]

  return (
    <div className="search-page">
      <Navigation currentPath="/search" />

      <main className="search-container">
        <div className="search-header">
          <h1>Search Results</h1>
          {query && (
            <p className="search-query">
              Showing results for: <strong>{query}</strong>
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        ) : query ? (
          results.length > 0 ? (
            <div className="results-grid">
              {results.map((product) => (
                <Link key={product.id} href={`/en/${product.slug}`} className="result-card">
                  <div className="result-category">{product.category}</div>
                  <h3 className="result-name">{product.name}</h3>
                  <div className="result-action">View Comparison →</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search size={48} />
              <h2>No results found</h2>
              <p>Try searching with different keywords</p>
            </div>
          )
        ) : (
          <div className="search-suggestions">
            <div className="suggestions-section">
              <h2>
                <TrendingUp size={20} />
                Popular Searches
              </h2>
              <div className="suggestions-list">
                {popularSearches.map((search, index) => (
                  <Link key={index} href={`/search?q=${encodeURIComponent(search)}`} className="suggestion-item">
                    {search}
                  </Link>
                ))}
              </div>
            </div>

            <div className="suggestions-section">
              <h2>Browse by Category</h2>
              <div className="category-grid">
                {["Smartphones", "Laptops", "Headphones", "Tablets", "Smartwatches"].map((category) => (
                  <Link key={category} href={`/search?q=${encodeURIComponent(category)}`} className="category-card">
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .search-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: var(--spacing-2xl) var(--spacing-lg);
          flex: 1;
        }

        .search-header {
          margin-bottom: var(--spacing-2xl);
        }

        .search-header h1 {
          font-size: var(--font-3xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          letter-spacing: -0.03em;
        }

        .search-query {
          color: var(--text-secondary);
          font-size: var(--font-md);
        }

        .search-query strong {
          color: var(--text);
          font-weight: 600;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-3xl) 0;
          gap: var(--spacing-lg);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--text);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .result-card {
          padding: var(--spacing-xl);
          border: 1px solid var(--border);
          background: var(--bg);
          text-decoration: none;
          transition: all var(--transition);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .result-card:hover {
          border-color: var(--text);
          transform: translateY(-2px);
        }

        .result-category {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        .result-name {
          font-size: var(--font-xl);
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .result-action {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          margin-top: auto;
          font-weight: 500;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-3xl) 0;
          gap: var(--spacing-lg);
          color: var(--text-secondary);
        }

        .no-results h2 {
          font-size: var(--font-2xl);
          color: var(--text);
          font-weight: 600;
        }

        .search-suggestions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3xl);
        }

        .suggestions-section h2 {
          font-size: var(--font-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          letter-spacing: -0.02em;
        }

        .suggestions-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .suggestion-item {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: 1px solid var(--border);
          background: var(--bg);
          text-decoration: none;
          color: var(--text);
          font-size: var(--font-sm);
          font-weight: 500;
          transition: all var(--transition);
        }

        .suggestion-item:hover {
          border-color: var(--text);
          background: var(--text);
          color: var(--bg);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .category-card {
          padding: var(--spacing-xl);
          border: 1px solid var(--border);
          background: var(--bg);
          text-decoration: none;
          color: var(--text);
          font-size: var(--font-md);
          font-weight: 600;
          text-align: center;
          transition: all var(--transition);
        }

        .category-card:hover {
          border-color: var(--text);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .search-header h1 {
            font-size: var(--font-2xl);
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .category-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Loading...</div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}

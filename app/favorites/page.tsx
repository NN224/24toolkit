"use client"

import { useState, useEffect } from "react"
import PageLayout from "@/components/page-layout"
import Link from "next/link"

interface Favorite {
  id: string
  comparison: {
    id: string
    title_en: string
    slug: string
    meta_description_en: string
    view_count: number
    category?: {
      name_en: string
      icon: string
    }
  }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = (id: string) => {
    if (!confirm("Remove this comparison from favorites?")) return

    const updated = favorites.filter((fav) => fav.id !== id)
    setFavorites(updated)
    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  return (
    <PageLayout currentPath="/favorites">
      <div className="favorites-header">
        <div className="container">
          <h1>My Favorites</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>Comparisons you've saved for later</p>
        </div>
      </div>

      <div className="favorites-container">
        <div id="favorites-content">
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ fontSize: "1.2rem", color: "#7f8c8d" }}>Loading your favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="empty-state">
              <h2>No Favorites Yet</h2>
              <p>Start exploring comparisons and save your favorites!</p>
              <Link href="/" className="cta-button">
                Browse Comparisons
              </Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((fav) => (
                <div key={fav.id} className="favorite-card">
                  <button
                    className="remove-favorite"
                    onClick={() => removeFavorite(fav.id)}
                    title="Remove from favorites"
                  >
                    ×
                  </button>
                  {fav.comparison.category && (
                    <span className="category-badge">
                      {fav.comparison.category.icon} {fav.comparison.category.name_en}
                    </span>
                  )}
                  <h3>{fav.comparison.title_en}</h3>
                  <p>{fav.comparison.meta_description_en.substring(0, 120)}...</p>
                  <div className="meta">
                    <span>{fav.comparison.view_count.toLocaleString()} views</span>
                    <Link href={`/comparison/${fav.comparison.slug}`}>View →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .favorites-header {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .favorites-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .favorites-container {
          max-width: 1200px;
          margin: 3rem auto;
          padding: 0 20px;
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .favorite-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          position: relative;
        }

        .favorite-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .category-badge {
          display: inline-block;
          background: #3498db;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .favorite-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
          color: #2c3e50;
        }

        .favorite-card p {
          color: #7f8c8d;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .favorite-card .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .favorite-card .meta span {
          color: #95a5a6;
          font-size: 0.9rem;
        }

        .favorite-card .meta a {
          color: #3498db;
          font-weight: 600;
          text-decoration: none;
        }

        .remove-favorite {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #e74c3c;
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .remove-favorite:hover {
          transform: scale(1.1);
          background: #c0392b;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #7f8c8d;
        }

        .empty-state p {
          color: #95a5a6;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .favorites-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  )
}

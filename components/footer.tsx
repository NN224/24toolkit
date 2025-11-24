"use client"

import Link from "next/link"
import NAP from "@/components/seo/NAP"

export default function Footer() {
  const popularComparisons = [
    { title: "iPhone vs Samsung", slug: "iphone-vs-samsung" },
    { title: "Netflix vs Disney+", slug: "netflix-vs-disney" },
    { title: "Bitcoin vs Ethereum", slug: "bitcoin-vs-ethereum" },
    { title: "Keto vs Paleo", slug: "keto-vs-paleo" },
    { title: "Amazon vs Walmart", slug: "amazon-vs-walmart" },
  ]

  const categories = [
    { title: "Technology", slug: "technology" },
    { title: "Entertainment", slug: "entertainment-streaming" },
    { title: "Travel", slug: "travel-accommodation" },
    { title: "Lifestyle", slug: "lifestyle-health" },
    { title: "Shopping", slug: "ecommerce-shopping" },
    { title: "Automotive", slug: "automotive" },
    { title: "Finance", slug: "finance-cryptocurrency" },
    { title: "Food", slug: "food-beverages" },
  ]

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Products VS</h4>
          <p>Professional comparison website providing detailed analysis in both English and Arabic languages.</p>
          <Link href="/ai-battle" style={{ display: "block", marginTop: "1rem", fontWeight: 600 }}>
            Try AI Battle →
          </Link>
        </div>

        <div className="footer-section">
          <h4>Popular Comparisons</h4>
          <ul>
            {popularComparisons.map((comp) => (
              <li key={comp.slug}>
                <Link href={`/comparison/${comp.slug}`}>{comp.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`}>{cat.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/en">English Comparisons</Link>
            </li>
            <li>
              <Link href="/ar">المقارنات بالعربية</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <NAP variant="footer" />
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "2rem 0", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "0.5rem" }}>
          &copy; 2025 Products VS. All rights reserved.
        </p>
        <Link href="/sitemap.xml" style={{ fontSize: "0.85rem", opacity: 0.6 }}>
          Sitemap
        </Link>
      </div>

      <style jsx>{`
        .footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: var(--spacing-3xl) 0 0;
          margin-top: var(--spacing-3xl);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-2xl);
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .footer-section h4 {
          font-size: var(--font-sm);
          margin-bottom: var(--spacing-md);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .footer-section p,
        .footer-section a {
          color: var(--text-secondary);
          font-size: var(--font-sm);
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin-bottom: var(--spacing-xs);
        }

        .footer-section a {
          border: none;
          transition: color var(--transition);
        }

        .footer-section a:hover {
          color: var(--text);
        }

        @media (max-width: 480px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}

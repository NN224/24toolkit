"use client"

import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import Link from "next/link"

export default function AboutPageClient() {
  return (
    <PageLayout currentPath="/about">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <section className="hero-section">
        <div className="container">
          <h1>About Products VS</h1>
          <p className="hero-subtitle">Your Trusted Source for Comprehensive Product Comparisons</p>
        </div>
      </section>

      <section className="detailed-comparison">
        <div className="container">
          <div className="comparison-content">
            <div className="comparison-section">
              <h2>Our Mission</h2>
              <div className="section-content">
                <p>
                  At <strong>Products VS</strong>, our mission is simple yet powerful: to empower consumers worldwide
                  with comprehensive, unbiased, and easy-to-understand product comparisons. We believe that making
                  informed decisions shouldn't be complicated or time-consuming.
                </p>
                <p>
                  In today's world of endless choices, we're here to cut through the noise and present you with clear,
                  factual comparisons that matter. Whether you're choosing between smartphones, streaming services, or
                  lifestyle products, we've got you covered.
                </p>
              </div>
            </div>

            <div className="comparison-section">
              <h2>What We Do</h2>
              <div className="section-content">
                <p>
                  Products VS is a bilingual comparison platform serving both English and Arabic-speaking audiences. We
                  specialize in:
                </p>
                <ul>
                  <li>
                    <strong>Technology Comparisons:</strong> Smartphones, laptops, gaming consoles, software, and more
                  </li>
                  <li>
                    <strong>Service Comparisons:</strong> Streaming platforms, cloud services, financial services
                  </li>
                  <li>
                    <strong>Lifestyle Comparisons:</strong> Cars, home appliances, health products, food choices
                  </li>
                  <li>
                    <strong>Business Comparisons:</strong> E-commerce platforms, productivity tools, hosting services
                  </li>
                  <li>
                    <strong>Entertainment Comparisons:</strong> Gaming platforms, music services, content platforms
                  </li>
                </ul>
                <p>
                  Each comparison is meticulously researched, regularly updated, and presented in a format that's easy
                  to digest and act upon.
                </p>
              </div>
            </div>

            <div className="comparison-section">
              <h2>Our Core Values</h2>
              <div className="section-content">
                <div className="value-grid">
                  {values.map((value) => (
                    <div key={value.title} className="value-item">
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="comparison-section">
              <h2>Products VS in Numbers</h2>
              <div className="section-content">
                <div className="stats-grid">
                  {stats.map((stat) => (
                    <div key={stat.label} className="stat-item">
                      <h3>{stat.value}</h3>
                      <p>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="comparison-section">
              <h2>Get in Touch</h2>
              <div className="section-content">
                <p>
                  Have a suggestion for a comparison? Found an error? Want to collaborate? We'd love to hear from you!
                </p>
                <p>
                  <Link href="/contact" className="cta-button">
                    Contact Us
                  </Link>
                </p>
                <p>
                  You can also reach us directly at: <strong>info@productsvs.com</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .comparison-section {
          margin: var(--spacing-3xl) 0;
          padding: var(--spacing-3xl) 0;
          border-bottom: 1px solid var(--border);
        }

        .comparison-section:last-child {
          border-bottom: none;
        }

        .comparison-section h2 {
          font-size: var(--font-3xl);
          margin-bottom: var(--spacing-xl);
          font-weight: 600;
        }

        .section-content {
          max-width: 800px;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-xl);
          margin-top: var(--spacing-xl);
        }

        .value-item {
          padding: var(--spacing-lg);
          background: var(--surface);
          border: 1px solid var(--border);
        }

        .value-item h3 {
          font-size: var(--font-xl);
          margin-bottom: var(--spacing-sm);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-2xl);
          text-align: center;
          padding: var(--spacing-2xl) 0;
        }

        .stat-item h3 {
          font-size: 4rem;
          font-weight: 300;
          margin-bottom: var(--spacing-sm);
        }

        .stat-item p {
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: var(--font-xs);
        }
      `}</style>
    </PageLayout>
  )
}

const values = [
  {
    title: "🔍 Transparency",
    description:
      "We believe in complete transparency. Our comparison methodology is clear, our affiliate relationships are disclosed, and our commitment to objectivity is unwavering.",
  },
  {
    title: "📊 Accuracy",
    description:
      "Every piece of information is fact-checked and verified. We update our comparisons regularly to ensure you're getting the most current data.",
  },
  {
    title: "🌍 Accessibility",
    description:
      "Information should be accessible to everyone. That's why we provide our content in both English and Arabic, serving a global audience.",
  },
  {
    title: "👥 User-Centric",
    description:
      "Your needs come first. Every comparison is structured to answer real questions that real people have when making purchasing decisions.",
  },
]

const stats = [
  { value: "70+", label: "Detailed Comparisons" },
  { value: "2", label: "Languages Supported" },
  { value: "15+", label: "Categories Covered" },
  { value: "2025", label: "Year Established" },
]

"use client"

import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"

export default function TermsClient() {
  return (
    <PageLayout currentPath="/terms">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

      <section className="hero-section">
        <div className="container">
          <h1>Terms of Service</h1>
          <p className="hero-subtitle">Last updated: October 21, 2025</p>
        </div>
      </section>

      <section className="detailed-comparison">
        <div className="container">
          <div className="comparison-content">
            {termsSections.map((section, index) => (
              <div key={index} className="comparison-section">
                <h2>{section.title}</h2>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
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
      `}</style>
    </PageLayout>
  )
}

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: `<p>By accessing andnbsp;using Products VS (www.productsvs.com), you accept and agree tonbsp;be bound by the terms andnbsp;provision of this agreement. If you do not agree tonbsp;abide by the above, please do not use this service.</p>
    <p>These Terms of Service apply tonbsp;all users of thenbsp;site, including withoutnbsp;limitation users who arenbsp;browsers, vendors, customers, merchants, and/or contributors of content.</p>`,
  },
  {
    title: "2. Use of Our Service",
    content: `<h3>2.1 Permitted Use</h3>
    <p>Products VS provides comparison information fornbsp;various products andnbsp;services. You may use ournbsp;website for:</p>
    <ul>
      <li>Reading andnbsp;researching product comparisons</li>
      <li>Personal, non-commercial use</li>
      <li>Educational purposes</li>
      <li>Making informed purchasing decisions</li>
    </ul>`,
  },
  {
    title: "3. Content and Information",
    content: `<h3>3.1 Accuracy of Information</h3>
    <p>We make every effort tonbsp;ensure that thenbsp;information onnbsp;Products VS isnbsp;accurate andnbsp;up-to-date. However, we do notnbsp;warrant thenbsp;completeness, reliability, ornbsp;accuracy ofnbsp;this information. Thenbsp;comparison information, prices, features, andnbsp;specifications mentioned onnbsp;ournbsp;website arenbsp;subject tonbsp;change withoutnbsp;notice.</p>`,
  },
  {
    title: "4. Contact Information",
    content: `<p>If you have anynbsp;questions aboutnbsp;these Terms ofnbsp;Service, please contact us:</p>
    <ul>
      <li>By email: info@productsvs.com</li>
      <li>On thisnbsp;page: <a href="/contact">Contact Form</a></li>
      <li>By visiting ournbsp;website: www.productsvs.com</li>
    </ul>`,
  },
]

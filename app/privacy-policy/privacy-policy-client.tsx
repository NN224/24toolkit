"use client"

import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"

export default function PrivacyPolicyClient() {
  return (
    <PageLayout currentPath="/privacy-policy">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <section className="hero-section">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">Last updated: October 21, 2025</p>
        </div>
      </section>

      <section className="detailed-comparison">
        <div className="container">
          <div className="comparison-content">
            {privacySections.map((section, index) => (
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

const privacySections = [
  {
    title: "1. Introduction",
    content: `<p>Welcome to Products VS ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.productsvs.com.</p>
    <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>`,
  },
  {
    title: "2. Information We Collect",
    content: `<h3>2.1 Information Automatically Collected</h3>
    <p>When you visit our website, we automatically collect certain information about your device, including:</p>
    <ul>
      <li>IP address</li>
      <li>Browser type and version</li>
      <li>Operating system</li>
      <li>Pages visited and time spent on pages</li>
      <li>Referring website addresses</li>
      <li>Date and time of visits</li>
    </ul>`,
  },
  {
    title: "3. How We Use Your Information",
    content: `<p>We use the information we collect to:</p>
    <ul>
      <li>Provide, operate, and maintain our website</li>
      <li>Improve, personalize, and expand our website</li>
      <li>Understand and analyze how you use our website</li>
      <li>Develop new products, services, features, and functionality</li>
      <li>Communicate with you, including for customer service and support</li>
      <li>Monitor and prevent fraud and technical issues</li>
      <li>Comply with legal obligations</li>
    </ul>`,
  },
  {
    title: "4. Contact Us",
    content: `<p>If you have any questions about this Privacy Policy, please contact us:</p>
    <ul>
      <li>By email: info@productsvs.com</li>
      <li>On this page: <a href="/contact">Contact Form</a></li>
      <li>By visiting our website: www.productsvs.com</li>
    </ul>`,
  },
]

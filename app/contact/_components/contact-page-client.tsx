"use client"

import type React from "react"

import { useState } from "react"
import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import NAP from "@/components/seo/NAP"

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    newsletter: false,
  })
  const [showMessage, setShowMessage] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowMessage(true)
    setFormData({ name: "", email: "", subject: "", message: "", newsletter: false })

    setTimeout(() => {
      setShowMessage(false)
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <PageLayout currentPath="/contact">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <section className="hero-section">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">We'd love to hear from you! Get in touch with any questions or suggestions.</p>
        </div>
      </section>

      <section className="detailed-comparison">
        <div className="container">
          <div className="comparison-content">
            <div className="comparison-section">
              <h2>Send Us a Message</h2>
              <div className="section-content">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Your Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select id="subject" name="subject" required value={formData.subject} onChange={handleChange}>
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="suggestion">Comparison Suggestion</option>
                      <option value="correction">Report an Error</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="advertising">Advertising Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleChange} />
                      I'd like to receive updates about new comparisons
                    </label>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="cta-button">
                      Send Message
                    </button>
                  </div>

                  <p className="form-note">* Required fields</p>
                </form>

                {showMessage && (
                  <div className="form-message">
                    <p>Thank you for contacting us! We'll get back to you within 24-48 hours.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="comparison-section">
              <h2>Business Information</h2>
              <div className="section-content">
                <NAP variant="contact" />
              </div>
            </div>

            <div className="comparison-section">
              <h2>Other Ways to Reach Us</h2>
              <div className="section-content">
                <div className="contact-info-grid">
                  <div className="contact-info-item">
                    <h3>Email</h3>
                    <p>
                      <strong>General Inquiries:</strong>
                      <br />
                      info@productsvs.com
                    </p>
                    <p>
                      <strong>Partnership Opportunities:</strong>
                      <br />
                      partners@productsvs.com
                    </p>
                    <p>
                      <strong>Technical Support:</strong>
                      <br />
                      support@productsvs.com
                    </p>
                  </div>

                  <div className="contact-info-item">
                    <h3>Response Time</h3>
                    <p>We aim to respond to all inquiries within 24-48 hours during business days.</p>
                    <p>
                      <strong>Business Hours:</strong>
                      <br />
                      Monday - Friday
                      <br />
                      9:00 AM - 6:00 PM (GMT+4)
                    </p>
                  </div>

                  <div className="contact-info-item">
                    <h3>Global Reach</h3>
                    <p>We serve users worldwide with content in English and Arabic.</p>
                    <p>Our comparison platform helps millions make informed decisions every month.</p>
                  </div>
                </div>
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

        .contact-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          margin: 0;
        }

        .form-note {
          color: var(--text-light);
          font-size: 0.875rem;
          margin-top: 1rem;
        }

        .form-message {
          padding: 1rem;
          background: #000;
          color: white;
          margin-top: 2rem;
          text-align: center;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .contact-info-item {
          padding: 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
        }

        .contact-info-item h3 {
          font-size: var(--font-xl);
          margin-bottom: var(--spacing-md);
        }
      `}</style>
    </PageLayout>
  )
}

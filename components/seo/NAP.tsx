"use client"

import Link from "next/link"

interface NAPProps {
  variant?: "footer" | "contact" | "inline"
  showLabel?: boolean
}

export default function NAP({ variant = "inline", showLabel = true }: NAPProps) {
  const businessInfo = {
    name: "Products VS",
    email: "info@productsvs.com",
    businessHours: "Monday - Friday, 9:00 AM - 6:00 PM (GMT+4)",
    website: "https://www.productsvs.com",
  }

  if (variant === "footer") {
    return (
      <div className="nap-footer">
        <h4>{businessInfo.name}</h4>
        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${businessInfo.email}`} itemProp="email">
            {businessInfo.email}
          </a>
        </p>
        <p>
          <strong>Hours:</strong> {businessInfo.businessHours}
        </p>
        <p>
          <Link href="/" itemProp="url">
            {businessInfo.website}
          </Link>
        </p>

        <style jsx>{`
          .nap-footer h4 {
            font-size: var(--font-sm);
            margin-bottom: var(--spacing-md);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
          }

          .nap-footer p {
            color: var(--text-secondary);
            font-size: var(--font-sm);
            margin-bottom: var(--spacing-xs);
          }

          .nap-footer a {
            color: var(--text-secondary);
            border: none;
            transition: color var(--transition);
          }

          .nap-footer a:hover {
            color: var(--text);
          }
        `}</style>
      </div>
    )
  }

  if (variant === "contact") {
    return (
      <div className="nap-contact" itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content={businessInfo.name} />
        <meta itemProp="url" content={businessInfo.website} />

        <div className="contact-item">
          <h3>Business Name</h3>
          <p itemProp="name">{businessInfo.name}</p>
        </div>

        <div className="contact-item">
          <h3>Email Address</h3>
          <p>
            <a href={`mailto:${businessInfo.email}`} itemProp="email">
              {businessInfo.email}
            </a>
          </p>
        </div>

        <div className="contact-item">
          <h3>Business Hours</h3>
          <p itemProp="openingHours" content="Mo-Fr 09:00-18:00">
            {businessInfo.businessHours}
          </p>
        </div>

        <div className="contact-item">
          <h3>Website</h3>
          <p>
            <Link href="/" itemProp="url">
              {businessInfo.website}
            </Link>
          </p>
        </div>

        <style jsx>{`
          .nap-contact {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-xl);
            padding: var(--spacing-2xl);
            background: var(--surface);
            border: 1px solid var(--border);
          }

          .contact-item h3 {
            font-size: var(--font-lg);
            margin-bottom: var(--spacing-sm);
            font-weight: 600;
          }

          .contact-item p {
            color: var(--text-secondary);
          }

          .contact-item a {
            color: var(--primary);
            transition: opacity var(--transition);
          }

          .contact-item a:hover {
            opacity: 0.8;
          }
        `}</style>
      </div>
    )
  }

  return (
    <span className="nap-inline" itemScope itemType="https://schema.org/Organization">
      {showLabel && <span>Contact: </span>}
      <a href={`mailto:${businessInfo.email}`} itemProp="email">
        {businessInfo.email}
      </a>
    </span>
  )
}

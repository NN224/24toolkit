"use client"

import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="container">
        {items.map((item, index) => (
          <span key={index}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span className="current">{item.label}</span>}
            {index < items.length - 1 && <span className="separator">›</span>}
          </span>
        ))}
      </div>

      <style jsx>{`
        .breadcrumbs {
          padding: var(--spacing-md) 0;
          font-size: var(--font-sm);
          color: var(--text-light);
          border-bottom: 1px solid var(--border);
        }

        .breadcrumbs a {
          color: var(--text-secondary);
          border: none;
        }

        .breadcrumbs a:hover {
          color: var(--text);
        }

        .separator {
          margin: 0 var(--spacing-xs);
        }

        .current {
          color: var(--text);
        }
      `}</style>
    </nav>
  )
}

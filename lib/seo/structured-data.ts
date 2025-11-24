export interface OrganizationData {
  name: string
  url: string
  logo: string
  description: string
  email: string
  foundingDate: string
  sameAs: string[]
  contactPoint: {
    contactType: string
    email: string
    availableLanguage: string[]
    areaServed: string
  }
}

export interface WebsiteData {
  url: string
  name: string
  description: string
  inLanguage: string[]
  potentialAction: {
    type: string
    target: string
    queryInput: string
  }
}

export interface BreadcrumbData {
  items: Array<{
    name: string
    url: string
  }>
}

export function generateOrganizationSchema(data: OrganizationData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    email: data.email,
    foundingDate: data.foundingDate,
    sameAs: data.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: data.contactPoint.contactType,
      email: data.contactPoint.email,
      availableLanguage: data.contactPoint.availableLanguage,
      areaServed: data.contactPoint.areaServed,
    },
  }
}

export function generateWebsiteSchema(data: WebsiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: data.url,
    name: data.name,
    description: data.description,
    inLanguage: data.inLanguage,
    potentialAction: {
      "@type": data.potentialAction.type,
      target: data.potentialAction.target,
      "query-input": data.potentialAction.queryInput,
    },
  }
}

export function generateBreadcrumbSchema(data: BreadcrumbData) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: data.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleSchema(article: {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  author: string
  image: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Products VS",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.productsvs.com"}/images/logo.png`,
      },
    },
    image: article.image,
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

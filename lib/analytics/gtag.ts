// Google Analytics 4 integration

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events
export const trackComparisonView = (slug: string, title: string) => {
  event({
    action: "view_comparison",
    category: "Comparison",
    label: `${slug} - ${title}`,
  })
}

export const trackSearch = (query: string) => {
  event({
    action: "search",
    category: "Search",
    label: query,
  })
}

export const trackAIBattleGeneration = (productA: string, productB: string) => {
  event({
    action: "ai_battle_generate",
    category: "AI Battle",
    label: `${productA} vs ${productB}`,
  })
}

export const trackShare = (platform: string, comparisonSlug: string) => {
  event({
    action: "share",
    category: "Social",
    label: `${platform} - ${comparisonSlug}`,
  })
}

export const trackFavorite = (action: "add" | "remove", comparisonSlug: string) => {
  event({
    action: `favorite_${action}`,
    category: "Engagement",
    label: comparisonSlug,
  })
}

export const trackError = (errorMessage: string, errorLocation: string) => {
  event({
    action: "error",
    category: "Error",
    label: `${errorLocation}: ${errorMessage}`,
  })
}

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

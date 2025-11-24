export const adsenseConfig = {
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXXXX",

  slots: {
    comparison_header: process.env.NEXT_PUBLIC_ADSENSE_COMPARISON_HEADER || "1234567890",
    comparison_sidebar: process.env.NEXT_PUBLIC_ADSENSE_COMPARISON_SIDEBAR || "2345678901",
    comparison_infeed: process.env.NEXT_PUBLIC_ADSENSE_COMPARISON_INFEED || "3456789012",
    comparison_footer: process.env.NEXT_PUBLIC_ADSENSE_COMPARISON_FOOTER || "4567890123",
    mobile_sticky: process.env.NEXT_PUBLIC_ADSENSE_MOBILE_STICKY || "5678901234",
    homepage_banner: process.env.NEXT_PUBLIC_ADSENSE_HOMEPAGE_BANNER || "6789012345",
  },

  density: {
    comparison: 4,
    homepage: 3,
  },

  // Auto ads configuration
  autoAds: {
    enabled: true,
    pageLevel: true,
  },

  // Ad refresh settings (for engaged users)
  refresh: {
    enabled: true,
    interval: 60000, // 60 seconds
    maxRefreshes: 3,
  },
}

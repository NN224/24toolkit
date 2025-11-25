import type { Metadata } from "next"
import HomePageClient from "./HomePageClient"

export const metadata: Metadata = {
  title: "Products VS - Compare Everything | Smart Comparisons in English & Arabic",
  description:
    "Compare products, services, and lifestyle choices with Products VS. 70+ detailed comparisons in English and Arabic. Make informed decisions faster with AI-powered insights!",
  keywords: "product comparison, vs, compare products, product reviews, buying guide, comparison tool, AI comparison",
  openGraph: {
    title: "Products VS - Compare Everything",
    description:
      "70+ detailed comparisons to help you make informed decisions. AI-powered insights in English & Arabic.",
    url: "https://productsvs.com",
    siteName: "Products VS",
    type: "website",
    images: [
      {
        url: "https://productsvs.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Products VS - Smart Comparisons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products VS - Compare Everything",
    description: "70+ detailed comparisons to help you make informed decisions",
    images: ["https://productsvs.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://productsvs.com",
  },
}

export default function HomePage() {
  return <HomePageClient />
}

import type { Metadata } from "next"
import AboutPageClient from "./_components/about-page-client"

export const metadata: Metadata = {
  title: "About Us - Products VS | Your Trusted Comparison Platform",
  description:
    "Learn about Products VS, your trusted source for comprehensive product and service comparisons in English and Arabic. Helping millions make informed decisions.",
  openGraph: {
    title: "About Products VS",
    description: "Your trusted source for comprehensive comparisons in English and Arabic",
    url: "https://productsvs.com/about",
    siteName: "Products VS",
    type: "website",
  },
  alternates: {
    canonical: "https://productsvs.com/about",
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}

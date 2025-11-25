import type { Metadata } from "next"
import QuickDecisionClient from "./_components/quick-decision-client"

export const metadata: Metadata = {
  title: "Quick Decision Tool - Find Your Perfect Match | Products VS",
  description:
    "Answer 5 quick questions and get personalized product recommendations in 60 seconds. Smart comparison tool for faster decisions.",
  openGraph: {
    title: "Quick Decision Tool - Products VS",
    description: "Get personalized product recommendations in 60 seconds",
    type: "website",
  },
}

export default function QuickDecisionPage() {
  return <QuickDecisionClient />
}

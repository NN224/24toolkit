import type { Metadata } from "next"
import ComparisonClientPage from "./ComparisonClientPage"
import { getComparisonBySlug, getAllComparisonSlugs } from "@/lib/comparisons-data"
import { getComparisonBySlug as getDynamicComparison, incrementViews } from "@/lib/db/comparisons"

export async function generateStaticParams() {
  const slugs = getAllComparisonSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Try static first
  let comparison = getComparisonBySlug(params.slug)
  let isPendingComparison = false

  if (!comparison) {
    const dynamicComp = await getDynamicComparison(params.slug, ["approved", "pending"])
    if (dynamicComp) {
      comparison = dynamicComp
      isPendingComparison = dynamicComp.status === "pending"
    }
  }

  if (!comparison) {
    return {
      title: "Comparison Not Found | Products VS",
      description: "The comparison you're looking for doesn't exist yet. Try generating it with our AI Battle tool!",
    }
  }

  return {
    title: `${comparison.title} | Products VS`,
    description: comparison.description,
    keywords: `${comparison.optionA.name}, ${comparison.optionB.name}, comparison, ${comparison.category}`,
    robots: isPendingComparison
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      type: "article",
      siteName: "Products VS",
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.description,
    },
    alternates: {
      canonical: `https://productsvs.com/comparison/${params.slug}`,
    },
  }
}

export default async function ComparisonPage({ params }: { params: { slug: string } }) {
  let comparison = getComparisonBySlug(params.slug)
  let source: "static" | "dynamic" = "static"
  let isPending = false

  if (!comparison) {
    const dynamicComp = await getDynamicComparison(params.slug, ["approved", "pending"])
    if (dynamicComp) {
      comparison = dynamicComp
      source = "dynamic"
      isPending = dynamicComp.status === "pending"
      // Only increment views for approved comparisons (pending don't need views tracking)
      if (!isPending) {
        await incrementViews(params.slug)
      }
    }
  }

  return <ComparisonClientPage params={params} initialComparison={comparison} source={source} isPending={isPending} />
}

import type { Metadata } from "next"
import CategoryPageClient from "./client"

const categoryInfo: Record<string, { title: string; description: string; icon: string }> = {
  technology: {
    title: "Technology Comparisons",
    description:
      "Compare the latest tech products, gadgets, and services. From smartphones to laptops, gaming consoles to software platforms.",
    icon: "💻",
  },
  "entertainment-streaming": {
    title: "Entertainment & Streaming Comparisons",
    description:
      "Compare streaming services, music platforms, and entertainment options. Find the best service for your needs.",
    icon: "🎬",
  },
  "travel-accommodation": {
    title: "Travel & Accommodation Comparisons",
    description: "Compare travel booking platforms, accommodation options, and transportation services.",
    icon: "✈️",
  },
  "lifestyle-health": {
    title: "Lifestyle & Health Comparisons",
    description: "Compare diets, fitness options, and lifestyle choices. Make informed decisions for your wellbeing.",
    icon: "🏃",
  },
  "ecommerce-shopping": {
    title: "E-commerce & Shopping Comparisons",
    description: "Compare online marketplaces, shopping platforms, and e-commerce solutions.",
    icon: "🛒",
  },
  automotive: {
    title: "Automotive Comparisons",
    description: "Compare vehicles, car buying options, and automotive technologies.",
    icon: "🚗",
  },
  "finance-cryptocurrency": {
    title: "Finance & Cryptocurrency Comparisons",
    description: "Compare investment options, cryptocurrencies, and financial products.",
    icon: "💰",
  },
  "food-beverages": {
    title: "Food & Beverages Comparisons",
    description: "Compare food choices, beverages, and dietary options.",
    icon: "☕",
  },
}

export async function generateStaticParams() {
  return Object.keys(categoryInfo).map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = categoryInfo[params.category]

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.title} | Products VS`,
    description: category.description,
    openGraph: {
      title: category.title,
      description: category.description,
      url: `https://productsvs.com/category/${params.category}`,
    },
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categoryInfo[params.category]

  if (!category) {
    return <></> // This case should ideally not happen if generateStaticParams is correct, but good for safety.
  }

  return <CategoryPageClient category={category} params={params} />
}

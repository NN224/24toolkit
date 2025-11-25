import type { Metadata } from "next"
import PageLayout from "@/components/page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "All Comparisons - Products VS",
  description:
    "Browse all product and service comparisons. Technology, entertainment, lifestyle, and more. Make informed decisions with detailed analysis.",
}

export default function EnglishComparisonsPage() {
  return (
    <PageLayout currentPath="/en" locale="en">
      <section className="hero-section" style={{ padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>All Comparisons</h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "700px", margin: "0 auto" }}>
            Explore our comprehensive collection of detailed comparisons across multiple categories
          </p>
        </div>
      </section>

      <section style={{ padding: "60px 0" }}>
        <div className="container">
          {categories.map((category) => (
            <div key={category.id} style={{ marginBottom: "4rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                  paddingBottom: "1rem",
                  borderBottom: "2px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>{category.icon}</span>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>{category.name}</h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {category.comparisons.map((comparison) => (
                  <Link
                    key={comparison.slug}
                    href={`/comparison/${comparison.slug}`}
                    className="comparison-card"
                    style={{
                      background: "var(--bg-primary)",
                      padding: "1.5rem",
                      border: "2px solid var(--border)",
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem" }}>{comparison.title}</h3>
                    <p style={{ fontSize: "0.95rem", opacity: 0.7, marginBottom: "1rem", lineHeight: 1.6 }}>
                      {comparison.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>{comparison.views} views</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Read more →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}

const categories = [
  {
    id: "streaming",
    name: "Streaming Services",
    icon: "🎬",
    comparisons: [
      {
        slug: "netflix-vs-disney",
        title: "Netflix vs Disney Plus",
        description: "Compare content libraries, pricing, and exclusive features of these streaming giants.",
        views: "15.2K",
      },
      {
        slug: "netflix-vs-hbo",
        title: "Netflix vs HBO Max",
        description: "Which streaming service offers better original content and value for money?",
        views: "12.8K",
      },
      {
        slug: "netflix-vs-prime",
        title: "Netflix vs Amazon Prime Video",
        description: "Detailed comparison of content, pricing, and additional benefits.",
        views: "18.5K",
      },
      {
        slug: "hulu-vs-netflix",
        title: "Hulu vs Netflix",
        description: "Compare streaming quality, content variety, and subscription options.",
        views: "10.3K",
      },
      {
        slug: "disney-plus-vs-hbo-max",
        title: "Disney Plus vs HBO Max",
        description: "Family-friendly content vs premium originals - which is better?",
        views: "9.7K",
      },
      {
        slug: "cable-vs-streaming",
        title: "Cable TV vs Streaming Services",
        description: "Is it time to cut the cord? Compare costs and benefits.",
        views: "14.1K",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: "📱",
    comparisons: [
      {
        slug: "iphone-vs-samsung",
        title: "iPhone vs Samsung Galaxy",
        description: "The ultimate smartphone showdown - iOS vs Android flagship devices.",
        views: "25.4K",
      },
      {
        slug: "android-vs-ios",
        title: "Android vs iOS",
        description: "Operating system comparison covering features, security, and ecosystem.",
        views: "22.1K",
      },
      {
        slug: "mac-vs-pc",
        title: "Mac vs PC",
        description: "Which computer is right for you? Compare performance, price, and software.",
        views: "19.8K",
      },
      {
        slug: "windows-vs-mac",
        title: "Windows vs macOS",
        description: "Operating system battle for desktop and laptop users.",
        views: "17.3K",
      },
      {
        slug: "playstation-vs-xbox",
        title: "PlayStation 5 vs Xbox Series X",
        description: "Next-gen gaming console comparison - specs, exclusives, and value.",
        views: "21.6K",
      },
    ],
  },
  {
    id: "travel",
    name: "Travel & Accommodation",
    icon: "✈️",
    comparisons: [
      {
        slug: "airbnb-vs-hotel",
        title: "Airbnb vs Hotels",
        description: "Compare costs, amenities, and experiences for your next trip.",
        views: "13.2K",
      },
      {
        slug: "uber-vs-lyft",
        title: "Uber vs Lyft",
        description: "Ride-sharing services compared - pricing, availability, and features.",
        views: "11.5K",
      },
      {
        slug: "booking-vs-expedia",
        title: "Booking.com vs Expedia",
        description: "Which travel booking platform offers better deals and service?",
        views: "9.8K",
      },
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Health",
    icon: "🏃",
    comparisons: [
      {
        slug: "keto-vs-paleo",
        title: "Keto vs Paleo Diet",
        description: "Compare these popular diets for weight loss and health benefits.",
        views: "16.7K",
      },
      {
        slug: "coffee-vs-tea",
        title: "Coffee vs Tea",
        description: "Health benefits, caffeine content, and cultural significance compared.",
        views: "8.9K",
      },
      {
        slug: "gym-vs-home",
        title: "Gym vs Home Workouts",
        description: "Which fitness approach is more effective and cost-efficient?",
        views: "12.4K",
      },
    ],
  },
  {
    id: "shopping",
    name: "E-commerce & Shopping",
    icon: "🛒",
    comparisons: [
      {
        slug: "amazon-vs-walmart",
        title: "Amazon vs Walmart",
        description: "Online retail giants compared - pricing, delivery, and product selection.",
        views: "14.9K",
      },
      {
        slug: "shopify-vs-wix",
        title: "Shopify vs Wix",
        description: "E-commerce platform comparison for building your online store.",
        views: "10.2K",
      },
    ],
  },
]

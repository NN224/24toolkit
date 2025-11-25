import type { Metadata } from "next"
import PageLayout from "@/components/page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "جميع المقارنات - Products VS",
  description:
    "تصفح جميع مقارنات المنتجات والخدمات. التكنولوجيا، الترفيه، نمط الحياة، والمزيد. اتخذ قرارات مستنيرة مع تحليل مفصل.",
}

export default function ArabicComparisonsPage() {
  return (
    <PageLayout currentPath="/ar" locale="ar">
      <div dir="rtl">
        <section className="hero-section" style={{ padding: "60px 0", textAlign: "center" }}>
          <div className="container">
            <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>جميع المقارنات</h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "700px", margin: "0 auto" }}>
              استكشف مجموعتنا الشاملة من المقارنات التفصيلية عبر فئات متعددة
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
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                        {comparison.title}
                      </h3>
                      <p style={{ fontSize: "0.95rem", opacity: 0.7, marginBottom: "1rem", lineHeight: 1.6 }}>
                        {comparison.description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>{comparison.views} مشاهدة</span>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>← اقرأ المزيد</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

const categories = [
  {
    id: "streaming",
    name: "خدمات البث",
    icon: "🎬",
    comparisons: [
      {
        slug: "netflix-vs-disney",
        title: "نتفليكس مقابل ديزني بلس",
        description: "قارن مكتبات المحتوى والأسعار والميزات الحصرية لعمالقة البث هؤلاء.",
        views: "15.2K",
      },
      {
        slug: "netflix-vs-hbo",
        title: "نتفليكس مقابل HBO Max",
        description: "أي خدمة بث تقدم محتوى أصلي أفضل وقيمة مقابل المال؟",
        views: "12.8K",
      },
      {
        slug: "netflix-vs-prime",
        title: "نتفليكس مقابل أمازون برايم فيديو",
        description: "مقارنة تفصيلية للمحتوى والأسعار والفوائد الإضافية.",
        views: "18.5K",
      },
      {
        slug: "hulu-vs-netflix",
        title: "هولو مقابل نتفليكس",
        description: "قارن جودة البث وتنوع المحتوى وخيارات الاشتراك.",
        views: "10.3K",
      },
      {
        slug: "disney-plus-vs-hbo-max",
        title: "ديزني بلس مقابل HBO Max",
        description: "محتوى عائلي مقابل أعمال أصلية متميزة - أيهما أفضل؟",
        views: "9.7K",
      },
      {
        slug: "cable-vs-streaming",
        title: "التلفزيون الكابلي مقابل خدمات البث",
        description: "هل حان الوقت لقطع الكابل؟ قارن التكاليف والفوائد.",
        views: "14.1K",
      },
    ],
  },
  {
    id: "technology",
    name: "التكنولوجيا",
    icon: "📱",
    comparisons: [
      {
        slug: "iphone-vs-samsung",
        title: "آيفون مقابل سامسونج جالاكسي",
        description: "المواجهة النهائية للهواتف الذكية - أجهزة iOS مقابل Android الرائدة.",
        views: "25.4K",
      },
      {
        slug: "android-vs-ios",
        title: "أندرويد مقابل iOS",
        description: "مقارنة نظام التشغيل تغطي الميزات والأمان والنظام البيئي.",
        views: "22.1K",
      },
      {
        slug: "mac-vs-pc",
        title: "ماك مقابل PC",
        description: "أي كمبيوتر مناسب لك؟ قارن الأداء والسعر والبرامج.",
        views: "19.8K",
      },
      {
        slug: "windows-vs-mac",
        title: "ويندوز مقابل macOS",
        description: "معركة نظام التشغيل لمستخدمي أجهزة الكمبيوتر المكتبية والمحمولة.",
        views: "17.3K",
      },
      {
        slug: "playstation-vs-xbox",
        title: "بلايستيشن 5 مقابل Xbox Series X",
        description: "مقارنة أجهزة الألعاب من الجيل التالي - المواصفات والحصريات والقيمة.",
        views: "21.6K",
      },
    ],
  },
  {
    id: "travel",
    name: "السفر والإقامة",
    icon: "✈️",
    comparisons: [
      {
        slug: "airbnb-vs-hotel",
        title: "Airbnb مقابل الفنادق",
        description: "قارن التكاليف والمرافق والتجارب لرحلتك القادمة.",
        views: "13.2K",
      },
      {
        slug: "uber-vs-lyft",
        title: "أوبر مقابل ليفت",
        description: "مقارنة خدمات مشاركة الرحلات - التسعير والتوفر والميزات.",
        views: "11.5K",
      },
      {
        slug: "booking-vs-expedia",
        title: "Booking.com مقابل Expedia",
        description: "أي منصة حجز سفر تقدم صفقات وخدمة أفضل؟",
        views: "9.8K",
      },
    ],
  },
  {
    id: "lifestyle",
    name: "نمط الحياة والصحة",
    icon: "🏃",
    comparisons: [
      {
        slug: "keto-vs-paleo",
        title: "حمية كيتو مقابل باليو",
        description: "قارن هذه الحميات الشائعة لفقدان الوزن والفوائد الصحية.",
        views: "16.7K",
      },
      {
        slug: "coffee-vs-tea",
        title: "القهوة مقابل الشاي",
        description: "الفوائد الصحية ومحتوى الكافيين والأهمية الثقافية مقارنة.",
        views: "8.9K",
      },
      {
        slug: "gym-vs-home",
        title: "صالة الألعاب الرياضية مقابل التمارين المنزلية",
        description: "أي نهج للياقة البدنية أكثر فعالية وفعالية من حيث التكلفة؟",
        views: "12.4K",
      },
    ],
  },
  {
    id: "shopping",
    name: "التجارة الإلكترونية والتسوق",
    icon: "🛒",
    comparisons: [
      {
        slug: "amazon-vs-walmart",
        title: "أمازون مقابل وول مارت",
        description: "مقارنة عمالقة التجزئة عبر الإنترنت - التسعير والتوصيل واختيار المنتجات.",
        views: "14.9K",
      },
      {
        slug: "shopify-vs-wix",
        title: "Shopify مقابل Wix",
        description: "مقارنة منصات التجارة الإلكترونية لبناء متجرك عبر الإنترنت.",
        views: "10.2K",
      },
    ],
  },
]

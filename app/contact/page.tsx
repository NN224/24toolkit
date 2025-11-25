import type { Metadata } from "next"
import ContactPageClient from "./_components/contact-page-client"

export const metadata: Metadata = {
  title: "Contact Us - Products VS | Get in Touch",
  description:
    "Have questions or suggestions? Contact the Products VS team. We'd love to hear from you and typically respond within 24-48 hours.",
  openGraph: {
    title: "Contact Products VS",
    description: "Get in touch with our team for inquiries, partnerships, or feedback",
    url: "https://productsvs.com/contact",
    siteName: "Products VS",
    type: "website",
  },
  alternates: {
    canonical: "https://productsvs.com/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}

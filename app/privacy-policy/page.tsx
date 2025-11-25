import type { Metadata } from "next"
import PrivacyPolicyClient from "./privacy-policy-client"

export const metadata: Metadata = {
  title: "Privacy Policy - Products VS",
  description: "Privacy Policy for Products VS. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}

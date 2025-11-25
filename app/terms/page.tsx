import type { Metadata } from "next"
import TermsClient from "./terms-client"

export const metadata: Metadata = {
  title: "Terms of Service - Products VS",
  description: "Terms of Service for Products VS. Read our terms and conditions for using our comparison website.",
}

export default function TermsPage() {
  return <TermsClient />
}

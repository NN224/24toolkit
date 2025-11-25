import type { Metadata } from "next"
import AdminLoginClient from "./_components/admin-login-client"

export const metadata: Metadata = {
  title: "Admin Login - Products VS",
  description: "Admin login page for Products VS management dashboard.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return <AdminLoginClient />
}

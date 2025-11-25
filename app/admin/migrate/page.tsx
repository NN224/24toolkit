import type { Metadata } from "next"
import MigrateClient from "./_components/migrate-client"

export const metadata: Metadata = {
  title: "Data Migration Tool - Admin",
  description: "Migrate product data to the database",
}

export default function MigratePage() {
  return <MigrateClient />
}

import type React from "react"
import Navigation from "./navigation"
import Footer from "./footer"

interface PageLayoutProps {
  children: React.ReactNode
  currentPath?: string
  locale?: "en" | "ar"
}

export default function PageLayout({ children, currentPath, locale }: PageLayoutProps) {
  return (
    <>
      <Navigation currentPath={currentPath} locale={locale} />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </>
  )
}

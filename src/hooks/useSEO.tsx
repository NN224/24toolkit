import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  keywords?: string
}

/**
 * A React component that declaratively manages document head tags.
 * Uses react-helmet-async for SPA-safe meta tag management.
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   return (
 *     <>
 *       <SEO 
 *         title="Page Title | 24Toolkit"
 *         description="Page description"
 *         keywords="keyword1, keyword2"
 *       />
 *       <div>Page content</div>
 *     </>
 *   )
 * }
 * ```
 */
export function SEO({ title, description, keywords }: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter Card */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}

/**
 * Hook wrapper for backwards compatibility.
 * Prefer using the <SEO /> component directly in JSX.
 * 
 * @deprecated Use <SEO /> component instead for cleaner JSX
 */
export function useSEO(props: SEOProps) {
  // Return a component to be rendered, maintaining hook API
  // Users should migrate to using <SEO /> component directly
  return { SEOComponent: () => <SEO {...props} /> }
}

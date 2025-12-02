import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  canonicalPath?: string
  image?: string
}

const BASE_URL = 'https://24toolkit.com'

/**
 * Update or create a meta tag in the document head.
 * This is a safe DOM manipulation approach that updates existing tags
 * rather than appending duplicates.
 */
function updateMetaTag(attribute: 'name' | 'property', value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * Update or create canonical link tag
 */
function updateCanonicalLink(url: string) {
  let element = document.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

/**
 * A React component that declaratively manages document head tags.
 * Uses React 19's native support for document metadata.
 * 
 * In React 19, <title> and <meta> tags rendered anywhere in the component
 * tree are automatically hoisted to the document <head>.
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
export function SEO({ title, description, keywords, canonicalPath, image }: SEOProps) {
  const location = useLocation()
  
  useEffect(() => {
    // Update document title
    document.title = title
    
    // Build canonical URL
    const path = canonicalPath || location.pathname
    const canonicalUrl = `${BASE_URL}${path === '/' ? '' : path}`
    
    // Build image URL
    const imageUrl = image ? `${BASE_URL}${image}` : `${BASE_URL}/og-image.png`
    
    // Update canonical link
    updateCanonicalLink(canonicalUrl)
    
    // Update meta tags (these update existing tags, not append)
    updateMetaTag('name', 'description', description)
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords)
    }
    
    // Open Graph tags
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:url', canonicalUrl)
    updateMetaTag('property', 'og:image', imageUrl)
    updateMetaTag('property', 'og:image:width', '2848')
    updateMetaTag('property', 'og:image:height', '1504')
    updateMetaTag('property', 'og:image:type', 'image/png')
    
    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', title)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', imageUrl)
  }, [title, description, keywords, canonicalPath, image, location.pathname])
  
  return null
}

/**
 * Hook for managing SEO meta tags with automatic canonical URL.
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   useSEO({
 *     title: 'Page Title | 24Toolkit',
 *     description: 'Page description',
 *     keywords: 'keyword1, keyword2'
 *   })
 *   return <div>Page content</div>
 * }
 * ```
 */
export function useSEO({ title, description, keywords, canonicalPath, image }: SEOProps) {
  const location = useLocation()
  
  useEffect(() => {
    document.title = title
    
    // Build canonical URL
    const path = canonicalPath || location.pathname
    const canonicalUrl = `${BASE_URL}${path === '/' ? '' : path}`
    
    // Build image URL
    const imageUrl = image ? `${BASE_URL}${image}` : `${BASE_URL}/og-image.png`
    
    // Update canonical link
    updateCanonicalLink(canonicalUrl)
    
    updateMetaTag('name', 'description', description)
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords)
    }
    
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:url', canonicalUrl)
    updateMetaTag('property', 'og:image', imageUrl)
    updateMetaTag('property', 'og:image:width', '2848')
    updateMetaTag('property', 'og:image:height', '1504')
    updateMetaTag('property', 'og:image:type', 'image/png')
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', title)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', imageUrl)
  }, [title, description, keywords, canonicalPath, image, location.pathname])
}

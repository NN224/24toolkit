import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarBlank, Clock, User, Share, BookmarkSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSEO } from '@/hooks/useSEO'

export default function ImageOptimizationGuide() {
  useSEO({
    title: 'The Complete Guide to Image Optimization for Web | 24Toolkit Blog',
    description: 'Learn the best practices for compressing and optimizing images without losing quality. Covers formats, compression techniques, and tools.',
    keywords: ['image optimization', 'web performance', 'image compression', 'WebP', 'AVIF'],
    canonicalPath: '/blog/image-optimization-guide'
  })

  return (
    <article className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Back to Blog
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop" 
            alt="Image Optimization"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="mb-3 bg-blue-500/90">Web Development</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              The Complete Guide to Image Optimization for Web
            </h1>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>Mike Chen</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarBlank size={16} />
            <span>November 28, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>7 min read</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" className="gap-1">
              <Share size={16} />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <BookmarkSimple size={16} />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Images often account for the majority of a webpage's total size. Properly optimizing them 
            can dramatically improve your site's loading speed, user experience, and search engine rankings.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Why Image Optimization Matters</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Studies show that a 1-second delay in page load time can result in a 7% reduction in conversions. 
            With images being the heaviest elements on most pages, optimizing them is one of the most impactful 
            improvements you can make.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 my-8">
            <div className="bg-card/50 border rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">53%</div>
              <div className="text-sm text-muted-foreground">of mobile users leave pages that take &gt;3s to load</div>
            </div>
            <div className="bg-card/50 border rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">70%</div>
              <div className="text-sm text-muted-foreground">average reduction with proper optimization</div>
            </div>
            <div className="bg-card/50 border rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">25%</div>
              <div className="text-sm text-muted-foreground">improvement in SEO rankings</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Choosing the Right Format</h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-3">JPEG</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Best for photographs and images with many colors. JPEG uses lossy compression, meaning some 
            quality is sacrificed for smaller file sizes. Ideal quality setting: 70-85%.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">PNG</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Perfect for images requiring transparency or those with text, logos, and sharp edges. 
            PNG uses lossless compression, maintaining quality but resulting in larger files.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">WebP</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The modern choice for web images. WebP provides superior compression (25-35% smaller than JPEG) 
            while supporting both lossy and lossless compression, plus transparency. Now supported by 97% of browsers.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">AVIF</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The newest format offering even better compression than WebP (up to 50% smaller). Browser support 
            is growing rapidly, making it a great choice for progressive enhancement.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Optimization Techniques</h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-3">1. Resize Images</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Never upload images larger than needed. If your container is 800px wide, there's no need 
            for a 4000px image. Use srcset for responsive images.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">2. Compress Without Quality Loss</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Modern compression algorithms can reduce file sizes by 50-70% with virtually no visible 
            quality difference. Tools like our Image Compressor make this easy.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">3. Lazy Loading</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Implement lazy loading to defer loading images until they're about to enter the viewport. 
            This significantly improves initial page load time.
          </p>

          <div className="bg-card/50 border rounded-xl p-6 my-8">
            <h4 className="font-semibold mb-3">🚀 Quick Optimization Checklist</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Choose the right format for each image type</li>
              <li>✓ Resize to actual display dimensions</li>
              <li>✓ Compress using quality 70-85% for JPEG</li>
              <li>✓ Implement lazy loading for below-fold images</li>
              <li>✓ Use CDN for faster delivery</li>
              <li>✓ Add descriptive alt text for accessibility & SEO</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Measuring Results</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Use tools like Google PageSpeed Insights, Lighthouse, or WebPageTest to measure your 
            optimization efforts. Pay attention to metrics like Largest Contentful Paint (LCP) 
            and Cumulative Layout Shift (CLS).
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Optimize Your Images Now</h3>
          <p className="text-muted-foreground mb-6">
            Try our free Image Compressor tool to reduce file sizes without losing quality.
          </p>
          <Link to="/tools/image-compressor">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500">
              Open Image Compressor
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t flex justify-between">
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={16} />
            All Articles
          </Link>
        </div>
      </div>
    </article>
  )
}

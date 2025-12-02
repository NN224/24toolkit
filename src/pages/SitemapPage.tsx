import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { allTools } from '@/lib/tools-data'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function SitemapPage() {
  const { t } = useTranslation()
  // Set SEO metadata for sitemap page
  const sitemapMetadata = getPageMetadata('sitemap')
  useSEO(sitemapMetadata)

  const staticPages = [
    { title: t('nav.home'), path: '/' },
    { title: t('nav.about'), path: '/about' },
    { title: t('nav.contact'), path: '/contact' },
    { title: t('nav.privacy'), path: '/privacy-policy' },
    { title: t('nav.terms'), path: '/terms-of-service' },
  ]

  const categories = [
    { id: 'ai', name: t('categories.ai') },
    { id: 'text', name: t('categories.text') },
    { id: 'dev', name: t('categories.developer') },
    { id: 'image', name: t('categories.image') },
    { id: 'security', name: t('categories.security') },
    { id: 'calc', name: t('categories.calculators') },
    { id: 'fun', name: t('categories.fun') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft size={16} className="ltr:mr-2 rtl:ml-2 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 transition-transform" />
              {t('common.backToHome')}
            </Button>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              {t('sitemap.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('sitemap.subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-2xl font-semibold text-accent mb-4">{t('sitemap.mainPages')}</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {staticPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-accent/50 transition-all"
                  >
                    <span className="text-foreground hover:text-accent">{page.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {categories.map((category) => {
              const categoryTools = allTools.filter(tool => tool.category === category.id)
              
              if (categoryTools.length === 0) return null

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-6 border border-border/50"
                >
                  <h2 className="text-2xl font-semibold text-accent mb-4 flex items-center gap-2">
                    {category.name}
                    {category.id === 'ai' && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full">
                        AI
                      </span>
                    )}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryTools.map((tool) => {
                      const Icon = tool.icon
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-accent/50 transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
                            <span className="text-sm text-foreground group-hover:text-accent transition-colors">
                              {tool.title}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('sitemap.total', { tools: allTools.length, pages: staticPages.length })}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

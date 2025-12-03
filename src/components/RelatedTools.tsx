import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { allTools, type Tool } from '@/lib/tools-data'
import { ArrowRight } from '@phosphor-icons/react'

interface RelatedToolsProps {
  currentToolId: string
  category?: string
  limit?: number
}

/**
 * RelatedTools component displays related tools to improve internal linking.
 * Shows tools from the same category or all categories if not specified.
 */
export function RelatedTools({ currentToolId, category, limit = 6 }: RelatedToolsProps) {
  const { t, i18n } = useTranslation()

  // Get related tools - prioritize same category, then others
  let relatedTools: Tool[] = []
  
  if (category) {
    // Get tools from same category first
    const sameCategory = allTools
      .filter(tool => tool.id !== currentToolId && tool.category === category)
    
    // If we don't have enough, add tools from other categories
    if (sameCategory.length < limit) {
      const otherCategories = allTools
        .filter(tool => tool.id !== currentToolId && tool.category !== category)
      relatedTools = [...sameCategory, ...otherCategories].slice(0, limit)
    } else {
      relatedTools = sameCategory.slice(0, limit)
    }
  } else {
    // No category specified, show any related tools
    relatedTools = allTools
      .filter(tool => tool.id !== currentToolId)
      .slice(0, limit)
  }

  if (relatedTools.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-12 border-t border-border/50">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {t('tools.common.relatedTools', { defaultValue: 'Related Tools' })}
        </h2>
        <p className="text-muted-foreground">
          {t('tools.common.exploreMore', { defaultValue: 'Explore more tools you might find useful' })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTools.map((tool) => {
          const Icon = tool.icon
          const toolTitle = i18n.language === 'ar' && tool.titleAr ? tool.titleAr : tool.title
          const toolDescription = i18n.language === 'ar' && tool.descriptionAr ? tool.descriptionAr : tool.description

          return (
            <Link 
              key={tool.id} 
              to={tool.path}
              className="group"
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div 
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
                    >
                      <Icon size={20} weight="bold" className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base group-hover:text-accent transition-colors line-clamp-1">
                        {toolTitle}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 mt-1">
                        {toolDescription}
                      </CardDescription>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" 
                    />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <Link 
          to="/sitemap" 
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        >
          {t('tools.common.viewAllTools', { defaultValue: 'View all tools' })}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

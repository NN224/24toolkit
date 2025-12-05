import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Fire, TrendUp } from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { allTools, getToolTitle, getToolDescription } from '@/lib/tools-data'
import { useToolAnalytics } from '@/hooks/useToolAnalytics'

export function PopularTools() {
  const { t, i18n } = useTranslation()
  const { mostUsedTools } = useToolAnalytics()

  // Get tool objects for the most used tool IDs
  const popularToolsList = useMemo(() => {
    return mostUsedTools
      .map(usage => {
        const tool = allTools.find(t => t.id === usage.toolId)
        return tool ? { ...tool, usageCount: usage.usageCount } : null
      })
      .filter(Boolean)
      .slice(0, 6)
  }, [mostUsedTools])

  if (popularToolsList.length === 0) {
    return null
  }

  return (
    <section className="mb-16 sm:mb-20">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 4px 20px rgba(249,115,22,0.3)' }}
          >
            <Fire size={24} weight="fill" className="text-white sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-2">
              {t('popularTools.title')}
              <TrendUp size={24} weight="bold" className="text-orange-500 sm:w-7 sm:h-7" />
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              {t('popularTools.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {popularToolsList.map((tool: any, index: number) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={tool.path} className="group block h-full">
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all relative overflow-hidden card-hover-lift shine-effect">
                  {/* Usage badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <Fire size={12} weight="fill" />
                    {tool.usageCount} {t('popularTools.uses')}
                  </div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                      >
                        <Icon size={24} weight="bold" className="text-white sm:w-7 sm:h-7" />
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">
                      {getToolTitle(tool, i18n.language)}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      {getToolDescription(tool, i18n.language)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

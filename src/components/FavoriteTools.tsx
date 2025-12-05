import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, HeartBreak, Star } from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { allTools, getToolTitle, getToolDescription } from '@/lib/tools-data'
import { useFavoriteTools } from '@/hooks/useFavoriteTools'

export function FavoriteTools() {
  const { t, i18n } = useTranslation()
  const { favorites, removeFavorite } = useFavoriteTools()

  // Get tool objects for favorite IDs
  const favoriteToolsList = useMemo(() => {
    return favorites
      .map(id => allTools.find(t => t.id === id))
      .filter(Boolean)
  }, [favorites])

  if (favoriteToolsList.length === 0) {
    return null
  }

  return (
    <section className="mb-16 sm:mb-20">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
          >
            <Heart size={24} weight="fill" className="text-white sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-2">
              {t('favorites.title')}
              <Star size={24} weight="fill" className="text-yellow-500 sm:w-7 sm:h-7" />
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              {t('favorites.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {favoriteToolsList.map((tool: any, index: number) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border border-white/10 hover:border-pink-500/50 transition-all relative overflow-hidden card-hover-lift shine-effect group">
                {/* Remove from favorites button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                  onClick={(e) => {
                    e.preventDefault()
                    removeFavorite(tool.id)
                  }}
                >
                  <HeartBreak size={20} weight="fill" className="text-red-500" />
                </Button>
                
                <Link to={tool.path} className="block h-full">
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                      >
                        <Icon size={24} weight="bold" className="text-white sm:w-7 sm:h-7" />
                      </div>
                      {tool.isAI && (
                        <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full">
                          {t('common.aiPowered')} ✨
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">
                      {getToolTitle(tool, i18n.language)}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      {getToolDescription(tool, i18n.language)}
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEasterEgg } from '@/hooks/use-easter-egg'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { AdBanner, AdSquare } from '@/components/GoogleAdSense'
import { 
  Sparkle,
  Brain,
  TextT,
  Code,
  ImageSquare,
  ShieldCheck,
  Calculator,
  Heart
} from '@phosphor-icons/react'
import { getToolsByCategory, categories, allTools, getToolTitle, getToolDescription, getCategoryTitle } from '@/lib/tools-data'
import { PopularTools } from '@/components/PopularTools'
import { FavoriteTools } from '@/components/FavoriteTools'
import { DailyTip } from '@/components/DailyTip'
import { DailyChallenges } from '@/components/DailyChallenges'
import { useFavoriteTools } from '@/hooks/useFavoriteTools'
import { useToolAnalytics } from '@/hooks/useToolAnalytics'

function ToolCard({ tool, showFavoriteButton = true }: { tool: any; showFavoriteButton?: boolean }) {
  const { i18n, t } = useTranslation()
  const { toggleFavorite, isFavorite } = useFavoriteTools()
  const Icon = tool.icon
  const favorite = isFavorite(tool.id)

  // Extract glow color from tool.color gradient
  const getGlowColor = (color: string) => {
    if (color.includes('purple')) return 'rgba(147, 51, 234, 0.4)'
    if (color.includes('blue')) return 'rgba(59, 130, 246, 0.4)'
    if (color.includes('green')) return 'rgba(34, 197, 94, 0.4)'
    if (color.includes('orange')) return 'rgba(249, 115, 22, 0.4)'
    if (color.includes('pink')) return 'rgba(236, 72, 153, 0.4)'
    if (color.includes('violet')) return 'rgba(139, 92, 246, 0.4)'
    if (color.includes('teal')) return 'rgba(20, 184, 166, 0.4)'
    return 'rgba(147, 51, 234, 0.4)'
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(tool.id)
  }

  return (
    <Link to={tool.path} className="group block h-full">
      <Card 
        className="h-full bg-card/50 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all relative overflow-hidden card-hover-lift shine-effect"
        style={{ 
          boxShadow: '0 0 8px rgba(109,40,217,0.2)',
          '--glow-color': getGlowColor(tool.color)
        } as React.CSSProperties}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-sky-500/0 group-hover:from-purple-500/5 group-hover:to-sky-500/5 transition-all duration-500" />
        
        {/* Favorite button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
              favorite 
                ? 'bg-pink-500/20 text-pink-500' 
                : 'bg-white/5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-pink-500'
            }`}
            aria-label={favorite ? t('favorites.remove') : t('favorites.add')}
          >
            <Heart size={18} weight={favorite ? 'fill' : 'regular'} />
          </button>
        )}
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            >
              <Icon size={28} weight="bold" className="text-white icon-animate transition-transform" />
            </div>
            {tool.isAI && (
              <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full animate-pulse-glow">
                {t('common.aiPowered')} ✨
              </span>
            )}
          </div>
          <CardTitle className="text-xl text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-sky-400 group-hover:bg-clip-text transition-all duration-300">
            {getToolTitle(tool, i18n.language)}
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
            {getToolDescription(tool, i18n.language)}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

function ToolSection({
  id,
  title,
  emoji,
  description,
  tools,
  accentColor,
  badge
}: {
  id: string
  title: string
  emoji: string
  description: string
  tools: any[]
  accentColor: string
  badge?: string
}) {
  return (
    <section id={id} className="mb-20 sm:mb-32 scroll-mt-24">
      <div className="mb-6 sm:mb-10">
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent hidden sm:block" />
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 bg-background w-full sm:w-fit sm:pr-8">
            <div 
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center flex-shrink-0`}
              style={{ boxShadow: '0 4px 20px rgba(109,40,217,0.3)' }}
            >
              <span className="text-2xl sm:text-3xl">{emoji}</span>
            </div>
            <div className="w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  {title}
                </h2>
                {badge && (
                  <span className="px-2 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm sm:text-lg mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [randomQuoteIndex] = useState(() => Math.floor(Math.random() * 5))
  const navigate = useNavigate()
  const { trackToolUsage } = useToolAnalytics()
  useEasterEgg()
  
  // Set SEO metadata for home page
  const homeMetadata = getPageMetadata('home')
  useSEO({ ...homeMetadata, canonicalPath: '/' })

  // Listen for tool usage from other pages
  useEffect(() => {
    const handleTrackToolUsage = (event: CustomEvent) => {
      trackToolUsage(event.detail.toolId)
    }
    window.addEventListener('track-tool-usage', handleTrackToolUsage as EventListener)
    return () => window.removeEventListener('track-tool-usage', handleTrackToolUsage as EventListener)
  }, [trackToolUsage])

  const handleRandomTool = () => {
    const randomTool = allTools[Math.floor(Math.random() * allTools.length)]
    navigate(randomTool.path)
  }

  const filteredTools = selectedFilter === 'all' 
    ? allTools 
    : getToolsByCategory(selectedFilter)

  return (
    <div className="py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-20">
          <div className="mb-2 sm:mb-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4 lg:mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-sky-500 bg-clip-text text-transparent animate-gradient-text">
                {t('home.title')}
              </span>
              <br />
              <span className="text-foreground animate-float" style={{ display: 'inline-block' }}>{t('home.titleHighlight')}</span>
            </h1>
          </div>
          
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto animate-scale-pop">
            {t('home.subtitle')}
          </p>

          <p className="text-xs text-accent/80 mb-4 sm:mb-6 lg:mb-10 italic hidden sm:block">
            ✨ {t(`home.quotes.${randomQuoteIndex}`)} ✨
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-10">
            <Button
              size="lg"
              onClick={handleRandomTool}
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500 text-white hover:opacity-90 transition-all px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold rounded-xl animate-pulse-glow hover:scale-105 active:scale-95 group"
              style={{ boxShadow: '0 0 30px rgba(109,40,217,0.5)' }}
            >
              <Sparkle size={18} weight="fill" className="ltr:mr-1.5 rtl:ml-1.5 animate-sparkle sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              {t('home.feelingLucky')}
              <span className="ltr:ml-1.5 rtl:mr-1.5 opacity-70 hidden sm:inline">🎲</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 mb-4 sm:mb-6 lg:mb-8">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white'
                  : 'bg-card/50 text-muted-foreground hover:text-foreground border border-white/10'
              }`}
            >
              {t('categories.all')}
            </button>
            {Object.entries(categories).map(([id, category]) => {
              const icons: Record<string, any> = {
                ai: Brain,
                text: TextT,
                dev: Code,
                image: ImageSquare,
                security: ShieldCheck,
                calc: Calculator,
                fun: Sparkle
              }
              const Icon = icons[id] || Sparkle
              return (
                <button
                  key={id}
                  onClick={() => setSelectedFilter(id)}
                  className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-medium transition-all flex items-center gap-1 sm:gap-1.5 lg:gap-2 ${
                    selectedFilter === id
                      ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white'
                      : 'bg-card/50 text-muted-foreground hover:text-foreground border border-white/10'
                  }`}
                >
                  <Icon size={12} weight="bold" className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">{getCategoryTitle(id as keyof typeof categories, i18n.language)}</span>
                  <span className="lg:hidden">{getCategoryTitle(id as keyof typeof categories, i18n.language).split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {selectedFilter === 'all' ? (
          <>
            {/* Daily Tip */}
            <DailyTip />

            {/* Daily Challenges */}
            <DailyChallenges />

            {/* Favorite Tools Section */}
            <FavoriteTools />

            {/* Popular Tools Section */}
            <PopularTools />

            {/* Ad after hero section */}
            <div className="mb-8 sm:mb-12 lg:mb-16 flex justify-center">
              <AdBanner className="w-full max-w-5xl" />
            </div>

            <ToolSection
              id="ai"
              title={t('categories.ai')}
              emoji="🤖"
              description={t('home.sections.ai')}
              tools={getToolsByCategory('ai')}
              accentColor="from-purple-500 to-pink-500"
              badge={t('common.aiPowered')}
            />

            <ToolSection
              id="text"
              title={t('categories.text')}
              emoji="📝"
              description={t('home.sections.text')}
              tools={getToolsByCategory('text')}
              accentColor="from-blue-500 to-cyan-500"
            />

            <ToolSection
              id="dev"
              title={t('categories.developer')}
              emoji="💻"
              description={t('home.sections.dev')}
              tools={getToolsByCategory('dev')}
              accentColor="from-green-500 to-emerald-500"
            />

            <ToolSection
              id="image"
              title={t('categories.image')}
              emoji="🖼️"
              description={t('home.sections.image')}
              tools={getToolsByCategory('image')}
              accentColor="from-orange-500 to-red-500"
            />

            {/* Ad between sections */}
            <div className="mb-20 flex justify-center">
              <AdSquare className="max-w-md" />
            </div>

            <ToolSection
              id="security"
              title={t('categories.security')}
              emoji="🔒"
              description={t('home.sections.security')}
              tools={getToolsByCategory('security')}
              accentColor="from-violet-500 to-purple-500"
            />

            <ToolSection
              id="calc"
              title={t('categories.calculators')}
              emoji="🔢"
              description={t('home.sections.calc')}
              tools={getToolsByCategory('calc')}
              accentColor="from-teal-500 to-cyan-500"
            />

            <ToolSection
              id="fun"
              title={t('categories.fun')}
              emoji="🎲"
              description={t('home.sections.fun')}
              tools={getToolsByCategory('fun')}
              accentColor="from-pink-500 to-rose-500"
            />

            {/* Ad at the end */}
            <div className="mt-16 mb-10 flex justify-center">
              <AdBanner className="w-full max-w-5xl" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {/* Ad for filtered view */}
            <div className="mt-16 flex justify-center">
              <AdBanner className="w-full max-w-5xl" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

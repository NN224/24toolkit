import { useState } from 'react'
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
  Calculator
} from '@phosphor-icons/react'
import { getToolsByCategory, categories, allTools, getToolTitle, getToolDescription, getCategoryTitle } from '@/lib/tools-data'

function ToolCard({ tool }: { tool: any }) {
  const { i18n, t } = useTranslation()
  const Icon = tool.icon

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
    <section id={id} className="mb-32 scroll-mt-24">
      <div className="mb-10">
        <div className="relative mb-8">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          <div className="relative flex items-center gap-4 mb-6 bg-background w-fit pr-8">
            <div 
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center`}
              style={{ boxShadow: '0 4px 20px rgba(109,40,217,0.3)' }}
            >
              <span className="text-3xl">{emoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-5xl font-bold text-foreground">
                  {title}
                </h2>
                {badge && (
                  <span className="px-4 py-1.5 text-sm font-bold bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-lg mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  useEasterEgg()
  
  // Set SEO metadata for home page
  const homeMetadata = getPageMetadata('home')
  useSEO({ ...homeMetadata, canonicalPath: '/' })

  const handleRandomTool = () => {
    const randomTool = allTools[Math.floor(Math.random() * allTools.length)]
    navigate(randomTool.path)
  }

  const filteredTools = selectedFilter === 'all' 
    ? allTools 
    : getToolsByCategory(selectedFilter)

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="mb-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-sky-500 bg-clip-text text-transparent animate-gradient-text">
                {t('home.title')}
              </span>
              <br />
              <span className="text-foreground animate-float" style={{ display: 'inline-block' }}>{t('home.titleHighlight')}</span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-scale-pop">
            {t('home.subtitle')}
          </p>

          <p className="text-sm text-accent/80 mb-10 italic">
            ✨ {t(`home.quotes.${randomQuoteIndex}`)} ✨
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Button
              size="lg"
              onClick={handleRandomTool}
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500 text-white hover:opacity-90 transition-all px-8 py-6 text-lg font-semibold rounded-xl animate-pulse-glow hover:scale-105 active:scale-95 group"
              style={{ boxShadow: '0 0 30px rgba(109,40,217,0.5)' }}
            >
              <Sparkle size={24} weight="fill" className="ltr:mr-2 rtl:ml-2 animate-sparkle" />
              {t('home.feelingLucky')}
              <span className="ltr:ml-2 rtl:mr-2 opacity-70">🎲</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedFilter === id
                      ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white'
                      : 'bg-card/50 text-muted-foreground hover:text-foreground border border-white/10'
                  }`}
                >
                  <Icon size={16} weight="bold" />
                  {getCategoryTitle(id as keyof typeof categories, i18n.language)}
                </button>
              )
            })}
          </div>
        </div>

        {selectedFilter === 'all' ? (
          <>
            {/* Ad after hero section */}
            <div className="mb-16 flex justify-center">
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

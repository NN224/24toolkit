import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { getToolsByCategory, categories, allTools } from '@/lib/tools-data'

const inspirationalQuotes = [
  "Innovation is a shortcut — 24Toolkit",
  "Work smarter, not harder — 24Toolkit",
  "Empowering creativity, one tool at a time",
  "Your productivity companion",
  "Simplifying complexity, amplifying possibilities"
]

function ToolCard({ tool }: { tool: any }) {
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
                AI ✨
              </span>
            )}
          </div>
          <CardTitle className="text-xl text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-sky-400 group-hover:bg-clip-text transition-all duration-300">
            {tool.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
            {tool.description}
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
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [randomQuote] = useState(() => inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)])
  const navigate = useNavigate()
  useEasterEgg()
  
  // Set SEO metadata for home page
  const homeMetadata = getPageMetadata('home')
  useSEO(homeMetadata)

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
                Your Complete
              </span>
              <br />
              <span className="text-foreground animate-float" style={{ display: 'inline-block' }}>Online Toolkit</span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-scale-pop">
            80+ free, powerful tools for developers, creators, and everyday users. 
            Everything runs in your browser - fast, secure, and private.
          </p>

          <p className="text-sm text-accent/80 mb-10 italic">
            ✨ {randomQuote} ✨
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Button
              size="lg"
              onClick={handleRandomTool}
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500 text-white hover:opacity-90 transition-all px-8 py-6 text-lg font-semibold rounded-xl animate-pulse-glow hover:scale-105 active:scale-95 group"
              style={{ boxShadow: '0 0 30px rgba(109,40,217,0.5)' }}
            >
              <Sparkle size={24} weight="fill" className="mr-2 animate-sparkle" />
              I'm Feeling Lucky
              <span className="ml-2 opacity-70">🎲</span>
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
              All Tools
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
                  {category.title}
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
              title="AI Tools"
              emoji="🤖"
              description="Powered by artificial intelligence"
              tools={getToolsByCategory('ai')}
              accentColor="from-purple-500 to-pink-500"
              badge="AI-Powered"
            />

            <ToolSection
              id="text"
              title="Text Tools"
              emoji="📝"
              description="Transform and analyze text"
              tools={getToolsByCategory('text')}
              accentColor="from-blue-500 to-cyan-500"
            />

            <ToolSection
              id="dev"
              title="Developer Tools"
              emoji="💻"
              description="Essential utilities for developers"
              tools={getToolsByCategory('dev')}
              accentColor="from-green-500 to-emerald-500"
            />

            <ToolSection
              id="image"
              title="Image Tools"
              emoji="🖼️"
              description="Edit and transform images"
              tools={getToolsByCategory('image')}
              accentColor="from-orange-500 to-red-500"
            />

            {/* Ad between sections */}
            <div className="mb-20 flex justify-center">
              <AdSquare className="max-w-md" />
            </div>

            <ToolSection
              id="security"
              title="Security Tools"
              emoji="🔒"
              description="Encryption and security utilities"
              tools={getToolsByCategory('security')}
              accentColor="from-violet-500 to-purple-500"
            />

            <ToolSection
              id="calc"
              title="Calculators"
              emoji="🔢"
              description="Converters and calculators"
              tools={getToolsByCategory('calc')}
              accentColor="from-teal-500 to-cyan-500"
            />

            <ToolSection
              id="fun"
              title="Fun Tools"
              emoji="🎲"
              description="Creative and everyday utilities"
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

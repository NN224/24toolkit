import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ClockCounterClockwise, 
  MagnifyingGlass, 
  Trash, 
  Copy, 
  Star,
  Download,
  Upload,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'
import { 
  getHistory,
  searchHistory,
  deleteHistoryEntry,
  clearHistory,
  toggleFavorite,
  getFavorites,
  getHistoryStats,
  exportHistory,
  type HistoryEntry
} from '@/lib/smart-history'
import { Link } from 'react-router-dom'
import { allTools } from '@/lib/tools-data'

export default function SmartHistory() {
  const { t } = useTranslation()
  const metadata = getPageMetadata('smart-history')
  useSEO({ ...metadata, canonicalPath: '/tools/smart-history' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.smartHistory.name')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites'>('all')
  const [isArabic, setIsArabic] = useState(false)
  const copyToClipboard = useCopyToClipboard()

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
    loadHistory()
  }, [])

  const loadHistory = () => {
    if (activeFilter === 'favorites') {
      setHistory(getFavorites())
    } else if (searchQuery) {
      setHistory(searchHistory(searchQuery))
    } else {
      setHistory(getHistory())
    }
  }

  useEffect(() => {
    loadHistory()
  }, [searchQuery, activeFilter])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleDelete = (entryId: string) => {
    if (confirm(t('tools.smartHistory.deleteConfirm'))) {
      deleteHistoryEntry(entryId)
      loadHistory()
      toast.success(t('tools.smartHistory.deleted'))
    }
  }

  const handleClearAll = () => {
    if (confirm(t('tools.smartHistory.clearConfirm'))) {
      clearHistory()
      loadHistory()
      toast.success(t('tools.smartHistory.historyCleared'))
    }
  }

  const handleToggleFavorite = (entryId: string) => {
    toggleFavorite(entryId)
    loadHistory()
    toast.success(t('tools.smartHistory.updated'))
  }

  const handleExport = () => {
    const data = exportHistory()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '24toolkit-history.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('tools.smartHistory.exported'))
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getToolPath = (toolId: string) => {
    const tool = allTools.find(t => t.id === toolId)
    return tool?.path || '/'
  }

  const stats = getHistoryStats()

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold text-foreground tracking-tight">{pageH1}</h1>
              <Badge variant="secondary">
                {stats.totalEntries} {t('tools.smartHistory.entries')}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download size={16} className="mr-1" />
                {t('tools.smartHistory.export')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash size={16} className="mr-1" />
                {t('tools.smartHistory.clearAll')}
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{metadata.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {t('tools.smartHistory.statistics')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('tools.smartHistory.totalEntries')}
                  </span>
                  <span className="font-medium">{stats.totalEntries}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('tools.smartHistory.favorites')}
                  </span>
                  <span className="font-medium">{getFavorites().length}</span>
                </div>
              </CardContent>
            </Card>

            {stats.toolBreakdown.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {t('tools.smartHistory.mostUsedTools')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.toolBreakdown.slice(0, 5).map(tool => (
                      <div key={tool.toolId} className="flex items-center justify-between text-sm">
                        <Link 
                          to={getToolPath(tool.toolId)}
                          className="text-muted-foreground hover:text-foreground truncate"
                        >
                          {tool.toolName}
                        </Link>
                        <Badge variant="secondary" className="text-xs">
                          {tool.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - History List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search & Filter */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={t('tools.smartHistory.searchHistory')}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={activeFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFilter('all')}
                    >
                      {t('tools.smartHistory.all')}
                    </Button>
                    <Button
                      variant={activeFilter === 'favorites' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFilter('favorites')}
                      className="gap-1"
                    >
                      <Star size={14} weight="fill" />
                      {t('tools.smartHistory.favorites')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Entries */}
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map(entry => (
                  <Card key={entry.id} className="hover:border-purple-500/30 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Link 
                              to={getToolPath(entry.toolId)}
                              className="text-sm font-medium text-purple-500 hover:text-purple-400"
                            >
                              {entry.toolName}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(entry.timestamp)}
                            </span>
                            {entry.tags?.includes('favorite') && (
                              <Star size={14} weight="fill" className="text-yellow-500" />
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {t('tools.smartHistory.input')}
                              </p>
                              <p className="text-sm text-foreground bg-muted/50 rounded p-2 line-clamp-2">
                                {entry.input}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {t('tools.smartHistory.output')}
                              </p>
                              <p className="text-sm text-foreground bg-muted/50 rounded p-2 line-clamp-3">
                                {entry.output}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(entry.output, t('tools.common.copied'))}
                            title={t('tools.common.copy')}
                          >
                            <Copy size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleFavorite(entry.id)}
                            title={t('tools.smartHistory.favorites')}
                          >
                            <Star 
                              size={16} 
                              weight={entry.tags?.includes('favorite') ? 'fill' : 'regular'}
                              className={entry.tags?.includes('favorite') ? 'text-yellow-500' : ''}
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(entry.id)}
                            title={t('tools.common.delete')}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-16">
                <CardContent className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mx-auto mb-4">
                    <ClockCounterClockwise size={32} className="text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery ? t('tools.smartHistory.noResults') : t('tools.smartHistory.noHistory')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t('tools.smartHistory.noHistoryDesc')}
                  </p>
                  <Link to="/tools/text-summarizer">
                    <Button className="gap-2">
                      <Sparkle size={16} weight="fill" />
                      {t('tools.smartHistory.tryTextSummarizer')}
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="smart-history" category="ai" />
    </div>
  )
}

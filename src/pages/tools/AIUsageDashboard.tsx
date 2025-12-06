import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChartLine, 
  Lightning, 
  Clock, 
  CheckCircle, 
  XCircle,
  Sparkle,
  ArrowRight,
  Trash,
  Download,
  TrendUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIBadge } from '@/components/ai/AIBadge'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'
import { 
  getUserInsights, 
  getDailySummary,
  clearUsageData,
  exportUsageData,
  type UserInsights,
  type DailySummary
} from '@/lib/ai-usage-analytics'
import { Link } from 'react-router-dom'

export default function AIUsageDashboard() {
  const metadata = getPageMetadata('ai-usage-dashboard')
  useSEO({ ...metadata, canonicalPath: '/tools/ai-usage-dashboard' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.aIUsageDashboard.name')

  const { t } = useTranslation()
  const [insights, setInsights] = useState<UserInsights | null>(null)
  const [todaySummary, setTodaySummary] = useState<DailySummary | null>(null)
  const [isArabic, setIsArabic] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
    
    loadData()
  }, [])

  const loadData = () => {
    setInsights(getUserInsights())
    setTodaySummary(getDailySummary())
  }

  const handleClearData = () => {
    if (confirm(t('tools.aiUsageDashboard.clearConfirm'))) {
      clearUsageData()
      loadData()
      toast.success(t('tools.aiUsageDashboard.dataCleared'))
    }
  }

  const handleExportData = () => {
    const data = exportUsageData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '24toolkit-ai-usage.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('tools.aiUsageDashboard.dataExported'))
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}${t('tools.aiUsageDashboard.milliseconds')}`
    return `${(ms / 1000).toFixed(1)}${t('tools.aiUsageDashboard.seconds')}`
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? t('tools.aiUsageDashboard.pm') : t('tools.aiUsageDashboard.am')
    const displayHour = hour % 12 || 12
    return `${displayHour}:00 ${period}`
  }

  if (!insights) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">{t('common.loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold text-foreground tracking-tight">{pageH1}</h1>
              <AIBadge />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download size={16} className="mr-1" />
                {t('tools.aiUsageDashboard.export')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearData}>
                <Trash size={16} className="mr-1" />
                {t('tools.aiUsageDashboard.clear')}
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{metadata.description}</p>
        </div>

        {insights.totalRequests === 0 ? (
          /* Empty State */
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mx-auto mb-4">
                <ChartLine size={40} className="text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {t('tools.aiUsageDashboard.noUsageData')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('tools.aiUsageDashboard.startUsingTools')}
              </p>
              <Link to="/tools/text-summarizer">
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-sky-500">
                  <Sparkle size={18} weight="fill" />
                  {t('tools.aiUsageDashboard.tryTextSummarizer')}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.totalRequests')}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {insights.totalRequests}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Lightning size={24} weight="fill" className="text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.successRate')}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {insights.successRate}%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle size={24} weight="fill" className="text-green-500" />
                    </div>
                  </div>
                  <Progress value={insights.successRate} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.avgResponseTime')}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {formatDuration(insights.averageResponseTime)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                      <Clock size={24} weight="fill" className="text-sky-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.toolsUsed')}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {insights.totalToolsUsed}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Sparkle size={24} weight="fill" className="text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Favorite Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendUp size={20} className="text-purple-500" />
                    {t('tools.aiUsageDashboard.yourFavoriteTools')}
                  </CardTitle>
                  <CardDescription>
                    {t('tools.aiUsageDashboard.mostFrequentlyUsed')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {insights.favoriteTools.length > 0 ? (
                    <div className="space-y-3">
                      {insights.favoriteTools.map((tool, i) => (
                        <div key={tool.toolId} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{tool.toolName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress 
                                value={(tool.count / insights.totalRequests) * 100} 
                                className="h-1.5 flex-1" 
                              />
                              <span className="text-xs text-muted-foreground">
                                {tool.count} {t('tools.aiUsageDashboard.uses')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {t('tools.aiUsageDashboard.noData')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkle size={20} weight="fill" className="text-purple-500" />
                    {t('tools.aiUsageDashboard.personalizedSuggestions')}
                  </CardTitle>
                  <CardDescription>
                    {t('tools.aiUsageDashboard.basedOnUsage')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.suggestions.map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkle size={14} weight="fill" className="text-purple-500" />
                        </div>
                        <p className="text-sm text-foreground">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Summary */}
            {todaySummary && todaySummary.totalRequests > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('tools.aiUsageDashboard.todaySummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{todaySummary.totalRequests}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.requests')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-green-500">{todaySummary.successfulRequests}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.successful')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-red-500">{todaySummary.failedRequests}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.failed')}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">
                        {formatDuration(todaySummary.averageDuration)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('tools.aiUsageDashboard.avgTime')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.aiUsageDashboard.usagePatterns')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('tools.aiUsageDashboard.peakUsageTime')}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-sky-500" />
                      <span className="font-medium">{formatHour(insights.peakUsageHour)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('tools.aiUsageDashboard.preferredProvider')}
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      {insights.favoriteProvider || t('tools.aiUsageDashboard.notAvailable')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="ai-usage-dashboard" category="ai" />
    </div>
  )
}

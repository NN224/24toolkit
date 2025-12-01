import { useState, useEffect } from 'react'
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
  useSEO(metadata)

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
    if (confirm(isArabic ? 'هل تريد حذف جميع بيانات الاستخدام؟' : 'Clear all usage data?')) {
      clearUsageData()
      loadData()
      toast.success(isArabic ? 'تم حذف البيانات' : 'Data cleared')
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
    toast.success(isArabic ? 'تم تصدير البيانات' : 'Data exported')
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:00 ${period}`
  }

  if (!insights) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">Loading...</div>
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
              <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                {isArabic ? 'لوحة تحليلات AI' : 'AI Usage Dashboard'}
              </h1>
              <AIBadge />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download size={16} className="mr-1" />
                {isArabic ? 'تصدير' : 'Export'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearData}>
                <Trash size={16} className="mr-1" />
                {isArabic ? 'حذف' : 'Clear'}
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            {isArabic 
              ? 'تتبع استخدامك لأدوات الذكاء الاصطناعي واحصل على توصيات شخصية' 
              : 'Track your AI tool usage and get personalized recommendations'}
          </p>
        </div>

        {insights.totalRequests === 0 ? (
          /* Empty State */
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mx-auto mb-4">
                <ChartLine size={40} className="text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {isArabic ? 'لا توجد بيانات بعد' : 'No usage data yet'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isArabic 
                  ? 'ابدأ باستخدام أدوات AI لرؤية التحليلات' 
                  : 'Start using AI tools to see your analytics'}
              </p>
              <Link to="/tools/text-summarizer">
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-sky-500">
                  <Sparkle size={18} weight="fill" />
                  {isArabic ? 'جرب ملخص النصوص' : 'Try Text Summarizer'}
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
                        {isArabic ? 'إجمالي الطلبات' : 'Total Requests'}
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
                        {isArabic ? 'نسبة النجاح' : 'Success Rate'}
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
                        {isArabic ? 'متوسط وقت الاستجابة' : 'Avg Response Time'}
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
                        {isArabic ? 'أدوات مستخدمة' : 'Tools Used'}
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
                    {isArabic ? 'أدواتك المفضلة' : 'Your Favorite Tools'}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? 'الأدوات الأكثر استخداماً' : 'Most frequently used tools'}
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
                                {tool.count} {isArabic ? 'مرة' : 'uses'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {isArabic ? 'لا توجد بيانات' : 'No data yet'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkle size={20} weight="fill" className="text-purple-500" />
                    {isArabic ? 'توصيات شخصية' : 'Personalized Suggestions'}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? 'بناءً على استخدامك' : 'Based on your usage patterns'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(isArabic ? insights.suggestionsAr : insights.suggestions).map((suggestion, i) => (
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
                    {isArabic ? 'ملخص اليوم' : "Today's Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{todaySummary.totalRequests}</p>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'طلبات' : 'Requests'}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-green-500">{todaySummary.successfulRequests}</p>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'نجاح' : 'Successful'}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-red-500">{todaySummary.failedRequests}</p>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'فشل' : 'Failed'}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">
                        {formatDuration(todaySummary.averageDuration)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'متوسط الوقت' : 'Avg Time'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'أنماط الاستخدام' : 'Usage Patterns'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isArabic ? 'وقت الذروة' : 'Peak Usage Time'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-sky-500" />
                      <span className="font-medium">{formatHour(insights.peakUsageHour)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isArabic ? 'المزود المفضل' : 'Preferred Provider'}
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      {insights.favoriteProvider || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

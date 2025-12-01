/**
 * AI Usage Analytics System
 * نظام تحليلات استخدام AI
 */

// Usage event types
export interface AIUsageEvent {
  toolId: string
  toolName: string
  provider: string
  timestamp: number
  duration: number // milliseconds
  inputLength: number
  outputLength: number
  success: boolean
  error?: string
}

// Daily summary
export interface DailySummary {
  date: string // YYYY-MM-DD
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalDuration: number
  averageDuration: number
  mostUsedTool: string
  mostUsedProvider: string
  toolBreakdown: Record<string, number>
  providerBreakdown: Record<string, number>
}

// User insights
export interface UserInsights {
  totalRequests: number
  totalToolsUsed: number
  averageResponseTime: number
  successRate: number
  favoriteTools: { toolId: string; toolName: string; count: number }[]
  favoriteProvider: string
  peakUsageHour: number // 0-23
  weeklyTrend: { week: string; count: number }[]
  suggestions: string[]
  suggestionsAr: string[]
}

// Storage key
const STORAGE_KEY = '24toolkit_ai_usage'
const MAX_EVENTS = 1000 // Keep last 1000 events

// Load events from localStorage
function loadEvents(): AIUsageEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save events to localStorage
function saveEvents(events: AIUsageEvent[]): void {
  try {
    // Keep only last MAX_EVENTS
    const trimmedEvents = events.slice(-MAX_EVENTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedEvents))
  } catch {
    // Silent fail - localStorage might be full or disabled
  }
}

// Track an AI usage event
export function trackAIUsage(event: Omit<AIUsageEvent, 'timestamp'>): void {
  const events = loadEvents()
  events.push({
    ...event,
    timestamp: Date.now()
  })
  saveEvents(events)
}

// Get all events
export function getAIUsageEvents(): AIUsageEvent[] {
  return loadEvents()
}

// Get events for a specific date range
export function getEventsInRange(startDate: Date, endDate: Date): AIUsageEvent[] {
  const events = loadEvents()
  const start = startDate.getTime()
  const end = endDate.getTime()
  return events.filter(e => e.timestamp >= start && e.timestamp <= end)
}

// Get daily summary
export function getDailySummary(date?: Date): DailySummary {
  const targetDate = date || new Date()
  const dateStr = targetDate.toISOString().split('T')[0]
  
  const startOfDay = new Date(dateStr).getTime()
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000
  
  const events = loadEvents().filter(
    e => e.timestamp >= startOfDay && e.timestamp < endOfDay
  )
  
  if (events.length === 0) {
    return {
      date: dateStr,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalDuration: 0,
      averageDuration: 0,
      mostUsedTool: '',
      mostUsedProvider: '',
      toolBreakdown: {},
      providerBreakdown: {}
    }
  }
  
  const toolBreakdown: Record<string, number> = {}
  const providerBreakdown: Record<string, number> = {}
  let totalDuration = 0
  let successfulRequests = 0
  
  events.forEach(e => {
    toolBreakdown[e.toolId] = (toolBreakdown[e.toolId] || 0) + 1
    providerBreakdown[e.provider] = (providerBreakdown[e.provider] || 0) + 1
    totalDuration += e.duration
    if (e.success) successfulRequests++
  })
  
  const mostUsedTool = Object.entries(toolBreakdown)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  
  const mostUsedProvider = Object.entries(providerBreakdown)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  
  return {
    date: dateStr,
    totalRequests: events.length,
    successfulRequests,
    failedRequests: events.length - successfulRequests,
    totalDuration,
    averageDuration: Math.round(totalDuration / events.length),
    mostUsedTool,
    mostUsedProvider,
    toolBreakdown,
    providerBreakdown
  }
}

// Get user insights
export function getUserInsights(): UserInsights {
  const events = loadEvents()
  
  if (events.length === 0) {
    return {
      totalRequests: 0,
      totalToolsUsed: 0,
      averageResponseTime: 0,
      successRate: 0,
      favoriteTools: [],
      favoriteProvider: '',
      peakUsageHour: 0,
      weeklyTrend: [],
      suggestions: [],
      suggestionsAr: []
    }
  }
  
  const toolCounts: Record<string, { toolId: string; toolName: string; count: number }> = {}
  const providerCounts: Record<string, number> = {}
  const hourCounts: Record<number, number> = {}
  let totalDuration = 0
  let successCount = 0
  
  events.forEach(e => {
    // Tool counts
    if (!toolCounts[e.toolId]) {
      toolCounts[e.toolId] = { toolId: e.toolId, toolName: e.toolName, count: 0 }
    }
    toolCounts[e.toolId].count++
    
    // Provider counts
    providerCounts[e.provider] = (providerCounts[e.provider] || 0) + 1
    
    // Hour counts
    const hour = new Date(e.timestamp).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
    
    // Totals
    totalDuration += e.duration
    if (e.success) successCount++
  })
  
  const favoriteTools = Object.values(toolCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  const favoriteProvider = Object.entries(providerCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  
  const peakUsageHour = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '0'
  
  // Calculate weekly trend
  const weeklyTrend = calculateWeeklyTrend(events)
  
  // Generate suggestions
  const suggestions = generateSuggestions(events, favoriteTools, favoriteProvider)
  
  return {
    totalRequests: events.length,
    totalToolsUsed: Object.keys(toolCounts).length,
    averageResponseTime: Math.round(totalDuration / events.length),
    successRate: Math.round((successCount / events.length) * 100),
    favoriteTools,
    favoriteProvider,
    peakUsageHour: parseInt(peakUsageHour),
    weeklyTrend,
    suggestions: suggestions.en,
    suggestionsAr: suggestions.ar
  }
}

// Calculate weekly trend
function calculateWeeklyTrend(events: AIUsageEvent[]): { week: string; count: number }[] {
  const weekCounts: Record<string, number> = {}
  
  events.forEach(e => {
    const date = new Date(e.timestamp)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekStr = weekStart.toISOString().split('T')[0]
    weekCounts[weekStr] = (weekCounts[weekStr] || 0) + 1
  })
  
  return Object.entries(weekCounts)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8) // Last 8 weeks
}

// Generate personalized suggestions
function generateSuggestions(
  events: AIUsageEvent[],
  favoriteTools: { toolId: string; count: number }[],
  _favoriteProvider: string
): { en: string[]; ar: string[] } {
  const suggestions = { en: [] as string[], ar: [] as string[] }
  
  // Based on tool usage
  if (favoriteTools.length > 0) {
    const topTool = favoriteTools[0]
    
    if (topTool.toolId === 'ai-translator') {
      suggestions.en.push('Try our AI Tool Chains to translate and summarize in one go!')
      suggestions.ar.push('جرب سلاسل الأدوات للترجمة والتلخيص بخطوة واحدة!')
    }
    
    if (topTool.toolId === 'text-summarizer') {
      suggestions.en.push('Check out the AI Translator to translate your summaries!')
      suggestions.ar.push('جرب المترجم الذكي لترجمة ملخصاتك!')
    }
    
    if (topTool.toolId === 'ai-email-writer') {
      suggestions.en.push('Use Grammar Corrector to polish your emails!')
      suggestions.ar.push('استخدم مصحح القواعد لتحسين رسائلك!')
    }
  }
  
  // Based on success rate
  const successRate = events.filter(e => e.success).length / events.length
  if (successRate < 0.8) {
    suggestions.en.push('Try switching AI providers if you experience issues')
    suggestions.ar.push('جرب تغيير مزود الذكاء الاصطناعي إذا واجهت مشاكل')
  }
  
  // Based on usage time
  const recentEvents = events.filter(
    e => e.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000
  )
  if (recentEvents.length > 50) {
    suggestions.en.push('You\'re a power user! Consider checking our AI Tool Chains')
    suggestions.ar.push('أنت مستخدم متميز! جرب سلاسل الأدوات الذكية')
  }
  
  // Default suggestions if none generated
  if (suggestions.en.length === 0) {
    suggestions.en.push('Explore our AI tools to boost your productivity!')
    suggestions.ar.push('اكتشف أدوات الذكاء الاصطناعي لزيادة إنتاجيتك!')
  }
  
  return suggestions
}

// Clear all usage data
export function clearUsageData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// Export data as JSON
export function exportUsageData(): string {
  const events = loadEvents()
  return JSON.stringify(events, null, 2)
}

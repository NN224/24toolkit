import { useState, useEffect, useCallback } from 'react'

export interface ToolUsageData {
  toolId: string
  usageCount: number
  lastUsed: string
}

export interface ToolAnalytics {
  usageData: ToolUsageData[]
  mostUsedTools: ToolUsageData[]
  recentlyUsed: ToolUsageData[]
  totalUsageCount: number
}

const STORAGE_KEY = 'tool-analytics'
const MAX_RECENT = 5
const MAX_POPULAR = 6

export function useToolAnalytics() {
  const [analytics, setAnalytics] = useState<ToolAnalytics>({
    usageData: [],
    mostUsedTools: [],
    recentlyUsed: [],
    totalUsageCount: 0
  })

  // Load analytics from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ToolUsageData[]
        updateAnalyticsState(parsed)
      } catch (e) {
        console.error('Failed to parse tool analytics:', e)
      }
    }
  }, [])

  const updateAnalyticsState = (data: ToolUsageData[]) => {
    // Sort by usage count (descending)
    const mostUsed = [...data]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, MAX_POPULAR)

    // Sort by last used (most recent first)
    const recentlyUsed = [...data]
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, MAX_RECENT)

    const totalUsageCount = data.reduce((sum, tool) => sum + tool.usageCount, 0)

    setAnalytics({
      usageData: data,
      mostUsedTools: mostUsed,
      recentlyUsed,
      totalUsageCount
    })
  }

  const trackToolUsage = useCallback((toolId: string) => {
    const saved = localStorage.getItem(STORAGE_KEY)
    let data: ToolUsageData[] = saved ? JSON.parse(saved) : []

    const existingIndex = data.findIndex(t => t.toolId === toolId)
    const now = new Date().toISOString()

    if (existingIndex >= 0) {
      data[existingIndex].usageCount += 1
      data[existingIndex].lastUsed = now
    } else {
      data.push({
        toolId,
        usageCount: 1,
        lastUsed: now
      })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    updateAnalyticsState(data)
  }, [])

  const getToolUsageCount = useCallback((toolId: string): number => {
    const tool = analytics.usageData.find(t => t.toolId === toolId)
    return tool?.usageCount || 0
  }, [analytics.usageData])

  const clearAnalytics = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setAnalytics({
      usageData: [],
      mostUsedTools: [],
      recentlyUsed: [],
      totalUsageCount: 0
    })
  }, [])

  return {
    ...analytics,
    trackToolUsage,
    getToolUsageCount,
    clearAnalytics
  }
}

// Global function to track tool usage from anywhere
export function trackToolUsage(toolId: string) {
  const event = new CustomEvent('track-tool-usage', { detail: { toolId } })
  window.dispatchEvent(event)
}

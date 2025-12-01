/**
 * Smart History System with AI
 * نظام السجل الذكي مع AI
 */

export interface HistoryEntry {
  id: string
  toolId: string
  toolName: string
  input: string
  output: string
  timestamp: number
  provider?: string
  duration?: number
  tags?: string[]
}

// Storage key
const STORAGE_KEY = '24toolkit_smart_history'
const MAX_ENTRIES = 100

// Load history
function loadHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save history
function saveHistory(entries: HistoryEntry[]): void {
  try {
    const trimmed = entries.slice(-MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Silent fail
  }
}

// Add entry
export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry {
  const history = loadHistory()
  const newEntry: HistoryEntry = {
    ...entry,
    id: `history-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now()
  }
  history.push(newEntry)
  saveHistory(history)
  return newEntry
}

// Get all history
export function getHistory(): HistoryEntry[] {
  return loadHistory().sort((a, b) => b.timestamp - a.timestamp)
}

// Get history for a specific tool
export function getHistoryForTool(toolId: string): HistoryEntry[] {
  return getHistory().filter(e => e.toolId === toolId)
}

// Search history
export function searchHistory(query: string): HistoryEntry[] {
  const lowerQuery = query.toLowerCase()
  return getHistory().filter(e => 
    e.input.toLowerCase().includes(lowerQuery) ||
    e.output.toLowerCase().includes(lowerQuery) ||
    e.toolName.toLowerCase().includes(lowerQuery) ||
    e.tags?.some(t => t.toLowerCase().includes(lowerQuery))
  )
}

// Get recent inputs for a tool (for autocomplete)
export function getRecentInputsForTool(toolId: string, limit = 5): string[] {
  return getHistoryForTool(toolId)
    .map(e => e.input)
    .filter((input, index, arr) => arr.indexOf(input) === index) // Unique
    .slice(0, limit)
}

// Get suggestions based on partial input
export function getSuggestionsForInput(toolId: string, partialInput: string): string[] {
  if (partialInput.length < 3) return []
  
  const lowerInput = partialInput.toLowerCase()
  return getHistoryForTool(toolId)
    .filter(e => e.input.toLowerCase().startsWith(lowerInput))
    .map(e => e.input)
    .filter((input, index, arr) => arr.indexOf(input) === index)
    .slice(0, 5)
}

// Delete entry
export function deleteHistoryEntry(entryId: string): boolean {
  const history = loadHistory()
  const index = history.findIndex(e => e.id === entryId)
  if (index !== -1) {
    history.splice(index, 1)
    saveHistory(history)
    return true
  }
  return false
}

// Clear all history
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// Clear history for a specific tool
export function clearHistoryForTool(toolId: string): void {
  const history = loadHistory().filter(e => e.toolId !== toolId)
  saveHistory(history)
}

// Get history stats
export function getHistoryStats(): {
  totalEntries: number
  toolBreakdown: { toolId: string; toolName: string; count: number }[]
  recentTools: string[]
  oldestEntry: number | null
  newestEntry: number | null
} {
  const history = getHistory()
  
  if (history.length === 0) {
    return {
      totalEntries: 0,
      toolBreakdown: [],
      recentTools: [],
      oldestEntry: null,
      newestEntry: null
    }
  }
  
  const toolCounts: Record<string, { toolId: string; toolName: string; count: number }> = {}
  history.forEach(e => {
    if (!toolCounts[e.toolId]) {
      toolCounts[e.toolId] = { toolId: e.toolId, toolName: e.toolName, count: 0 }
    }
    toolCounts[e.toolId].count++
  })
  
  const toolBreakdown = Object.values(toolCounts).sort((a, b) => b.count - a.count)
  const recentTools = history.slice(0, 10).map(e => e.toolId)
    .filter((id, index, arr) => arr.indexOf(id) === index)
    .slice(0, 5)
  
  return {
    totalEntries: history.length,
    toolBreakdown,
    recentTools,
    oldestEntry: history[history.length - 1]?.timestamp || null,
    newestEntry: history[0]?.timestamp || null
  }
}

// Export history
export function exportHistory(): string {
  return JSON.stringify(getHistory(), null, 2)
}

// Import history
export function importHistory(jsonData: string): number {
  try {
    const entries = JSON.parse(jsonData) as HistoryEntry[]
    const history = loadHistory()
    
    // Merge, avoiding duplicates
    const existingIds = new Set(history.map(e => e.id))
    const newEntries = entries.filter(e => !existingIds.has(e.id))
    
    saveHistory([...history, ...newEntries])
    return newEntries.length
  } catch {
    return 0
  }
}

// Favorite an entry
export function toggleFavorite(entryId: string): boolean {
  const history = loadHistory()
  const entry = history.find(e => e.id === entryId)
  if (entry) {
    if (!entry.tags) entry.tags = []
    const favIndex = entry.tags.indexOf('favorite')
    if (favIndex === -1) {
      entry.tags.push('favorite')
    } else {
      entry.tags.splice(favIndex, 1)
    }
    saveHistory(history)
    return true
  }
  return false
}

// Get favorites
export function getFavorites(): HistoryEntry[] {
  return getHistory().filter(e => e.tags?.includes('favorite'))
}

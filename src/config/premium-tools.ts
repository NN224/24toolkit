/**
 * Premium Tools Configuration
 * Tools that require authentication to access
 */

export const PREMIUM_TOOLS = [
  // AI Tools - Require sign in
  'ai-hashtag-generator',
  'ai-translator',
  'ai-email-writer',
  'ai-task-builder',
  'idea-analyzer',
  'text-summarizer',
  'paragraph-rewriter',
  'grammar-corrector',
  'code-formatter',
  'image-caption-generator',
  
  // Advanced Features
  'image-compressor',
  'image-to-text',
  'pdf-to-word',
  'text-to-speech'
] as const

export type PremiumTool = typeof PREMIUM_TOOLS[number]

/**
 * Check if a tool is premium
 */
export function isPremiumTool(toolPath: string): boolean {
  // Extract tool name from path (e.g., "tools/ai-translator" -> "ai-translator")
  const toolName = toolPath.replace('tools/', '').replace('/tools/', '')
  return PREMIUM_TOOLS.includes(toolName as PremiumTool)
}

/**
 * Premium Features
 */
export const PREMIUM_FEATURES = {
  title: '🌟 Premium Features',
  benefits: [
    'Unlimited AI tool usage',
    'Advanced image processing',
    'Priority support',
    'No ads',
    'Save & sync preferences',
    'Export history',
    'Early access to new tools'
  ]
}

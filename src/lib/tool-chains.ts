/**
 * AI Tool Chains - Connect multiple tools together
 * سلاسل أدوات AI - ربط أدوات متعددة ببعض
 */

import { callAI, type AIProvider } from './ai'
import { AI_PROMPTS } from './ai-prompts'
import { allTools } from './tools-data'

// Chain step definition
export interface ChainStep {
  toolId: string
  toolName: string
  toolNameAr: string
  action: 'translate' | 'summarize' | 'improve' | 'simplify' | 'expand' | 'extract' | 'format' | 'custom'
  options?: Record<string, unknown>
}

// Predefined chain templates
export interface ChainTemplate {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  steps: ChainStep[]
  category: 'content' | 'translation' | 'analysis' | 'productivity'
}

// Chain execution result
export interface ChainResult {
  stepIndex: number
  toolId: string
  input: string
  output: string
  success: boolean
  error?: string
  duration: number
}

// Full chain execution result
export interface ChainExecutionResult {
  chainId: string
  results: ChainResult[]
  finalOutput: string
  totalDuration: number
  success: boolean
}

// Predefined chain templates
export const CHAIN_TEMPLATES: ChainTemplate[] = [
  {
    id: 'translate-summarize',
    name: 'Translate & Summarize',
    nameAr: 'ترجم ولخص',
    description: 'Translate text to English, then summarize the key points',
    descriptionAr: 'ترجم النص للإنجليزية ثم لخص النقاط الرئيسية',
    icon: '🌐',
    category: 'translation',
    steps: [
      { toolId: 'ai-translator', toolName: 'Translate', toolNameAr: 'ترجمة', action: 'translate', options: { targetLang: 'English' } },
      { toolId: 'text-summarizer', toolName: 'Summarize', toolNameAr: 'تلخيص', action: 'summarize', options: { length: 'medium' } }
    ]
  },
  {
    id: 'summarize-translate-ar',
    name: 'Summarize & Translate to Arabic',
    nameAr: 'لخص وترجم للعربية',
    description: 'Summarize English content, then translate to Arabic',
    descriptionAr: 'لخص المحتوى الإنجليزي ثم ترجمه للعربية',
    icon: '📝',
    category: 'translation',
    steps: [
      { toolId: 'text-summarizer', toolName: 'Summarize', toolNameAr: 'تلخيص', action: 'summarize', options: { length: 'medium' } },
      { toolId: 'ai-translator', toolName: 'Translate', toolNameAr: 'ترجمة', action: 'translate', options: { targetLang: 'Arabic' } }
    ]
  },
  {
    id: 'improve-expand',
    name: 'Improve & Expand',
    nameAr: 'حسّن ووسّع',
    description: 'Improve writing quality, then expand with more details',
    descriptionAr: 'حسّن جودة الكتابة ثم أضف تفاصيل أكثر',
    icon: '✨',
    category: 'content',
    steps: [
      { toolId: 'ai-writing-assistant', toolName: 'Improve', toolNameAr: 'تحسين', action: 'improve' },
      { toolId: 'text-expander', toolName: 'Expand', toolNameAr: 'توسيع', action: 'expand' }
    ]
  },
  {
    id: 'simplify-summarize',
    name: 'Simplify & Summarize',
    nameAr: 'بسّط ولخص',
    description: 'Simplify complex text, then create a summary',
    descriptionAr: 'بسّط النص المعقد ثم أنشئ ملخصاً',
    icon: '🎯',
    category: 'content',
    steps: [
      { toolId: 'text-simplifier', toolName: 'Simplify', toolNameAr: 'تبسيط', action: 'simplify' },
      { toolId: 'text-summarizer', toolName: 'Summarize', toolNameAr: 'تلخيص', action: 'summarize', options: { length: 'short' } }
    ]
  },
  {
    id: 'extract-format',
    name: 'Extract & Format',
    nameAr: 'استخرج ونسّق',
    description: 'Extract key information and format as structured data',
    descriptionAr: 'استخرج المعلومات الرئيسية ونسقها كبيانات منظمة',
    icon: '📊',
    category: 'analysis',
    steps: [
      { toolId: 'keyword-extractor', toolName: 'Extract', toolNameAr: 'استخراج', action: 'extract' },
      { toolId: 'json-formatter', toolName: 'Format', toolNameAr: 'تنسيق', action: 'format' }
    ]
  },
  {
    id: 'full-content-pipeline',
    name: 'Full Content Pipeline',
    nameAr: 'خط إنتاج المحتوى',
    description: 'Improve, expand, and summarize for complete content transformation',
    descriptionAr: 'حسّن ووسّع ولخص لتحويل المحتوى بالكامل',
    icon: '🚀',
    category: 'productivity',
    steps: [
      { toolId: 'ai-writing-assistant', toolName: 'Improve', toolNameAr: 'تحسين', action: 'improve' },
      { toolId: 'text-expander', toolName: 'Expand', toolNameAr: 'توسيع', action: 'expand' },
      { toolId: 'text-summarizer', toolName: 'Summarize', toolNameAr: 'تلخيص', action: 'summarize', options: { length: 'detailed' } }
    ]
  }
]

// Get prompt for a chain action
function getPromptForAction(
  action: ChainStep['action'],
  input: string,
  options?: Record<string, unknown>
): string {
  switch (action) {
    case 'translate': {
      const targetLang = (options?.targetLang as string) || 'English'
      return AI_PROMPTS.TRANSLATOR(input, targetLang)
    }
    
    case 'summarize': {
      const length = (options?.length as 'short' | 'medium' | 'long') || 'medium'
      return AI_PROMPTS.TEXT_SUMMARIZER(input, length)
    }
    
    case 'improve':
      return `You are a professional editor. Improve the following text for clarity, readability, and impact while maintaining the original meaning:\n\n${input}\n\nReturn ONLY the improved text.`
    
    case 'simplify':
      return `Simplify the following text so it's easy to understand for a general audience. Use short sentences, simple words, and clear explanations:\n\n${input}\n\nReturn ONLY the simplified text.`
    
    case 'expand':
      return `Expand and elaborate on the following text with more details, examples, and explanations while maintaining the original meaning and tone:\n\n${input}\n\nReturn ONLY the expanded text.`
    
    case 'extract':
      return `Extract the key keywords, phrases, and main concepts from the following text. Return them as a comma-separated list:\n\n${input}\n\nReturn ONLY the keywords.`
    
    case 'format':
      return `Format the following text as structured JSON data:\n\n${input}\n\nReturn ONLY valid JSON.`
    
    case 'custom':
      return (options?.prompt as string) || input
    
    default:
      return input
  }
}

// Execute a single chain step
async function executeStep(
  step: ChainStep,
  input: string,
  provider: AIProvider,
  onProgress?: (text: string) => void
): Promise<ChainResult> {
  const startTime = Date.now()
  
  try {
    const prompt = getPromptForAction(step.action, input, step.options)
    let output = ''
    
    await callAI(prompt, provider, (text) => {
      output = text
      onProgress?.(text)
    })
    
    return {
      stepIndex: 0, // Will be set by caller
      toolId: step.toolId,
      input,
      output,
      success: true,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      stepIndex: 0,
      toolId: step.toolId,
      input,
      output: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    }
  }
}

// Execute a full chain
export async function executeChain(
  chain: ChainTemplate | ChainStep[],
  input: string,
  provider: AIProvider,
  onStepComplete?: (result: ChainResult, stepIndex: number) => void,
  onStepProgress?: (text: string, stepIndex: number) => void
): Promise<ChainExecutionResult> {
  const steps = Array.isArray(chain) ? chain : chain.steps
  const chainId = Array.isArray(chain) ? 'custom' : chain.id
  
  const results: ChainResult[] = []
  let currentInput = input
  const startTime = Date.now()
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    
    const result = await executeStep(
      step,
      currentInput,
      provider,
      (text) => onStepProgress?.(text, i)
    )
    
    result.stepIndex = i
    results.push(result)
    onStepComplete?.(result, i)
    
    if (!result.success) {
      return {
        chainId,
        results,
        finalOutput: '',
        totalDuration: Date.now() - startTime,
        success: false
      }
    }
    
    currentInput = result.output
  }
  
  return {
    chainId,
    results,
    finalOutput: results[results.length - 1]?.output || '',
    totalDuration: Date.now() - startTime,
    success: true
  }
}

// Get chain templates by category
export function getChainsByCategory(category: ChainTemplate['category']): ChainTemplate[] {
  return CHAIN_TEMPLATES.filter(chain => chain.category === category)
}

// Get all chain categories
export function getChainCategories(): { id: ChainTemplate['category']; name: string; nameAr: string }[] {
  return [
    { id: 'content', name: 'Content', nameAr: 'المحتوى' },
    { id: 'translation', name: 'Translation', nameAr: 'الترجمة' },
    { id: 'analysis', name: 'Analysis', nameAr: 'التحليل' },
    { id: 'productivity', name: 'Productivity', nameAr: 'الإنتاجية' }
  ]
}

// Build a custom chain from tool IDs
export function buildCustomChain(toolIds: string[]): ChainStep[] {
  return toolIds.map(id => {
    const tool = allTools.find(t => t.id === id)
    const action = inferActionFromToolId(id)
    
    return {
      toolId: id,
      toolName: tool?.title || id,
      toolNameAr: tool?.title || id, // Would need Arabic titles in tools-data
      action
    }
  })
}

// Infer action from tool ID
function inferActionFromToolId(toolId: string): ChainStep['action'] {
  if (toolId.includes('translat')) return 'translate'
  if (toolId.includes('summar')) return 'summarize'
  if (toolId.includes('improve') || toolId.includes('writing')) return 'improve'
  if (toolId.includes('simplif')) return 'simplify'
  if (toolId.includes('expand')) return 'expand'
  if (toolId.includes('extract')) return 'extract'
  if (toolId.includes('format')) return 'format'
  return 'custom'
}

// Get suggested chains based on current tool
export function getSuggestedChains(currentToolId: string): ChainTemplate[] {
  return CHAIN_TEMPLATES.filter(chain => 
    chain.steps.some(step => step.toolId === currentToolId) ||
    chain.steps[0].action === inferActionFromToolId(currentToolId)
  ).slice(0, 3)
}

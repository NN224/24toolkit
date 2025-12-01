import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  PaperPlaneTilt, 
  Sparkle, 
  Robot, 
  User,
  Copy,
  ArrowsClockwise,
  Lightning,
  Translate,
  TextT,
  Envelope,
  Code
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIBadge } from '@/components/ai/AIBadge'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { callAI } from '@/lib/ai'
import { allTools } from '@/lib/tools-data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolsUsed?: string[]
  timestamp: number
}

interface DetectedIntent {
  action: 'translate' | 'summarize' | 'email' | 'code' | 'general'
  tool?: string
  confidence: number
}

export default function MultiToolChat() {
  const metadata = getPageMetadata('multi-tool-chat')
  useSEO(metadata)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const [isArabic, setIsArabic] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const copyToClipboard = useCopyToClipboard()

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Detect user intent from message
  const detectIntent = (message: string): DetectedIntent => {
    const lowerMessage = message.toLowerCase()
    
    // Translation patterns
    if (lowerMessage.includes('translate') || lowerMessage.includes('ترجم') ||
        lowerMessage.includes('to arabic') || lowerMessage.includes('to english') ||
        lowerMessage.includes('للعربية') || lowerMessage.includes('للإنجليزية')) {
      return { action: 'translate', tool: 'ai-translator', confidence: 0.9 }
    }
    
    // Summary patterns
    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary') ||
        lowerMessage.includes('لخص') || lowerMessage.includes('ملخص') ||
        lowerMessage.includes('shorten') || lowerMessage.includes('brief')) {
      return { action: 'summarize', tool: 'text-summarizer', confidence: 0.9 }
    }
    
    // Email patterns
    if (lowerMessage.includes('email') || lowerMessage.includes('بريد') ||
        lowerMessage.includes('write a letter') || lowerMessage.includes('رسالة')) {
      return { action: 'email', tool: 'ai-email-writer', confidence: 0.85 }
    }
    
    // Code patterns
    if (lowerMessage.includes('code') || lowerMessage.includes('كود') ||
        lowerMessage.includes('function') || lowerMessage.includes('script') ||
        lowerMessage.includes('program') || lowerMessage.includes('برمجة')) {
      return { action: 'code', tool: 'code-formatter', confidence: 0.8 }
    }
    
    return { action: 'general', confidence: 0.5 }
  }

  // Build context-aware prompt
  const buildPrompt = (userMessage: string, intent: DetectedIntent, conversationHistory: Message[]): string => {
    const historyContext = conversationHistory.slice(-4).map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n')

    const toolsContext = `Available tools: ${allTools.filter(t => t.isAI).map(t => t.title).join(', ')}`

    let systemPrompt = `You are an intelligent AI assistant for 24Toolkit, a platform with 80+ tools. You can help users with various tasks using the available tools.

${toolsContext}

Previous conversation:
${historyContext || 'No previous messages'}

Current user intent detected: ${intent.action} (confidence: ${Math.round(intent.confidence * 100)}%)
${intent.tool ? `Suggested tool: ${intent.tool}` : ''}

Instructions:
1. If the user wants to translate, summarize, write emails, or format code, perform that task directly
2. Provide clear, helpful responses
3. If you perform a tool action, mention which tool/capability you used
4. Be conversational but efficient
5. Support both English and Arabic

User message: ${userMessage}

Respond naturally and helpfully:`

    return systemPrompt
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const intent = detectIntent(userMessage.content)
      const prompt = buildPrompt(userMessage.content, intent, messages)

      let responseContent = ''
      
      await callAI(prompt, provider, (text) => {
        responseContent = text
      })

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        toolsUsed: intent.tool ? [intent.tool] : undefined,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'ai-translator': return <Translate size={14} />
      case 'text-summarizer': return <TextT size={14} />
      case 'ai-email-writer': return <Envelope size={14} />
      case 'code-formatter': return <Code size={14} />
      default: return <Lightning size={14} />
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success(isArabic ? 'تم مسح المحادثة' : 'Chat cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              {isArabic ? 'دردشة AI متعددة الأدوات' : 'Multi-Tool AI Chat'}
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            {isArabic 
              ? 'تحدث مع AI يفهم احتياجاتك ويستخدم الأدوات المناسبة تلقائياً'
              : 'Chat with AI that understands your needs and uses the right tools automatically'}
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center">
                  <Robot size={18} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'يستخدم أدوات متعددة' : 'Uses multiple tools'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AIProviderSelector value={provider} onValueChange={setProvider} />
                <Button variant="ghost" size="sm" onClick={clearChat}>
                  <ArrowsClockwise size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mb-4">
                  <Sparkle size={40} weight="fill" className="text-purple-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {isArabic ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?'}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-md">
                  {isArabic 
                    ? 'اطلب مني ترجمة، تلخيص، كتابة بريد، أو أي شيء آخر!'
                    : 'Ask me to translate, summarize, write emails, or anything else!'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-purple-500/20"
                    onClick={() => setInput(isArabic ? 'ترجم لي هذا النص للإنجليزية: ' : 'Translate this to Arabic: ')}>
                    <Translate size={12} className="mr-1" />
                    {isArabic ? 'ترجم' : 'Translate'}
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-purple-500/20"
                    onClick={() => setInput(isArabic ? 'لخص لي هذا: ' : 'Summarize this: ')}>
                    <TextT size={12} className="mr-1" />
                    {isArabic ? 'لخص' : 'Summarize'}
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-purple-500/20"
                    onClick={() => setInput(isArabic ? 'اكتب بريد احترافي عن: ' : 'Write a professional email about: ')}>
                    <Envelope size={12} className="mr-1" />
                    {isArabic ? 'بريد' : 'Email'}
                  </Badge>
                </div>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                      <Robot size={16} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-purple-500 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {message.toolsUsed.map(toolId => (
                          <Badge key={toolId} variant="outline" className="text-xs">
                            {getToolIcon(toolId)}
                            <span className="ml-1">{allTools.find(t => t.id === toolId)?.title || toolId}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {message.role === 'assistant' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-1 h-6 px-2 text-xs"
                        onClick={() => copyToClipboard(message.content, isArabic ? 'تم النسخ!' : 'Copied!')}
                      >
                        <Copy size={12} className="mr-1" />
                        {isArabic ? 'نسخ' : 'Copy'}
                      </Button>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                  <Robot size={16} className="text-white" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <AILoadingSpinner />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isArabic ? 'اكتب رسالتك...' : 'Type your message...'}
                className="min-h-[50px] max-h-[150px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-auto px-4 bg-gradient-to-r from-purple-600 to-sky-500"
              >
                <PaperPlaneTilt size={20} weight="fill" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

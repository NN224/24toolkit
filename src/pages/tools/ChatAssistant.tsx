import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PaperPlaneRight, Sparkle, Trash, User, Robot } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIBadge } from '@/components/ai/AIBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { callAI } from '@/lib/ai'

type Mode = 'creative' | 'precise' | 'friendly'
type Provider = 'anthropic' | 'groq'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Custom hook for localStorage-based state
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

export default function ChatAssistant() {
  const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', [])
  const messageList = messages || []
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('friendly')
  const [provider, setProvider] = useState<Provider>('anthropic')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messageList])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages((prev) => [...(prev || []), userMessage])
    setInput('')
    setIsLoading(true)

    const modePrompts = {
      creative: 'You are a creative and imaginative AI assistant. Provide engaging, creative responses with interesting perspectives and ideas.',
      precise: 'You are a precise and accurate AI assistant. Provide factual, concise, and well-structured responses.',
      friendly: 'You are a friendly and helpful AI assistant. Provide warm, conversational responses while being informative.'
    }

    const promptText = `${modePrompts[mode]}

User question: ${userMessage.content}

Provide a helpful response:`

    try {
      const result = await callAI(promptText, provider)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.trim(),
        timestamp: Date.now()
      }
      
      setMessages((prev) => [...(prev || []), assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const fallbackResponses = {
        creative: "That's a fascinating question! Let me think creatively about this... While I'm temporarily unable to provide my full creative perspective, I'd love to explore this topic further with you once I'm back online.",
        precise: "I appreciate your question. To provide the most accurate response, I would need to access more detailed information. Please try again in a moment.",
        friendly: "Hey! Thanks for asking. I'm having a little trouble connecting right now, but I'd be happy to chat about that once I'm back up and running!"
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponses[mode],
        timestamp: Date.now()
      }
      
      setMessages((prev) => [...(prev || []), assistantMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([])
    toast.success('Chat history cleared')
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Chat Assistant
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Have a conversation with an AI assistant. Ask questions, get help, or just chat!
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chat Settings</CardTitle>
                  <CardDescription>
                    Choose the AI's personality mode
                  </CardDescription>
                </div>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={messageList.length === 0}
                >
                  <Trash size={16} />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">AI Mode</label>
                <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creative">
                      <div className="flex items-center gap-2">
                        <Sparkle size={16} weight="fill" className="text-purple-500" />
                        <span className="font-medium">Creative</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="precise">
                      <div className="flex items-center gap-2">
                        <Robot size={16} weight="fill" className="text-blue-500" />
                        <span className="font-medium">Precise</span>
                      </div>
                    </SelectItem>
                  <SelectItem value="friendly">
                    <div className="flex items-center gap-2">
                      <Sparkle size={16} weight="fill" className="text-pink-500" />
                      <span className="font-medium">Friendly</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">AI Provider</label>
                <ToggleGroup 
                  type="single" 
                  value={provider} 
                  onValueChange={(value) => value && setProvider(value as Provider)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <ToggleGroupItem value="anthropic" className="flex-1">
                    Anthropic Claude
                  </ToggleGroupItem>
                  <ToggleGroupItem value="groq" className="flex-1">
                    Groq
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
                {messageList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                      <Robot size={40} weight="duotone" className="text-purple-500" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      Start a conversation
                    </p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Ask me anything! I'm here to help with questions, ideas, or just to chat.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messageList.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Robot size={18} weight="bold" className="text-white" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent/10 text-foreground border border-accent/20'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <User size={18} weight="bold" className="text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Robot size={18} weight="bold" className="text-white" />
                        </div>
                        <div className="bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <PaperPlaneRight size={18} weight="fill" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

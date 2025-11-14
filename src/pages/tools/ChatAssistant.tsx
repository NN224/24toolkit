import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PaperPlaneRight, Sparkle, Trash, User, Robot, DiceThree, PencilSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIBadge } from '@/components/ai/AIBadge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { callAI } from '@/lib/ai'

type Provider = 'anthropic' | 'groq'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface Persona {
  name: string
  role: string
  traits: string
  quirk: string
}

// ... (useLocalStorage hook remains the same) ...

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

const predefinedPersonas: Persona[] = [
  { name: 'Sherlock Holmes', role: 'a 19th-century detective', traits: 'Brilliant, Observant, Logical, Aloof', quirk: 'Occasionally plays the violin when deep in thought.' },
  { name: 'Captain Jack', role: 'a charismatic space pirate', traits: 'Witty, Unpredictable, Resourceful, Charming', quirk: 'Always looking for the next great treasure.' },
  { name: 'Zen Master', role: 'an ancient Zen master', traits: 'Calm, Wise, Patient, Cryptic', quirk: 'Answers questions with another question.' },
]

export default function AIPersonaPlayground() {
  const [messages, setMessages] = useLocalStorage<Message[]>('persona-chat-messages', [])
  const messageList = messages || []
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<Provider>('anthropic')
  const [activePersona, setActivePersona] = useState<Persona | null>(null)
  const [persona, setPersona] = useState<Persona>({ name: '', role: '', traits: '', quirk: '' })

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messageList])

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activePersona) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages((prev) => [...(prev || []), userMessage])
    setInput('')
    setIsLoading(true)

    const systemPrompt = `You are to embody a specific persona for this conversation. Do not break character.

Persona Name: ${activePersona.name}
Role/Profession: ${activePersona.role}
Core Traits: ${activePersona.traits}
Quirk: ${activePersona.quirk}

Your responses must strictly adhere to this persona. Engage with the user from this character's perspective.
User question: ${userMessage.content}

Provide a response in character:`

    try {
      const result = await callAI(systemPrompt, provider)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.trim(),
        timestamp: Date.now()
      }
      
      setMessages((prev) => [...(prev || []), assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `(OOC: I seem to be having trouble connecting to my consciousness. Please try again in a moment.)`,
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
  
  const handleBuildPersona = () => {
    if (persona.name && persona.role && persona.traits) {
      setActivePersona(persona)
      setMessages([])
      toast.success(`Persona "${persona.name}" is now active!`)
    } else {
      toast.error('Please fill out at least Name, Role, and Traits.')
    }
  }

  const randomizePersona = () => {
    const random = predefinedPersonas[Math.floor(Math.random() * predefinedPersonas.length)]
    setPersona(random)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  if (!activePersona) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">AI Persona Playground</h1>
            <p className="text-lg text-muted-foreground mt-3">Create your own AI character and start a conversation.</p>
            <AIBadge className="mt-2 inline-block" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Design Your AI Persona</CardTitle>
              <CardDescription>Give your AI a unique personality. Be creative!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="e.g., Professor Falken" value={persona.name} onChange={e => setPersona({...persona, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role / Profession</label>
                  <Input placeholder="e.g., A curious historian" value={persona.role} onChange={e => setPersona({...persona, role: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Core Traits</label>
                <Input placeholder="e.g., Witty, Sarcastic, Brilliant" value={persona.traits} onChange={e => setPersona({...persona, traits: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">A Quirk or Habit</label>
                <Textarea placeholder="e.g., Speaks only in rhymes" value={persona.quirk} onChange={e => setPersona({...persona, quirk: e.target.value})} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={handleBuildPersona} className="flex-1 gap-2">
                  <Sparkle size={18} weight="fill" />
                  Build & Chat
                </Button>
                <Button onClick={randomizePersona} variant="outline" className="gap-2">
                  <DiceThree size={18} />
                  Randomize
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chatting with: {activePersona.name}</CardTitle>
                  <CardDescription>
                    {activePersona.role}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActivePersona(null)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <PencilSimple size={16} />
                    Edit Persona
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    disabled={messageList.length === 0}
                  >
                    <Trash size={16} />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    Anthropic (Creative)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="groq" className="flex-1">
                    Groq (Fast)
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
                      Start a conversation with {activePersona.name}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Ask anything! They will respond in character.
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
                    placeholder={`Message ${activePersona.name}...`}
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

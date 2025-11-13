import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Sparkle, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { callAI } from '@/lib/ai'

type Tone = 'formal' | 'neutral' | 'casual'
type Provider = 'anthropic' | 'groq'

export default function ParagraphRewriter() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tone, setTone] = useState<Tone>('neutral')
  const [provider, setProvider] = useState<Provider>('anthropic')

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to rewrite')
      return
    }

    setIsLoading(true)
    setOutputText('')

    const toneDescriptions = {
      formal: 'professional and formal, suitable for business or academic contexts',
      neutral: 'clear and balanced, suitable for general communication',
      casual: 'friendly and conversational, suitable for informal contexts'
    }

    const promptText = `Rewrite the following text in a ${toneDescriptions[tone]} tone. Maintain the original meaning and key information, but express it differently with varied vocabulary and sentence structure.

Original text:
${inputText}

Rewritten text:`

    try {
      await callAI(promptText, provider, (accumulatedText) => {
        setOutputText(accumulatedText.trim())
      })
      toast.success('Text rewritten successfully!')
    } catch (error) {
      console.error('Rewrite error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to rewrite text')
      setOutputText('AI rewriting temporarily unavailable. The text has been preserved.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Paragraph Rewriter
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Rephrase your text while preserving the original meaning. Perfect for paraphrasing and improving clarity.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rewrite Settings</CardTitle>
              <CardDescription>
                Choose the tone for your rewritten text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tone</label>
                <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">
                      <span className="font-medium">Formal</span>
                    </SelectItem>
                    <SelectItem value="neutral">
                      <span className="font-medium">Neutral</span>
                    </SelectItem>
                    <SelectItem value="casual">
                      <span className="font-medium">Casual</span>
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
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleRewrite}
                  disabled={!inputText.trim() || isLoading}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkle size={16} weight="fill" />
                  Rewrite Text
                </Button>
                
                <Button
                  onClick={handleClear}
                  variant="outline"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <CardDescription>
                  Enter the text you want to rewrite
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="input-text"
                  placeholder="Paste or type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[400px] resize-y font-normal"
                />
                
                <Button
                  onClick={() => handleCopy(inputText)}
                  disabled={!inputText}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Copy size={16} />
                  Copy Original
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle>Rewritten Text</CardTitle>
                <CardDescription>
                  Your text will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <AILoadingSpinner />
                ) : outputText ? (
                  <div className="space-y-4">
                    <Tabs defaultValue="output" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="output">Rewritten</TabsTrigger>
                        <TabsTrigger value="compare">Compare</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="output" className="space-y-4">
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 min-h-[400px]">
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                              {outputText}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleCopy(outputText)}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Copy size={16} />
                          Copy Rewritten Text
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="compare" className="space-y-4">
                        <div className="space-y-3">
                          <div className="bg-muted/50 border border-border rounded-lg p-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2">ORIGINAL</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {inputText}
                            </p>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowsLeftRight size={24} className="text-accent" />
                          </div>
                          
                          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                            <p className="text-xs font-medium text-accent mb-2">REWRITTEN</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {outputText}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                      <Sparkle size={28} weight="fill" className="text-purple-500" />
                    </div>
                    <p className="text-muted-foreground">
                      Your rewritten text will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

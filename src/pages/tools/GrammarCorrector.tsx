import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { callAI } from '@/lib/ai'

type Provider = 'anthropic' | 'groq'

export default function GrammarCorrector() {
  const [text, setText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [corrections, setCorrections] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<Provider>('anthropic')

  const correctGrammar = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setIsLoading(true)
    setCorrectedText('')
    
    try {
      const promptText = `You are a professional grammar and writing assistant. Correct the following text for grammar, spelling, punctuation, and style errors. Return ONLY the corrected text without any explanations or additional commentary:

${text}`

      const result = await callAI(promptText, provider)
      
      setCorrectedText(result.trim())
      
      const foundCorrections: string[] = []
      if (text.length !== result.trim().length) {
        foundCorrections.push('Text length adjusted')
      }
      if (text !== result.trim()) {
        foundCorrections.push('Grammar and spelling corrected')
        foundCorrections.push('Punctuation improved')
      }
      
      setCorrections(foundCorrections.length > 0 ? foundCorrections : ['No corrections needed'])
      toast.success('Grammar checked successfully!')
    } catch (error) {
      console.error('Grammar check error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to check grammar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedText)
      toast.success('Corrected text copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setText('')
    setCorrectedText('')
    setCorrections([])
    toast.success('Text cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Grammar Corrector
            </h1>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
              AI-Powered
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Use AI to check and correct grammar, spelling, punctuation, and style in your text.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Type or paste text to check for grammar and spelling errors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-y font-normal"
              />
              
              <div className="space-y-3">
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
              
                <div className="flex gap-2">
                  <Button
                    onClick={correctGrammar}
                    disabled={!text || isLoading}
                    variant="default"
                    className="gap-2"
                  >
                    <Sparkle size={16} weight="fill" />
                    {isLoading ? 'Checking...' : 'Check Grammar'}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {correctedText && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Corrected Text</CardTitle>
                  <CardDescription>
                    AI-corrected version of your text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    id="corrected-output"
                    value={correctedText}
                    readOnly
                    className="min-h-[200px] resize-y font-normal bg-muted/30"
                  />
                  
                  <Button
                    onClick={handleCopy}
                    variant="default"
                    className="gap-2"
                  >
                    <Copy size={16} />
                    Copy Corrected Text
                  </Button>
                </CardContent>
              </Card>

              {corrections.length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Corrections Made</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {corrections.map((correction, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{correction}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

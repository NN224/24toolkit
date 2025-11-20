import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Globe, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
]

export default function AITranslator() {
  // Set SEO metadata
  const metadata = getPageMetadata('ai-translator')
  useSEO(metadata)

  const [inputText, setInputText] = useState('')
  const [targetLang, setTargetLang] = useState('es')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const translateText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to translate')
      return
    }

    setLoading(true)
    setTranslatedText('')
    
    try {
      const promptText = `Translate the following text to ${languages.find(l => l.code === targetLang)?.name}. Return only the translation, nothing else:

${inputText}`

      await callAI(promptText, provider, (accumulatedText) => {
        setTranslatedText(accumulatedText)
      })
      toast.success('Translation complete!')
    } catch (error) {
      console.error('Translation error:', error)
      toast.error(error instanceof Error ? error.message : 'Translation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 ai-glow">
            <Globe size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">AI Text Translator</h1>
            <p className="text-muted-foreground">Translate text between multiple languages using AI</p>
          </div>
        </div>
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI-Powered Translation</CardTitle>
              <CardDescription>Natural, context-aware translations</CardDescription>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
              Powered by AI
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Text to Translate</Label>
            <Textarea
              id="input-text"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-lang">Target Language</Label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger id="target-lang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AIProviderSelector value={provider} onValueChange={setProvider} />

          <Button
            onClick={translateText}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </Button>

          {translatedText && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>Translation</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(translatedText)}>
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <p className="text-foreground whitespace-pre-wrap">{translatedText}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

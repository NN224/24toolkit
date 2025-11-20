import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Code, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function CodeFormatter() {
  // Set SEO metadata
  const metadata = getPageMetadata('code-formatter')
  useSEO(metadata)

  const [code, setCode] = useState('')
  const [formattedCode, setFormattedCode] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'format' | 'explain'>('format')
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const detectLanguage = (code: string): string => {
    if (code.includes('function') || code.includes('const') || code.includes('let')) return 'javascript'
    if (code.includes('def ') || code.includes('import ')) return 'python'
    if (code.includes('<html') || code.includes('</div>')) return 'html'
    if (code.includes('{') && code.includes('color:')) return 'css'
    if (code.includes('interface') || code.includes(': string')) return 'typescript'
    return 'javascript'
  }

  const handleFormat = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to format')
      return
    }

    setIsLoading(true)
    setActiveTab('format')
    setFormattedCode('')

    const language = detectLanguage(code)

    const promptText = `Format and beautify the following ${language} code. Ensure proper indentation, spacing, and follow best practices. Return only the formatted code without any explanations or markdown code blocks.

Code:
${code}`

    try {
      const result = await callAI(promptText, provider)
      setFormattedCode(result.trim())
      toast.success('Code formatted successfully!')
    } catch (error) {
      console.error('Format error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to format code')
      setFormattedCode(code)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to explain')
      return
    }

    setIsLoading(true)
    setActiveTab('explain')
    setExplanation('')

    const language = detectLanguage(code)

    const promptText = `Explain the following ${language} code in simple, clear terms. Break down what each part does and explain the overall purpose. Use bullet points for clarity.

Code:
${code}`

    try {
      await callAI(promptText, provider, (accumulatedText) => {
        setExplanation(accumulatedText.trim())
      })
      toast.success('Code explained successfully!')
    } catch (error) {
      console.error('Explanation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to explain code')
      setExplanation('AI explanation temporarily unavailable.')
    } finally {
      setIsLoading(false)
    }
  }



  const handleClear = () => {
    setCode('')
    setFormattedCode('')
    setExplanation('')
    toast.success('Cleared')
  }

  const detectedLang = code ? detectLanguage(code) : 'javascript'

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Code Formatter & Explainer
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Beautify your code and get clear explanations of what it does. Supports multiple programming languages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Code</CardTitle>
              <CardDescription>
                Paste your code here (language auto-detected)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="code-input"
                placeholder="// Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[500px] resize-y font-mono text-sm"
                spellCheck={false}
              />
              
              {code && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code size={16} />
                  <span>Detected: <span className="font-medium text-foreground">{detectedLang}</span></span>
                </div>
              )}
              
              <div className="space-y-3">
                <AIProviderSelector value={provider} onValueChange={setProvider} />
                
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleFormat}
                  disabled={!code.trim() || isLoading}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Code size={16} />
                  Format Code
                </Button>
                
                <Button
                  onClick={handleExplain}
                  disabled={!code.trim() || isLoading}
                  variant="outline"
                  className="gap-2"
                >
                  <Sparkle size={16} weight="fill" />
                  Explain Code
                </Button>
              </div>
                
                <Button
                  onClick={handleClear}
                  variant="outline"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                Formatted code and AI explanation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'format' | 'explain')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="format">Formatted Code</TabsTrigger>
                  <TabsTrigger value="explain">Explanation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="format" className="space-y-4 mt-4">
                  {isLoading && activeTab === 'format' ? (
                    <AILoadingSpinner />
                  ) : formattedCode ? (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border border-accent/20">
                        <SyntaxHighlighter
                          language={detectedLang}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '0.875rem',
                            maxHeight: '500px',
                          }}
                          showLineNumbers
                        >
                          {formattedCode}
                        </SyntaxHighlighter>
                      </div>
                      
                      <Button
                        onClick={() => copyToClipboard(formattedCode)}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <Copy size={16} />
                        Copy Formatted Code
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center min-h-[400px]">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
                        <Code size={28} className="text-blue-500" />
                      </div>
                      <p className="text-muted-foreground">
                        Your formatted code will appear here
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="explain" className="space-y-4 mt-4">
                  {isLoading && activeTab === 'explain' ? (
                    <AILoadingSpinner />
                  ) : explanation ? (
                    <div className="space-y-4">
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 min-h-[400px]">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                            {explanation}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => copyToClipboard(explanation)}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <Copy size={16} />
                        Copy Explanation
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center min-h-[400px]">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                        <Sparkle size={28} weight="fill" className="text-purple-500" />
                      </div>
                      <p className="text-muted-foreground">
                        Code explanation will appear here
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

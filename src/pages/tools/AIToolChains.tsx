import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Spinner, 
  Copy,
  Lightning,
  ArrowsClockwise
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { AIBadge } from '@/components/ai/AIBadge'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { 
  CHAIN_TEMPLATES, 
  executeChain, 
  getChainCategories,
  type ChainTemplate,
  type ChainResult 
} from '@/lib/tool-chains'

type StepStatus = 'pending' | 'running' | 'success' | 'error'

interface StepState {
  status: StepStatus
  output: string
  error?: string
  duration?: number
}

export default function AIToolChains() {
  const metadata = getPageMetadata('ai-tool-chains')
  useSEO(metadata)

  const [input, setInput] = useState('')
  const [selectedChain, setSelectedChain] = useState<ChainTemplate | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [stepStates, setStepStates] = useState<StepState[]>([])
  const [finalOutput, setFinalOutput] = useState('')
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const copyToClipboard = useCopyToClipboard()

  const categories = getChainCategories()

  const filteredChains = activeCategory === 'all' 
    ? CHAIN_TEMPLATES 
    : CHAIN_TEMPLATES.filter(c => c.category === activeCategory)

  const selectChain = (chain: ChainTemplate) => {
    setSelectedChain(chain)
    setStepStates(chain.steps.map(() => ({ status: 'pending', output: '' })))
    setFinalOutput('')
  }

  const runChain = useCallback(async () => {
    if (!selectedChain || !input.trim()) {
      toast.error('Please enter text and select a chain')
      return
    }

    setIsRunning(true)
    setFinalOutput('')
    setStepStates(selectedChain.steps.map(() => ({ status: 'pending', output: '' })))

    try {
      const result = await executeChain(
        selectedChain,
        input,
        provider,
        // On step complete
        (stepResult: ChainResult, stepIndex: number) => {
          setStepStates(prev => {
            const newStates = [...prev]
            newStates[stepIndex] = {
              status: stepResult.success ? 'success' : 'error',
              output: stepResult.output,
              error: stepResult.error,
              duration: stepResult.duration
            }
            return newStates
          })
        },
        // On step progress (streaming)
        (text: string, stepIndex: number) => {
          setStepStates(prev => {
            const newStates = [...prev]
            if (newStates[stepIndex].status === 'pending') {
              newStates[stepIndex] = { status: 'running', output: text }
            } else {
              newStates[stepIndex] = { ...newStates[stepIndex], output: text }
            }
            return newStates
          })
        }
      )

      if (result.success) {
        setFinalOutput(result.finalOutput)
        toast.success(`Chain completed in ${(result.totalDuration / 1000).toFixed(1)}s!`)
      } else {
        toast.error('Chain failed at one of the steps')
      }
    } catch (error) {
      toast.error('Failed to execute chain')
      console.error(error)
    } finally {
      setIsRunning(false)
    }
  }, [selectedChain, input, provider])

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
      case 'running':
        return <Spinner size={20} className="text-purple-500 animate-spin" />
      case 'success':
        return <CheckCircle size={20} weight="fill" className="text-green-500" />
      case 'error':
        return <XCircle size={20} weight="fill" className="text-red-500" />
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Tool Chains
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Connect multiple AI tools together for powerful automated workflows. Chain translate → summarize → expand and more!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chain Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select a Chain</CardTitle>
                <CardDescription>Choose a predefined workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={activeCategory === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory('all')}
                  >
                    All
                  </Badge>
                  {categories.map(cat => (
                    <Badge
                      key={cat.id}
                      variant={activeCategory === cat.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>

                {/* Chain List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredChains.map(chain => (
                    <button
                      key={chain.id}
                      onClick={() => selectChain(chain)}
                      disabled={isRunning}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedChain?.id === chain.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border hover:border-purple-500/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{chain.icon}</span>
                        <span className="font-medium text-foreground">{chain.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{chain.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {chain.steps.map((step, i) => (
                          <div key={i} className="flex items-center">
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {step.toolName}
                            </span>
                            {i < chain.steps.length - 1 && (
                              <ArrowRight size={12} className="mx-1 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Input & Execution */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Input Text</CardTitle>
                <CardDescription>Enter the text to process through the chain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px]"
                  disabled={isRunning}
                />
                
                <AIProviderSelector value={provider} onValueChange={setProvider} />

                <Button
                  onClick={runChain}
                  disabled={!selectedChain || !input.trim() || isRunning}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-sky-500"
                >
                  {isRunning ? (
                    <>
                      <Spinner size={18} className="animate-spin" />
                      Running Chain...
                    </>
                  ) : (
                    <>
                      <Play size={18} weight="fill" />
                      Run Chain
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Chain Steps Status */}
            {selectedChain && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightning size={20} weight="fill" className="text-yellow-500" />
                    Chain Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedChain.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getStatusIcon(stepStates[i]?.status || 'pending')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{step.toolName}</span>
                            {stepStates[i]?.duration && (
                              <span className="text-xs text-muted-foreground">
                                ({(stepStates[i].duration! / 1000).toFixed(1)}s)
                              </span>
                            )}
                          </div>
                          {stepStates[i]?.status === 'running' && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {stepStates[i].output.slice(0, 100)}...
                            </p>
                          )}
                          {stepStates[i]?.error && (
                            <p className="text-xs text-red-500 mt-1">
                              {stepStates[i].error}
                            </p>
                          )}
                        </div>
                        {i < selectedChain.steps.length - 1 && (
                          <ArrowRight size={16} className="text-muted-foreground mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="space-y-4">
            <Card className="border-2 border-accent/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Final Output</CardTitle>
                    <CardDescription>Result after all chain steps</CardDescription>
                  </div>
                  {finalOutput && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(finalOutput, 'Copied!')}
                      className="gap-1"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {finalOutput ? (
                  <div className="bg-muted/50 rounded-lg p-4 min-h-[300px]">
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
                      {finalOutput}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mb-4">
                      <ArrowsClockwise size={28} className="text-purple-500" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Select a chain and run it to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step Outputs (Collapsible) */}
            {stepStates.some(s => s.output) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Step Outputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedChain?.steps.map((step, i) => (
                    stepStates[i]?.output && (
                      <details key={i} className="group">
                        <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium hover:text-purple-500">
                          <span>{step.toolName}</span>
                          {getStatusIcon(stepStates[i].status)}
                        </summary>
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground max-h-[150px] overflow-y-auto">
                          {stepStates[i].output}
                        </div>
                      </details>
                    )
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

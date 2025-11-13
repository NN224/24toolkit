import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function URLEncoderDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error('Please enter text to encode')
      return
    }

    try {
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
      toast.success('URL encoded!')
    } catch (error) {
      toast.error('Failed to encode')
    }
  }

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error('Please enter URL to decode')
      return
    }

    try {
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
      toast.success('URL decoded!')
    } catch (error) {
      toast.error('Invalid URL encoding')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    toast.success('Cleared')
  }

  const handleSwap = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            URL Encoder / Decoder
          </h1>
          <p className="text-lg text-muted-foreground">
            Encode or decode URLs and query parameters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                {mode === 'encode' ? 'Enter text to URL encode' : 'Enter URL to decode'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encode">Encode</TabsTrigger>
                  <TabsTrigger value="decode">Decode</TabsTrigger>
                </TabsList>
              </Tabs>

              <Textarea
                id="url-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text with special characters...' 
                  : 'Enter URL encoded string...'
                }
                className="font-mono text-sm min-h-[300px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={mode === 'encode' ? handleEncode : handleDecode} 
                  className="flex-1"
                >
                  {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                {mode === 'encode' ? 'URL encoded result' : 'Decoded result'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {output ? (
                <>
                  <Textarea
                    value={output}
                    readOnly
                    className="font-mono text-sm min-h-[300px] bg-muted"
                  />

                  <div className="flex gap-2">
                    <Button onClick={handleCopy} className="flex-1">
                      <Copy size={18} className="mr-2" />
                      Copy Result
                    </Button>
                    <Button onClick={handleSwap} variant="outline">
                      <ArrowsLeftRight size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="min-h-[300px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  Result will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common URL Encoded Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded">Space → %20</div>
                <div className="font-mono bg-muted p-2 rounded">! → %21</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded"># → %23</div>
                <div className="font-mono bg-muted p-2 rounded">$ → %24</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded">& → %26</div>
                <div className="font-mono bg-muted p-2 rounded">= → %3D</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded">? → %3F</div>
                <div className="font-mono bg-muted p-2 rounded">@ → %40</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

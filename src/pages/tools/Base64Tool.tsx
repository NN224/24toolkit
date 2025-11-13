import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error('Please enter text to encode')
      return
    }

    try {
      const encoded = btoa(input)
      setOutput(encoded)
      toast.success('Encoded to Base64!')
    } catch (error) {
      toast.error('Failed to encode text')
    }
  }

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error('Please enter Base64 to decode')
      return
    }

    try {
      const decoded = atob(input)
      setOutput(decoded)
      toast.success('Decoded from Base64!')
    } catch (error) {
      toast.error('Invalid Base64 string')
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
            Base64 Encoder / Decoder
          </h1>
          <p className="text-lg text-muted-foreground">
            Encode text to Base64 or decode Base64 back to text
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                {mode === 'encode' ? 'Enter text to encode' : 'Enter Base64 to decode'}
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
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter plain text...' : 'Enter Base64 string...'}
                className="font-mono text-sm min-h-[300px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={mode === 'encode' ? handleEncode : handleDecode} 
                  className="flex-1"
                >
                  {mode === 'encode' ? 'Encode' : 'Decode'}
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
                {mode === 'encode' ? 'Base64 encoded result' : 'Decoded text result'}
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
            <CardTitle>About Base64</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format.
              It's commonly used for encoding data in emails, URLs, and data URIs for images.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

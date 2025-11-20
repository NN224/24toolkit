import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, CheckCircle, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function JSONBeautifier() {
  // Set SEO metadata
  const metadata = getPageMetadata('json-beautifier')
  useSEO(metadata)

  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const copyToClipboard = useCopyToClipboard()

  const handleBeautify = () => {
    if (!input.trim()) {
      toast.error('Please enter JSON to beautify')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const beautified = JSON.stringify(parsed, null, 2)
      setFormatted(beautified)
      setIsValid(true)
      setError('')
      toast.success('JSON is valid and beautified!')
    } catch (err) {
      setIsValid(false)
      setError((err as Error).message)
      setFormatted('')
      toast.error('Invalid JSON')
    }
  }

  const handleMinify = () => {
    if (!input.trim()) {
      toast.error('Please enter JSON to minify')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setFormatted(minified)
      setIsValid(true)
      setError('')
      toast.success('JSON minified!')
    } catch (err) {
      setIsValid(false)
      setError((err as Error).message)
      setFormatted('')
      toast.error('Invalid JSON')
    }
  }



  const handleClear = () => {
    setInput('')
    setFormatted('')
    setIsValid(null)
    setError('')
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            JSON Beautifier / Validator
          </h1>
          <p className="text-lg text-muted-foreground">
            Format, validate, and minify JSON data instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Input JSON
                {isValid !== null && (
                  isValid ? (
                    <CheckCircle size={20} className="text-green-500" weight="fill" />
                  ) : (
                    <XCircle size={20} className="text-red-500" weight="fill" />
                  )
                )}
              </CardTitle>
              <CardDescription>Paste your JSON here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="json-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setIsValid(null)
                  setError('')
                }}
                placeholder='{"name": "John", "age": 30}'
                className="font-mono text-sm min-h-[400px]"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-mono">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleBeautify} className="flex-1">
                  Beautify
                </Button>
                <Button onClick={handleMinify} variant="outline" className="flex-1">
                  Minify
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
              <CardDescription>Formatted or minified JSON</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formatted ? (
                <div className="relative">
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      maxHeight: '400px',
                      fontSize: '0.875rem'
                    }}
                  >
                    {formatted}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  Formatted JSON will appear here
                </div>
              )}

              {formatted && (
                <Button onClick={() => copyToClipboard(formatted, 'JSON copied!')} className="w-full">
                  <Copy size={18} className="mr-2" />
                  Copy JSON
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

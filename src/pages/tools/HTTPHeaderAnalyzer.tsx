import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MagnifyingGlass, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function HTTPHeaderAnalyzer() {
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyzeHeaders = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    let finalUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url
    }

    setLoading(true)
    setError('')
    setHeaders({})

    try {
      const response = await fetch(finalUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
      })
      
      const headerObj: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headerObj[key] = value
      })

      if (Object.keys(headerObj).length === 0) {
        setError('Unable to retrieve headers due to CORS restrictions. This is a browser security limitation.')
        setHeaders({
          'Note': 'CORS restrictions prevent direct header analysis',
          'Server': 'Headers are blocked by the server\'s CORS policy',
          'Status': response.status.toString(),
          'Tip': 'For full header analysis, use server-side tools or browser DevTools'
        })
      } else {
        setHeaders(headerObj)
      }
      
      toast.success('Headers retrieved!')
    } catch (err) {
      setError('Failed to fetch headers. The server may block cross-origin requests.')
      setHeaders({
        'Error': 'CORS policy blocked the request',
        'Solution': 'Use browser DevTools (Network tab) to view headers',
        'Alternative': 'Use a server-side proxy or browser extension'
      })
    } finally {
      setLoading(false)
    }
  }

  const copyHeaders = () => {
    const text = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Headers copied to clipboard!')
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <MagnifyingGlass size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">HTTP Header Analyzer</h1>
            <p className="text-muted-foreground">Analyze HTTP response headers from any URL</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze HTTP Headers</CardTitle>
          <CardDescription>Enter a URL to view its HTTP response headers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="e.g., https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <Button onClick={analyzeHeaders} className="w-full" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Headers'}
          </Button>

          {error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">{error}</p>
            </div>
          )}

          {Object.keys(headers).length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>HTTP Headers</Label>
                <Button variant="ghost" size="sm" onClick={copyHeaders}>
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {Object.entries(headers).map(([key, value]) => (
                    <div key={key} className="pb-2 border-b border-border/50 last:border-0">
                      <p className="text-xs font-semibold text-primary uppercase">{key}</p>
                      <p className="text-sm text-foreground font-mono break-all mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  💡 Tip: Use browser DevTools (Network tab) for complete header analysis without CORS limitations.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

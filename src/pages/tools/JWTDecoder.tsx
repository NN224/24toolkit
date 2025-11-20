import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Key } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

interface DecodedJWT {
  header: any
  payload: any
  signature: string
}

export default function JWTDecoder() {
  // Set SEO metadata
  const metadata = getPageMetadata('jwt-decoder')
  useSEO(metadata)

  const [jwt, setJwt] = useState('')
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState('')

  const decodeJWT = () => {
    if (!jwt.trim()) {
      toast.error('Please enter a JWT token')
      return
    }

    try {
      const parts = jwt.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Must have 3 parts separated by dots.')
      }

      const header = JSON.parse(atob(parts[0]))
      const payload = JSON.parse(atob(parts[1]))
      const signature = parts[2]

      setDecoded({ header, payload, signature })
      setError('')
      toast.success('JWT decoded successfully!')
    } catch (err) {
      setError((err as Error).message)
      setDecoded(null)
      toast.error('Failed to decode JWT')
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleClear = () => {
    setJwt('')
    setDecoded(null)
    setError('')
    toast.success('Cleared')
  }

  const formatTimestamp = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString()
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            JWT Decoder
          </h1>
          <p className="text-lg text-muted-foreground">
            Decode and inspect JSON Web Tokens (JWT)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key size={20} />
                JWT Token
              </CardTitle>
              <CardDescription>Paste your JWT token here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="jwt-input"
                value={jwt}
                onChange={(e) => {
                  setJwt(e.target.value)
                  setError('')
                }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="font-mono text-sm min-h-[300px]"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={decodeJWT} className="flex-1">
                  Decode JWT
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decoded Output</CardTitle>
              <CardDescription>Header, payload, and signature</CardDescription>
            </CardHeader>
            <CardContent>
              {decoded ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-blue-600">Header</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2))}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                    <pre className="bg-blue-50 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      {JSON.stringify(decoded.header, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-purple-600">Payload</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2))}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                    <pre className="bg-purple-50 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-[300px]">
                      {JSON.stringify(decoded.payload, null, 2)}
                    </pre>
                  </div>

                  {(decoded.payload.exp || decoded.payload.iat || decoded.payload.nbf) && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-sm mb-2">Timestamps</h3>
                      <div className="space-y-2 text-sm">
                        {decoded.payload.iat && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Issued At:</span>
                            <span className="font-mono">{formatTimestamp(decoded.payload.iat)}</span>
                          </div>
                        )}
                        {decoded.payload.exp && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expires At:</span>
                            <span className="font-mono">{formatTimestamp(decoded.payload.exp)}</span>
                          </div>
                        )}
                        {decoded.payload.nbf && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Not Before:</span>
                            <span className="font-mono">{formatTimestamp(decoded.payload.nbf)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-orange-600">Signature</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(decoded.signature)}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-xs font-mono break-all">
                      {decoded.signature}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  Decoded JWT will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">⚠️</span>
                <span>
                  This tool only <strong>decodes</strong> JWTs. It does not validate signatures.
                  Never paste sensitive tokens into online tools. This decoder runs entirely in your browser.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

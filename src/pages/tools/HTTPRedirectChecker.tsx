import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, MagnifyingGlass, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function HTTPRedirectChecker() {
  const [url, setUrl] = useState('')
  const [redirectChain, setRedirectChain] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const checkRedirects = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    setIsLoading(true)
    const chain: any[] = []

    try {
      let testUrl = url.startsWith('http') ? url : `http://${url}`
      
      const httpResponse = await fetch(testUrl, { 
        method: 'HEAD',
        redirect: 'manual'
      }).catch(() => null)

      if (httpResponse) {
        chain.push({
          url: testUrl,
          status: httpResponse.status,
          statusText: httpResponse.statusText,
          protocol: 'HTTP',
          redirectTo: httpResponse.headers.get('location') || null
        })
      }

      testUrl = url.startsWith('http') ? url.replace('http://', 'https://') : `https://${url}`
      
      const httpsResponse = await fetch(testUrl, {
        method: 'HEAD',
        redirect: 'manual'
      }).catch(() => null)

      if (httpsResponse) {
        chain.push({
          url: testUrl,
          status: httpsResponse.status,
          statusText: httpsResponse.statusText,
          protocol: 'HTTPS',
          redirectTo: httpsResponse.headers.get('location') || null
        })
      }

      if (chain.length === 0) {
        chain.push({
          url: url,
          status: 0,
          statusText: 'Unable to connect',
          protocol: 'Unknown',
          error: true
        })
      }

      setRedirectChain(chain)
      toast.success('Redirect check completed')
    } catch (error) {
      setRedirectChain([{
        url: url,
        status: 0,
        statusText: 'Connection failed',
        protocol: 'Unknown',
        error: true
      }])
      toast.error('Failed to check redirects')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 300 && status < 400) return 'text-blue-600'
    if (status >= 400 && status < 500) return 'text-yellow-600'
    if (status >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  const hasHTTPSRedirect = redirectChain.some(
    item => item.protocol === 'HTTP' && item.redirectTo?.startsWith('https://')
  )

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            HTTP/HTTPS Redirect Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze HTTP to HTTPS redirects and check redirect chains.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter URL</CardTitle>
              <CardDescription>
                Enter a URL to analyze its redirect behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">URL</Label>
                <Input
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com or https://example.com"
                  type="text"
                />
              </div>

              <Button 
                onClick={checkRedirects}
                disabled={isLoading}
                className="w-full gap-2" 
                size="lg"
              >
                <MagnifyingGlass size={20} />
                {isLoading ? 'Checking...' : 'Check Redirects'}
              </Button>
            </CardContent>
          </Card>

          {redirectChain.length > 0 && (
            <>
              {hasHTTPSRedirect ? (
                <Alert variant="default" className="border-green-500 bg-green-50">
                  <CheckCircle size={24} className="text-green-600" />
                  <AlertDescription>
                    <p className="font-bold text-green-700">✓ HTTPS Redirect Configured</p>
                    <p className="text-sm mt-1">This site properly redirects HTTP traffic to HTTPS.</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="default" className="border-yellow-500 bg-yellow-50">
                  <Warning size={24} className="text-yellow-600" />
                  <AlertDescription>
                    <p className="font-bold text-yellow-700">⚠ No HTTPS Redirect Detected</p>
                    <p className="text-sm mt-1">Consider implementing HTTP to HTTPS redirects for better security.</p>
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Redirect Chain</CardTitle>
                  <CardDescription>
                    Complete redirect path analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {redirectChain.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-background rounded text-xs font-mono">
                              {item.protocol}
                            </span>
                            <span className="text-sm font-medium break-all">
                              {item.url}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Status: </span>
                            <span className={`font-semibold ${getStatusColor(item.status)}`}>
                              {item.status} {item.statusText}
                            </span>
                          </div>
                        </div>

                        {item.redirectTo && (
                          <div className="flex items-start gap-2 text-sm">
                            <ArrowRight size={16} className="mt-1 text-blue-600" />
                            <div>
                              <span className="text-muted-foreground">Redirects to: </span>
                              <span className="font-mono text-blue-600 break-all">
                                {item.redirectTo}
                              </span>
                            </div>
                          </div>
                        )}

                        {item.error && (
                          <p className="text-sm text-red-600">
                            Unable to connect to this URL
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

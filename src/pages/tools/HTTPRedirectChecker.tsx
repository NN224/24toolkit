import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, MagnifyingGlass, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function HTTPRedirectChecker() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('http-redirect-checker')
  useSEO({ ...metadata, canonicalPath: '/tools/http-redirect-checker' })

  const [url, setUrl] = useState('')
  const [redirectChain, setRedirectChain] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const checkRedirects = async () => {
    if (!url.trim()) {
      toast.error(t('tools.httpRedirectChecker.enterUrlError'))
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
          statusText: t('tools.httpRedirectChecker.unableToConnect'),
          protocol: t('tools.httpRedirectChecker.unknown'),
          error: true
        })
      }

      setRedirectChain(chain)
      toast.success(t('tools.httpRedirectChecker.checkCompleted'))
    } catch (error) {
      setRedirectChain([{
        url: url,
        status: 0,
        statusText: t('tools.httpRedirectChecker.connectionFailed'),
        protocol: t('tools.httpRedirectChecker.unknown'),
        error: true
      }])
      toast.error(t('tools.httpRedirectChecker.checkFailed'))
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
            {t('tools.httpRedirectChecker.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.httpRedirectChecker.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.httpRedirectChecker.enterUrl')}</CardTitle>
              <CardDescription>
                {t('tools.httpRedirectChecker.enterUrlDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">{t('tools.httpRedirectChecker.urlLabel')}</Label>
                <Input
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t('tools.httpRedirectChecker.urlPlaceholder')}
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
                {isLoading ? t('tools.httpRedirectChecker.checking') : t('tools.httpRedirectChecker.checkButton')}
              </Button>
            </CardContent>
          </Card>

          {redirectChain.length > 0 && (
            <>
              {hasHTTPSRedirect ? (
                <Alert variant="default" className="border-green-500 bg-green-50">
                  <CheckCircle size={24} className="text-green-600" />
                  <AlertDescription>
                    <p className="font-bold text-green-700">✓ {t('tools.httpRedirectChecker.httpsConfigured')}</p>
                    <p className="text-sm mt-1">{t('tools.httpRedirectChecker.httpsConfiguredDesc')}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="default" className="border-yellow-500 bg-yellow-50">
                  <Warning size={24} className="text-yellow-600" />
                  <AlertDescription>
                    <p className="font-bold text-yellow-700">⚠ {t('tools.httpRedirectChecker.noHttpsRedirect')}</p>
                    <p className="text-sm mt-1">{t('tools.httpRedirectChecker.noHttpsRedirectDesc')}</p>
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>{t('tools.httpRedirectChecker.redirectChain')}</CardTitle>
                  <CardDescription>
                    {t('tools.httpRedirectChecker.redirectChainDesc')}
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
                            <span className="text-muted-foreground">{t('tools.httpRedirectChecker.status')}: </span>
                            <span className={`font-semibold ${getStatusColor(item.status)}`}>
                              {item.status} {item.statusText}
                            </span>
                          </div>
                        </div>

                        {item.redirectTo && (
                          <div className="flex items-start gap-2 text-sm">
                            <ArrowRight size={16} className="mt-1 text-blue-600" />
                            <div>
                              <span className="text-muted-foreground">{t('tools.httpRedirectChecker.redirectsTo')}: </span>
                              <span className="font-mono text-blue-600 break-all">
                                {item.redirectTo}
                              </span>
                            </div>
                          </div>
                        )}

                        {item.error && (
                          <p className="text-sm text-red-600">
                            {t('tools.httpRedirectChecker.unableToConnectUrl')}
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

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="http-redirect-checker" category="security" />
    </div>
  )
}

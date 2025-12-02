import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldCheck, ShieldWarning, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function URLPhishingChecker() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('url-phishing-checker')
  useSEO({ ...metadata, canonicalPath: '/tools/url-phishing-checker' })

  const [url, setUrl] = useState('')
  const [result, setResult] = useState<null | { status: 'safe' | 'suspicious' | 'dangerous', reasons: string[] }>(null)

  const checkURL = () => {
    if (!url.trim()) {
      toast.error(t('tools.urlPhishingChecker.enterUrlError'))
      return
    }

    const reasons: string[] = []
    let suspiciousCount = 0

    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      
      if (urlObj.protocol !== 'https:') {
        reasons.push(t('tools.urlPhishingChecker.reasons.noHttps'))
        suspiciousCount += 2
      }

      if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(urlObj.hostname)) {
        reasons.push(t('tools.urlPhishingChecker.reasons.ipAddress'))
        suspiciousCount += 2
      }

      if (urlObj.hostname.length > 50) {
        reasons.push(t('tools.urlPhishingChecker.reasons.longDomain'))
        suspiciousCount += 1
      }

      const suspiciousKeywords = ['login', 'signin', 'verify', 'account', 'update', 'secure', 'banking', 'paypal', 'amazon', 'ebay', 'apple']
      const hasSuspiciousKeyword = suspiciousKeywords.some(keyword => 
        urlObj.hostname.toLowerCase().includes(keyword)
      )
      if (hasSuspiciousKeyword && !urlObj.hostname.endsWith('.com')) {
        reasons.push(t('tools.urlPhishingChecker.reasons.suspiciousKeywords'))
        suspiciousCount += 2
      }

      const dotCount = (urlObj.hostname.match(/\./g) || []).length
      if (dotCount > 3) {
        reasons.push(t('tools.urlPhishingChecker.reasons.manySubdomains'))
        suspiciousCount += 1
      }

      if (/@/.test(urlObj.href)) {
        reasons.push(t('tools.urlPhishingChecker.reasons.atSymbol'))
        suspiciousCount += 2
      }

      if (/-/.test(urlObj.hostname)) {
        const dashCount = (urlObj.hostname.match(/-/g) || []).length
        if (dashCount > 2) {
          reasons.push(t('tools.urlPhishingChecker.reasons.excessiveHyphens'))
          suspiciousCount += 1
        }
      }

      const tld = urlObj.hostname.split('.').pop()?.toLowerCase()
      const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'work']
      if (tld && suspiciousTLDs.includes(tld)) {
        reasons.push(t('tools.urlPhishingChecker.reasons.suspiciousTld'))
        suspiciousCount += 2
      }

      if (urlObj.port && !['80', '443', '8080'].includes(urlObj.port)) {
        reasons.push(t('tools.urlPhishingChecker.reasons.nonStandardPort'))
        suspiciousCount += 1
      }

      let status: 'safe' | 'suspicious' | 'dangerous' = 'safe'
      if (suspiciousCount >= 4) {
        status = 'dangerous'
      } else if (suspiciousCount >= 2) {
        status = 'suspicious'
      }

      if (status === 'safe') {
        reasons.push(t('tools.urlPhishingChecker.reasons.legitimate'))
        reasons.push(t('tools.urlPhishingChecker.reasons.httpsEncryption'))
      }

      setResult({ status, reasons })
      toast.success(t('tools.urlPhishingChecker.analyzeSuccess'))

    } catch (error) {
      toast.error(t('tools.urlPhishingChecker.invalidUrlFormat'))
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.urlPhishingChecker.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.urlPhishingChecker.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.urlPhishingChecker.enterUrl')}</CardTitle>
              <CardDescription>
                {t('tools.urlPhishingChecker.enterUrlDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">{t('tools.urlPhishingChecker.urlLabel')}</Label>
                <Input
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <Button onClick={checkURL} className="w-full gap-2" size="lg">
                <MagnifyingGlass size={20} />
                {t('tools.urlPhishingChecker.checkButton')}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Alert 
              variant={result.status === 'dangerous' ? 'destructive' : 'default'}
              className={
                result.status === 'safe' ? 'border-green-500 bg-green-50' :
                result.status === 'suspicious' ? 'border-yellow-500 bg-yellow-50' :
                ''
              }
            >
              {result.status === 'safe' ? (
                <ShieldCheck size={24} className="text-green-600" />
              ) : (
                <ShieldWarning size={24} className={
                  result.status === 'suspicious' ? 'text-yellow-600' : ''
                } />
              )}
              <AlertDescription>
                <div className="space-y-2">
                  <p className={`font-bold text-lg ${
                    result.status === 'safe' ? 'text-green-700' :
                    result.status === 'suspicious' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {result.status === 'safe' ? t('tools.urlPhishingChecker.resultSafe') :
                     result.status === 'suspicious' ? t('tools.urlPhishingChecker.resultSuspicious') :
                     t('tools.urlPhishingChecker.resultDangerous')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                  {result.status !== 'safe' && (
                    <p className="text-sm font-semibold mt-3">
                      {t('tools.urlPhishingChecker.cautionWarning')}
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

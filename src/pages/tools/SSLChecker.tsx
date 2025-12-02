import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Certificate, MagnifyingGlass, CheckCircle, XCircle, Warning, Clock, Shield, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

interface SSLResult {
  success: boolean
  domain: string
  certificate?: {
    valid: boolean
    expired: boolean
    notYetValid?: boolean
    daysRemaining: number
    validFrom: string
    validTo: string
    validFromFormatted: string
    validToFormatted: string
    issuer: {
      name: string
      organization?: string
      country?: string
      commonName?: string
    }
    subject: {
      commonName?: string
      organization?: string
      country?: string
    }
    serialNumber?: string
    fingerprint?: string
    fingerprint256?: string
    altNames: string[]
    type: string
    protocol?: string
    cipher?: {
      name: string
      version: string
    }
  }
  error?: string
  message?: string
}

export default function SSLChecker() {
  const { t } = useTranslation()
  const metadata = getPageMetadata('ssl-checker')
  useSEO(metadata)

  const [domain, setDomain] = useState('')
  const [result, setResult] = useState<SSLResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkSSL = async () => {
    if (!domain.trim()) {
      toast.error(t('tools.sslChecker.enterDomain'))
      return
    }

    setIsLoading(true)
    setResult(null)
    
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].trim()
      
      const response = await fetch(`/api/ssl-check?domain=${encodeURIComponent(cleanDomain)}`)
      const data: SSLResult = await response.json()

      if (!response.ok) {
        toast.error(data.error || t('tools.sslChecker.checkFailed'))
        setResult({
          success: false,
          domain: cleanDomain,
          error: data.error || data.message || t('tools.sslChecker.checkFailed')
        })
        return
      }

      setResult(data)
      
      if (data.certificate?.valid) {
        toast.success(t('tools.sslChecker.certificateValid'))
      } else if (data.certificate?.expired) {
        toast.warning(t('tools.sslChecker.certificateExpired'))
      } else {
        toast.info(t('tools.sslChecker.checkCompleted'))
      }
    } catch (error) {
      console.error('SSL check error:', error)
      toast.error(t('tools.sslChecker.checkFailed'))
      setResult({
        success: false,
        domain: domain,
        error: t('tools.sslChecker.networkError')
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysRemainingColor = (days: number) => {
    if (days <= 0) return 'text-red-600'
    if (days <= 14) return 'text-red-500'
    if (days <= 30) return 'text-orange-500'
    if (days <= 60) return 'text-yellow-500'
    return 'text-green-600'
  }

  const getDaysRemainingBg = (days: number) => {
    if (days <= 0) return 'bg-red-100 border-red-300'
    if (days <= 14) return 'bg-red-50 border-red-200'
    if (days <= 30) return 'bg-orange-50 border-orange-200'
    if (days <= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.sslChecker.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.sslChecker.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Certificate size={24} className="text-primary" />
                {t('tools.sslChecker.checkDomain')}
              </CardTitle>
              <CardDescription>
                {t('tools.sslChecker.checkDomainDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain-input">{t('tools.sslChecker.domainName')}</Label>
                <Input
                  id="domain-input"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  type="text"
                  onKeyDown={(e) => e.key === 'Enter' && checkSSL()}
                />
              </div>

              <Button 
                onClick={checkSSL} 
                disabled={isLoading}
                className="w-full gap-2" 
                size="lg"
              >
                <MagnifyingGlass size={20} />
                {isLoading ? t('tools.sslChecker.checking') : t('tools.sslChecker.checkCertificate')}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <>
              {result.error ? (
                <Alert variant="destructive">
                  <XCircle size={20} />
                  <AlertDescription>
                    <p className="font-semibold">{t('tools.sslChecker.sslCheckFailed')}</p>
                    <p className="text-sm mt-1">{result.error}</p>
                    {result.message && <p className="text-sm mt-1 opacity-75">{result.message}</p>}
                  </AlertDescription>
                </Alert>
              ) : result.certificate && (
                <>
                  {/* Main Status Card */}
                  <Alert 
                    variant="default" 
                    className={result.certificate.valid 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                      : 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    }
                  >
                    {result.certificate.valid ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <XCircle size={24} className="text-red-600" />
                    )}
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className={`font-bold text-lg ${result.certificate.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {result.certificate.valid 
                            ? t('tools.sslChecker.statusValid')
                            : result.certificate.expired 
                              ? t('tools.sslChecker.statusExpired')
                              : t('tools.sslChecker.statusInvalid')
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('tools.sslChecker.domain')}: <span className="font-medium">{result.domain}</span>
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Days Remaining Card */}
                  <Card className={`border-2 ${getDaysRemainingBg(result.certificate.daysRemaining)}`}>
                    <CardContent className="py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock size={32} className={getDaysRemainingColor(result.certificate.daysRemaining)} />
                          <div>
                            <p className="text-sm text-muted-foreground">{t('tools.sslChecker.expiresIn')}</p>
                            <p className={`text-3xl font-bold ${getDaysRemainingColor(result.certificate.daysRemaining)}`}>
                              {result.certificate.daysRemaining <= 0 
                                ? t('tools.sslChecker.expired')
                                : t('tools.sslChecker.daysCount', { count: result.certificate.daysRemaining })
                              }
                            </p>
                          </div>
                        </div>
                        {result.certificate.daysRemaining <= 30 && result.certificate.daysRemaining > 0 && (
                          <div className="flex items-center gap-2 text-orange-600">
                            <Warning size={24} />
                            <span className="text-sm font-medium">{t('tools.sslChecker.renewSoon')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certificate Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield size={20} />
                        {t('tools.sslChecker.certificateDetails')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t('tools.sslChecker.issuer')}</p>
                          <p className="font-medium">{result.certificate.issuer.name}</p>
                          {result.certificate.issuer.organization && (
                            <p className="text-sm text-muted-foreground">
                              {result.certificate.issuer.organization}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t('tools.sslChecker.certificateType')}</p>
                          <p className="font-medium">{result.certificate.type}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t('tools.sslChecker.validFrom')}</p>
                          <p className="font-medium">{result.certificate.validFromFormatted}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{t('tools.sslChecker.validTo')}</p>
                          <p className="font-medium">{result.certificate.validToFormatted}</p>
                        </div>

                        {result.certificate.protocol && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t('tools.sslChecker.protocol')}</p>
                            <p className="font-medium">{result.certificate.protocol}</p>
                          </div>
                        )}

                        {result.certificate.cipher && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{t('tools.sslChecker.cipher')}</p>
                            <p className="font-medium text-sm">{result.certificate.cipher.name}</p>
                          </div>
                        )}
                      </div>

                      {result.certificate.subject.commonName && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2">{t('tools.sslChecker.subject')}</p>
                          <p className="font-medium">{result.certificate.subject.commonName}</p>
                          {result.certificate.subject.organization && (
                            <p className="text-sm text-muted-foreground">
                              {result.certificate.subject.organization}
                            </p>
                          )}
                        </div>
                      )}

                      {result.certificate.altNames && result.certificate.altNames.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            <Globe size={16} />
                            {t('tools.sslChecker.subjectAltNames', { count: result.certificate.altNames.length })}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.certificate.altNames.slice(0, 10).map((name, i) => (
                              <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                                {name}
                              </span>
                            ))}
                            {result.certificate.altNames.length > 10 && (
                              <span className="px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
                                {t('tools.sslChecker.moreCount', { count: result.certificate.altNames.length - 10 })}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {result.certificate.fingerprint256 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2">{t('tools.sslChecker.sha256Fingerprint')}</p>
                          <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                            {result.certificate.fingerprint256}
                          </code>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldCheck, ShieldWarning, MagnifyingGlass, CheckCircle, XCircle, Warning, Spinner } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

interface BlacklistResult {
  name: string
  zone: string
  description: string
  listed: boolean
  returnCode?: string | null
  reason?: string | null
  error?: boolean
  errorMessage?: string
}

interface IPCheckResult {
  success: boolean
  ip: string
  isPrivate: boolean
  privateType?: string
  status?: 'clean' | 'listed'
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  message?: string
  summary?: {
    total: number
    listed: number
    clean: number
    errors: number
  }
  results: BlacklistResult[]
  error?: string
}

export default function IPBlacklistChecker() {
  const { t } = useTranslation()
  const metadata = getPageMetadata('ip-blacklist-checker')
  useSEO({ ...metadata, canonicalPath: '/tools/ip-blacklist-checker' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.iPBlacklistChecker.name')

  const [ipAddress, setIpAddress] = useState('')
  const [result, setResult] = useState<IPCheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkIP = async () => {
    if (!ipAddress.trim()) {
      toast.error(t('tools.ipBlacklistChecker.enterIpAddress'))
      return
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipPattern.test(ipAddress)) {
      toast.error(t('tools.ipBlacklistChecker.invalidIpv4'))
      return
    }

    const parts = ipAddress.split('.').map(Number)
    if (parts.some(part => part > 255)) {
      toast.error(t('tools.ipBlacklistChecker.invalidOctet'))
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/ip-check?ip=${encodeURIComponent(ipAddress)}`)
      const data: IPCheckResult = await response.json()

      if (!response.ok) {
        toast.error(data.error || t('tools.ipBlacklistChecker.checkFailed'))
        setResult({
          success: false,
          ip: ipAddress,
          isPrivate: false,
          results: [],
          error: data.error || t('tools.ipBlacklistChecker.checkFailed')
        })
        return
      }

      setResult(data)

      if (data.isPrivate) {
        toast.info(t('tools.ipBlacklistChecker.privateIpAddress'))
      } else if (data.status === 'listed') {
        toast.warning(t('tools.ipBlacklistChecker.ipFoundOnBlacklists', { count: data.summary?.listed }))
      } else {
        toast.success(t('tools.ipBlacklistChecker.ipClean'))
      }
    } catch (error) {
      console.error('IP check error:', error)
      toast.error(t('tools.ipBlacklistChecker.checkFailed'))
      setResult({
        success: false,
        ip: ipAddress,
        isPrivate: false,
        results: [],
        error: t('tools.ipBlacklistChecker.networkError')
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-red-500 bg-red-50'
      case 'medium': return 'text-orange-500 bg-orange-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'critical': return t('tools.ipBlacklistChecker.criticalRisk')
      case 'high': return t('tools.ipBlacklistChecker.highRisk')
      case 'medium': return t('tools.ipBlacklistChecker.mediumRisk')
      default: return t('tools.ipBlacklistChecker.lowRisk')
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">{pageH1}</h1>
          <p className="text-lg text-muted-foreground">{metadata.description}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-primary" />
                {t('tools.ipBlacklistChecker.enterIpAddressTitle')}
              </CardTitle>
              <CardDescription>
                {t('tools.ipBlacklistChecker.enterIpAddressDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip-input">{t('tools.ipBlacklistChecker.ipAddressLabel')}</Label>
                <Input
                  id="ip-input"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="8.8.8.8"
                  type="text"
                  onKeyDown={(e) => e.key === 'Enter' && checkIP()}
                />
              </div>

              <Button 
                onClick={checkIP} 
                disabled={isLoading}
                className="w-full gap-2" 
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner size={20} className="animate-spin" />
                    {t('tools.ipBlacklistChecker.checking', { count: result?.summary?.total || 12 })}
                  </>
                ) : (
                  <>
                    <MagnifyingGlass size={20} />
                    {t('tools.ipBlacklistChecker.checkButton')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <>
              {result.error ? (
                <Alert variant="destructive">
                  <XCircle size={20} />
                  <AlertDescription>
                    <p className="font-semibold">{t('tools.ipBlacklistChecker.checkFailedTitle')}</p>
                    <p className="text-sm mt-1">{result.error}</p>
                  </AlertDescription>
                </Alert>
              ) : result.isPrivate ? (
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/30">
                  <Warning size={24} className="text-blue-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-bold text-lg text-blue-700 dark:text-blue-400">
                        {t('tools.ipBlacklistChecker.privateIpTitle')}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">{result.ip}</span> {t('tools.ipBlacklistChecker.isA')} {result.privateType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.message}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {/* Main Status */}
                  <Alert 
                    variant={result.status === 'listed' ? 'destructive' : 'default'}
                    className={result.status === 'listed' 
                      ? '' 
                      : 'border-green-500 bg-green-50 dark:bg-green-950/30'
                    }
                  >
                    {result.status === 'listed' ? (
                      <ShieldWarning size={24} />
                    ) : (
                      <ShieldCheck size={24} className="text-green-600" />
                    )}
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className={`font-bold text-lg ${
                            result.status === 'listed' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                          }`}>
                            {result.status === 'listed' 
                              ? t('tools.ipBlacklistChecker.ipListedOn', { count: result.summary?.listed })
                              : t('tools.ipBlacklistChecker.ipAddressClean')
                            }
                          </p>
                          {result.riskLevel && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
                              {getRiskLabel(result.riskLevel)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('tools.ipBlacklistChecker.checkedAgainst', { ip: result.ip, count: result.summary?.total })}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Summary Stats */}
                  {result.summary && (
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                        <CardContent className="py-4 text-center">
                          <p className="text-3xl font-bold text-green-600">{result.summary.clean}</p>
                          <p className="text-sm text-muted-foreground">{t('tools.ipBlacklistChecker.clean')}</p>
                        </CardContent>
                      </Card>
                      <Card className={`${result.summary.listed > 0 ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' : 'border-gray-200'}`}>
                        <CardContent className="py-4 text-center">
                          <p className={`text-3xl font-bold ${result.summary.listed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {result.summary.listed}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('tools.ipBlacklistChecker.listed')}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200">
                        <CardContent className="py-4 text-center">
                          <p className="text-3xl font-bold text-gray-400">{result.summary.errors}</p>
                          <p className="text-sm text-muted-foreground">{t('tools.ipBlacklistChecker.errors')}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Detailed Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('tools.ipBlacklistChecker.blacklistCheckResults')}</CardTitle>
                      <CardDescription>
                        {t('tools.ipBlacklistChecker.dnsBasedLookups')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.results.map((bl, index) => (
                        <div 
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            bl.listed 
                              ? 'bg-red-50 border-red-200 dark:bg-red-950/30' 
                              : bl.error
                                ? 'bg-gray-50 border-gray-200 dark:bg-gray-900/30'
                                : 'bg-green-50 border-green-200 dark:bg-green-950/30'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{bl.name}</span>
                              {bl.listed && bl.reason && (
                                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                  {bl.reason}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{bl.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {bl.listed ? (
                              <>
                                <XCircle size={20} className="text-red-600" />
                                <span className="text-red-600 font-medium">{t('tools.ipBlacklistChecker.listed')}</span>
                              </>
                            ) : bl.error ? (
                              <>
                                <Warning size={20} className="text-gray-400" />
                                <span className="text-gray-400 text-sm">{bl.errorMessage || t('tools.common.error')}</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle size={20} className="text-green-600" />
                                <span className="text-green-600 font-medium">{t('tools.ipBlacklistChecker.clean')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="ip-blacklist-checker" category="security" />
    </div>
  )
}

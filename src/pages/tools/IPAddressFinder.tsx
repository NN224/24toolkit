import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { NetworkSlash, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function IPAddressFinder() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('ip-address-finder')
  useSEO({ ...metadata, canonicalPath: '/tools/ip-address-finder' })

  const [ipInfo, setIpInfo] = useState<{
    ip: string
    city?: string
    region?: string
    country?: string
    timezone?: string
    isp?: string
  } | null>(null)
  const [customIp, setCustomIp] = useState('')
  const [loading, setLoading] = useState(false)

  const getMyIP = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      setIpInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        timezone: data.timezone,
        isp: data.org
      })
      toast.success(t('tools.ipAddressFinder.ipRetrieved'))
    } catch (error) {
      toast.error(t('tools.ipAddressFinder.ipRetrieveFailed'))
    } finally {
      setLoading(false)
    }
  }

  const lookupIP = async () => {
    if (!customIp) {
      toast.error(t('tools.ipAddressFinder.enterIpAddress'))
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://ipapi.co/${customIp}/json/`)
      const data = await response.json()
      
      if (data.error) {
        toast.error(t('tools.ipAddressFinder.invalidIpAddress'))
        return
      }

      setIpInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        timezone: data.timezone,
        isp: data.org
      })
      toast.success(t('tools.ipAddressFinder.lookupComplete'))
    } catch (error) {
      toast.error(t('tools.ipAddressFinder.lookupFailed'))
    } finally {
      setLoading(false)
    }
  }

  const copyIP = () => {
    if (ipInfo?.ip) {
      navigator.clipboard.writeText(ipInfo.ip)
      toast.success(t('tools.ipAddressFinder.ipCopied'))
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
            <NetworkSlash size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.ipAddressFinder.name')}</h1>
            <p className="text-muted-foreground">{t('tools.ipAddressFinder.description')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('tools.ipAddressFinder.yourIp')}</CardTitle>
            <CardDescription>{t('tools.ipAddressFinder.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={getMyIP} className="w-full" disabled={loading}>
              {loading ? t('tools.common.processing') : t('tools.ipAddressFinder.yourIp')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('tools.common.check')}</CardTitle>
            <CardDescription>{t('tools.ipAddressFinder.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="custom-ip">{t('tools.ipAddressFinder.ipAddress')}</Label>
              <Input
                id="custom-ip"
                placeholder={t('tools.ipAddressFinder.ipExample')}
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
              />
            </div>
            <Button onClick={lookupIP} className="w-full" disabled={loading}>
              {loading ? t('tools.common.processing') : t('tools.common.check')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {ipInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('tools.ipAddressFinder.yourIp')}</CardTitle>
              <Button variant="ghost" size="sm" onClick={copyIP}>
                <Copy size={16} className="mr-2" />
                {t('tools.common.copy')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg text-center border border-violet-200">
                <p className="text-sm text-muted-foreground mb-1">{t('tools.ipAddressFinder.yourIp')}</p>
                <p className="text-3xl font-bold text-foreground font-mono">
                  {ipInfo.ip}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipInfo.city && (
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="text-sm text-muted-foreground">{t('tools.ipAddressFinder.location')}</p>
                    <p className="text-lg font-semibold text-foreground">{ipInfo.city}</p>
                  </div>
                )}
                {ipInfo.region && (
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="text-sm text-muted-foreground">{t('tools.ipAddressFinder.location')}</p>
                    <p className="text-lg font-semibold text-foreground">{ipInfo.region}</p>
                  </div>
                )}
                {ipInfo.country && (
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="text-sm text-muted-foreground">{t('tools.ipAddressFinder.location')}</p>
                    <p className="text-lg font-semibold text-foreground">{ipInfo.country}</p>
                  </div>
                )}
                {ipInfo.timezone && (
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="text-sm text-muted-foreground">{t('tools.ipAddressFinder.timezone')}</p>
                    <p className="text-lg font-semibold text-foreground">{ipInfo.timezone}</p>
                  </div>
                )}
              </div>

              {ipInfo.isp && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('tools.ipAddressFinder.isp')}</p>
                  <p className="text-base font-medium text-foreground mt-1">{ipInfo.isp}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="ip-address-finder" category="dev" />
    </div>
  )
}

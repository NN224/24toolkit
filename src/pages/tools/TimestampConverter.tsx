import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Trash, Calendar, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TimestampConverter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('timestamp-converter')
  useSEO({ ...metadata, canonicalPath: '/tools/timestamp-converter' })

  const [timestamp, setTimestamp] = useState('')
  const [readable, setReadable] = useState('')
  const [mode, setMode] = useState<'toReadable' | 'toTimestamp'>('toReadable')

  const handleToReadable = () => {
    if (!timestamp.trim()) {
      toast.error(t('tools.timestampConverter.enterTimestamp'))
      return
    }

    try {
      const ts = parseInt(timestamp)
      if (isNaN(ts)) {
        toast.error(t('tools.timestampConverter.invalidTimestamp'))
        return
      }

      const date = new Date(ts * 1000)
      setReadable(date.toISOString())
      toast.success(t('tools.timestampConverter.converted'))
    } catch (error) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleToTimestamp = () => {
    if (!readable.trim()) {
      toast.error(t('tools.timestampConverter.enterDate'))
      return
    }

    try {
      const date = new Date(readable)
      if (isNaN(date.getTime())) {
        toast.error(t('tools.timestampConverter.invalidDate'))
        return
      }

      const ts = Math.floor(date.getTime() / 1000)
      setTimestamp(ts.toString())
      toast.success(t('tools.timestampConverter.converted'))
    } catch (error) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
    setReadable(new Date().toISOString())
    toast.success(t('tools.timestampConverter.currentTimeLoaded'))
  }

  const handleClear = () => {
    setTimestamp('')
    setReadable('')
    toast.success(t('tools.common.clear'))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      return {
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        unix: Math.floor(date.getTime() / 1000)
      }
    } catch {
      return null
    }
  }

  const formatted = readable ? formatDate(readable) : null

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.timestampConverter.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.timestampConverter.description')}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('tools.timestampConverter.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={handleCurrentTime} variant="outline" className="flex-1">
                <Clock size={18} className="mr-2" />
                {t('tools.timestampConverter.currentTime')}
              </Button>
              <Button onClick={handleClear} variant="outline">
                <Trash size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                {t('tools.timestampConverter.unix')}
              </CardTitle>
              <CardDescription>{t('tools.timestampConverter.unixDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp">{t('tools.timestampConverter.timestampSeconds')}</Label>
                <Input
                  id="timestamp"
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder={t('tools.timestampConverter.timestampExample')}
                  className="font-mono"
                />
              </div>

              <Button onClick={handleToReadable} className="w-full">
                {t('tools.timestampConverter.convertToDate')} →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                {t('tools.timestampConverter.humanReadable')}
              </CardTitle>
              <CardDescription>{t('tools.timestampConverter.humanReadableDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="readable">{t('tools.timestampConverter.date')}</Label>
                <Input
                  id="readable"
                  type="text"
                  value={readable}
                  onChange={(e) => setReadable(e.target.value)}
                  placeholder={t('tools.timestampConverter.dateExample')}
                  className="font-mono"
                />
              </div>

              <Button onClick={handleToTimestamp} className="w-full">
                ← {t('tools.timestampConverter.convertToTimestamp')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {formatted && (
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.timestampConverter.allFormats')}</CardTitle>
              <CardDescription>{t('tools.timestampConverter.allFormatsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: t('tools.timestampConverter.unix'), value: formatted.unix.toString(), key: 'unix' },
                  { label: t('tools.timestampConverter.iso'), value: formatted.iso, key: 'iso' },
                  { label: t('tools.timestampConverter.utcString'), value: formatted.utc, key: 'utc' },
                  { label: t('tools.timestampConverter.local'), value: formatted.local, key: 'local' },
                  { label: t('tools.timestampConverter.dateOnly'), value: formatted.date, key: 'date' },
                  { label: t('tools.timestampConverter.timeOnly'), value: formatted.time, key: 'time' }
                ].map((format) => (
                  <div key={format.key} className="flex items-center gap-2 p-3 bg-muted rounded-lg group">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">{format.label}</div>
                      <div className="text-sm font-mono">{format.value}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await navigator.clipboard.writeText(format.value)
                        toast.success(t('tools.common.copied'))
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { QRCodeCanvas } from 'qrcode.react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function QRGenerator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('qr-generator')
  useSEO({ ...metadata, canonicalPath: '/tools/qr-generator' })

  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (!text) {
      toast.error(t('tools.qrGenerator.enterTextFirst'))
      return
    }

    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) {
      toast.error(t('tools.common.error'))
      return
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `qrcode-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success(t('tools.qrGenerator.downloaded'))
      }
    })
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.qrGenerator.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.qrGenerator.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.qrGenerator.settings')}</CardTitle>
              <CardDescription>
                {t('tools.qrGenerator.enterTextOrUrl')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-text">{t('tools.qrGenerator.textOrUrl')}</Label>
                <Input
                  id="qr-text"
                  type="text"
                  placeholder={t('tools.qrGenerator.placeholder')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="qr-size">{t('tools.qrGenerator.size')}</Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {size}px
                  </span>
                </div>
                <Slider
                  id="qr-size"
                  min={128}
                  max={512}
                  step={32}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={handleDownload}
                disabled={!text}
                className="w-full gap-2"
                size="lg"
              >
                <Download size={20} />
                {t('tools.qrGenerator.downloadPng')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.qrGenerator.preview')}</CardTitle>
              <CardDescription>
                {t('tools.qrGenerator.previewDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                ref={qrRef}
                className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-lg p-8"
              >
                {text ? (
                  <QRCodeCanvas
                    value={text}
                    size={Math.min(size, 400)}
                    level="H"
                    includeMargin={true}
                    className="border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">{t('tools.qrGenerator.enterToGenerate')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

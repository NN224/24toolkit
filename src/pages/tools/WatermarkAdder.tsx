import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Download, Trash, Image as ImageIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function WatermarkAdder() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('watermark-adder')
  useSEO(metadata)

  const [image, setImage] = useState<string | null>(null)
  const [watermarkText, setWatermarkText] = useState('© Your Watermark')
  const [fontSize, setFontSize] = useState(40)
  const [opacity, setOpacity] = useState(0.5)
  const [position, setPosition] = useState<'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'>('bottomRight')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.watermarkAdder.selectImageFile'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      drawWatermark(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.watermarkAdder.imageLoaded'))
  }

  const drawWatermark = (imgSrc: string) => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)

      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`
      ctx.lineWidth = 2

      const metrics = ctx.measureText(watermarkText)
      const textWidth = metrics.width
      const textHeight = fontSize

      let x = 0, y = 0
      switch (position) {
        case 'center':
          x = (canvas.width - textWidth) / 2
          y = (canvas.height + textHeight) / 2
          break
        case 'topLeft':
          x = 20
          y = textHeight + 20
          break
        case 'topRight':
          x = canvas.width - textWidth - 20
          y = textHeight + 20
          break
        case 'bottomLeft':
          x = 20
          y = canvas.height - 20
          break
        case 'bottomRight':
          x = canvas.width - textWidth - 20
          y = canvas.height - 20
          break
      }

      ctx.strokeText(watermarkText, x, y)
      ctx.fillText(watermarkText, x, y)
    }
    img.src = imgSrc
  }

  const handleApplyWatermark = () => {
    if (!image) {
      toast.error(t('tools.watermarkAdder.uploadFirst'))
      return
    }
    drawWatermark(image)
    toast.success(t('tools.watermarkAdder.watermarkApplied'))
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'watermarked-image.png'
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        toast.success(t('tools.watermarkAdder.imageDownloaded'))
      }
    })
  }

  const handleClear = () => {
    setImage(null)
    setWatermarkText('© Your Watermark')
    if (fileInputRef.current) fileInputRef.current.value = ''
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.watermarkAdder.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.watermarkAdder.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('tools.common.preview')}</CardTitle>
              <CardDescription>{t('tools.watermarkAdder.imageWithWatermark')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              
              {!image ? (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload size={18} className="mr-2" />
                  {t('tools.watermarkAdder.uploadImage')}
                </Button>
              ) : (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <canvas ref={canvasRef} className="w-full h-auto max-h-[500px] object-contain" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download size={18} className="mr-2" />
                      {t('tools.common.download')}
                    </Button>
                    <Button onClick={handleClear} variant="outline">
                      <Trash size={18} />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.watermarkAdder.watermarkSettings')}</CardTitle>
              <CardDescription>{t('tools.watermarkAdder.customizeWatermark')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="watermark-text">{t('tools.watermarkAdder.text')}</Label>
                <Textarea
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder={t('tools.watermarkAdder.enterWatermarkText')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">{t('tools.watermarkAdder.position')}</Label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="center">{t('tools.watermarkAdder.center')}</option>
                  <option value="topLeft">{t('tools.watermarkAdder.topLeft')}</option>
                  <option value="topRight">{t('tools.watermarkAdder.topRight')}</option>
                  <option value="bottomLeft">{t('tools.watermarkAdder.bottomLeft')}</option>
                  <option value="bottomRight">{t('tools.watermarkAdder.bottomRight')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('tools.watermarkAdder.fontSize')}</Label>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('tools.watermarkAdder.opacity')}</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button onClick={handleApplyWatermark} className="w-full" disabled={!image}>
                <ImageIcon size={18} className="mr-2" />
                {t('tools.watermarkAdder.applyWatermark')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

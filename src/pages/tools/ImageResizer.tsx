import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, Trash, Image as ImageIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function ImageResizer() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-resizer')
  useSEO(metadata)

  const [image, setImage] = useState<string | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.common.pleaseSelectImage'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = event.target?.result as string
      setImage(event.target?.result as string)
      setResizedImage(null)
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.common.imageLoaded'))
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (maintainAspectRatio && value && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width
      const newHeight = Math.round(parseInt(value) * ratio)
      setHeight(newHeight.toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (maintainAspectRatio && value && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height
      const newWidth = Math.round(parseInt(value) * ratio)
      setWidth(newWidth.toString())
    }
  }

  const handleResize = () => {
    if (!image) {
      toast.error(t('tools.common.pleaseUploadImage'))
      return
    }

    if (!width || !height) {
      toast.error(t('tools.imageResizer.enterDimensions'))
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = parseInt(width)
      canvas.height = parseInt(height)
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, parseInt(width), parseInt(height))
        const resized = canvas.toDataURL('image/png')
        setResizedImage(resized)
        toast.success(t('tools.imageResizer.resized'))
      }
    }
    img.src = image
  }

  const handleDownload = () => {
    if (!resizedImage) return

    const link = document.createElement('a')
    link.download = `resized-${width}x${height}.png`
    link.href = resizedImage
    link.click()
    toast.success(t('tools.common.downloaded'))
  }

  const handleClear = () => {
    setImage(null)
    setResizedImage(null)
    setWidth('')
    setHeight('')
    setOriginalDimensions({ width: 0, height: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.imageResizer.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageResizer.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.imageResizer.uploadConfigure')}</CardTitle>
              <CardDescription>{t('tools.imageResizer.selectImageDimensions')}</CardDescription>
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
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload size={18} className="mr-2" />
                {t('tools.imageResizer.uploadImage')}
              </Button>

              {image && (
                <>
                  <div className="border rounded-lg p-4">
                    <img src={image} alt={t('tools.common.original')} className="w-full h-auto max-h-[200px] object-contain" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Original: {originalDimensions.width} × {originalDimensions.height}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="aspect-ratio" className="cursor-pointer">
                        {t('tools.imageResizer.maintainRatio')}
                      </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">{t('tools.imageResizer.width')} (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          placeholder={t('tools.imageResizer.width')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">{t('tools.imageResizer.height')} (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          placeholder={t('tools.imageResizer.height')}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleResize} className="flex-1">
                        <ImageIcon size={18} className="mr-2" />
                        {t('tools.imageResizer.resize')}
                      </Button>
                      <Button onClick={handleClear} variant="outline">
                        <Trash size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.common.result')}</CardTitle>
              <CardDescription>{t('tools.imageResizer.resizedPreview')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resizedImage ? (
                <>
                  <div className="border rounded-lg p-4">
                    <img src={resizedImage} alt={t('tools.common.resized')} className="w-full h-auto max-h-[300px] object-contain" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Resized: {width} × {height}
                    </p>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    {t('tools.imageResizer.download')}
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                    <p>{t('tools.imageResizer.resizedWillAppear')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

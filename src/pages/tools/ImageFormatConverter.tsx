import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

type ImageFormat = 'png' | 'jpeg' | 'webp'

export default function ImageFormatConverter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-format-converter')
  useSEO({ ...metadata, canonicalPath: '/tools/image-format-converter' })

  const [image, setImage] = useState<string | null>(null)
  const [originalFormat, setOriginalFormat] = useState<string>('')
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png')
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageCropper.selectImageFile'))
      return
    }

    const format = file.type.split('/')[1]
    setOriginalFormat(format)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setConvertedImage(null)
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.imageCropper.imageLoaded'))
  }

  const handleConvert = () => {
    if (!image) {
      toast.error(t('tools.imageFormatConverter.uploadImageFirst'))
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(img, 0, 0)
        
        let mimeType = 'image/png'
        if (targetFormat === 'jpeg') mimeType = 'image/jpeg'
        else if (targetFormat === 'webp') mimeType = 'image/webp'

        const converted = canvas.toDataURL(mimeType, 0.95)
        setConvertedImage(converted)
        toast.success(t('tools.imageFormatConverter.convertedTo', { format: targetFormat.toUpperCase() }))
      }
    }
    img.src = image
  }

  const handleDownload = () => {
    if (!convertedImage) return

    const link = document.createElement('a')
    link.download = `converted-image.${targetFormat}`
    link.href = convertedImage
    link.click()
    toast.success(t('tools.imageRotator.imageDownloaded'))
  }

  const handleClear = () => {
    setImage(null)
    setConvertedImage(null)
    setOriginalFormat('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success(t('tools.imageCropper.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.imageFormatConverter.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageFormatConverter.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.imageFormatConverter.originalImage')}</CardTitle>
              <CardDescription>
                {originalFormat ? t('tools.imageFormatConverter.currentFormat', { format: originalFormat.toUpperCase() }) : t('tools.imageFormatConverter.uploadToConvert')}
              </CardDescription>
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
                {t('tools.imageCropper.uploadImage')}
              </Button>

              {image && (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={image} alt={t('tools.common.original')} className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('tools.imageFormatConverter.convertTo')}</label>
                    <Tabs value={targetFormat} onValueChange={(v) => setTargetFormat(v as ImageFormat)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="png">PNG</TabsTrigger>
                        <TabsTrigger value="jpeg">JPEG</TabsTrigger>
                        <TabsTrigger value="webp">WebP</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleConvert} className="flex-1">
                      <ArrowsLeftRight size={18} className="mr-2" />
                      {t('tools.imageFormatConverter.convertToFormat', { format: targetFormat.toUpperCase() })}
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
              <CardTitle>{t('tools.imageFormatConverter.convertedImage')}</CardTitle>
              <CardDescription>{t('tools.imageFormatConverter.previewAndDownload')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {convertedImage ? (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={convertedImage} alt={t('tools.common.converted')} className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ {t('tools.imageFormatConverter.successfullyConverted', { format: targetFormat.toUpperCase() })}
                    </p>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    {t('tools.imageFormatConverter.downloadFormat', { format: targetFormat.toUpperCase() })}
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ArrowsLeftRight size={48} className="mx-auto mb-2 opacity-20" />
                    <p>{t('tools.imageFormatConverter.convertedImagePlaceholder')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('tools.imageFormatConverter.formatComparison')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">PNG</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t('tools.imageFormatConverter.png.lossless')}</li>
                  <li>• {t('tools.imageFormatConverter.png.transparency')}</li>
                  <li>• {t('tools.imageFormatConverter.png.largerSize')}</li>
                  <li>• {t('tools.imageFormatConverter.png.bestFor')}</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">JPEG</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t('tools.imageFormatConverter.jpeg.lossy')}</li>
                  <li>• {t('tools.imageFormatConverter.jpeg.noTransparency')}</li>
                  <li>• {t('tools.imageFormatConverter.jpeg.smallerSize')}</li>
                  <li>• {t('tools.imageFormatConverter.jpeg.bestFor')}</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">WebP</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t('tools.imageFormatConverter.webp.modern')}</li>
                  <li>• {t('tools.imageFormatConverter.webp.transparency')}</li>
                  <li>• {t('tools.imageFormatConverter.webp.smallestSize')}</li>
                  <li>• {t('tools.imageFormatConverter.webp.bestFor')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="image-format-converter" category="image" />
    </div>
  )
}

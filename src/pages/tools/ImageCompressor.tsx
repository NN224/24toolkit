import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { ToolRecommendations, useToolRecommendations } from '@/components/ToolRecommendations'

export default function ImageCompressor() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-compressor')
  useSEO({ ...metadata, canonicalPath: '/tools/image-compressor' })

  // Smart tool recommendations
  const { triggerRecommendations, PopupComponent } = useToolRecommendations('image-compressor')

  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string>('')
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)
  const [compressedPreview, setCompressedPreview] = useState<string>('')
  const [quality, setQuality] = useState(80)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Cleanup object URLs on unmount or when previews change to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview)
      if (compressedPreview) URL.revokeObjectURL(compressedPreview)
    }
  }, [originalPreview, compressedPreview])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageCompressor.selectImageFile'))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('tools.imageCompressor.fileSizeLimit'))
      return
    }

    // Revoke previous object URL to free memory
    if (originalPreview) URL.revokeObjectURL(originalPreview)
    if (compressedPreview) URL.revokeObjectURL(compressedPreview)

    setOriginalImage(file)
    // Use URL.createObjectURL instead of FileReader for better performance
    setOriginalPreview(URL.createObjectURL(file))
    setCompressedImage(null)
    setCompressedPreview('')
    toast.success(t('tools.imageCompressor.imageLoaded'))
  }

  const compressImage = async () => {
    if (!originalImage) return

    setIsCompressing(true)
    setProgress(0)

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        quality: quality / 100,
        onProgress: (progress: number) => {
          setProgress(progress)
        }
      }

      const compressed = await imageCompression(originalImage, options)
      setCompressedImage(compressed)

      // Revoke previous compressed preview URL to free memory
      if (compressedPreview) URL.revokeObjectURL(compressedPreview)
      // Use URL.createObjectURL instead of FileReader for better performance
      setCompressedPreview(URL.createObjectURL(compressed))

      toast.success(t('tools.imageCompressor.compressed'))
      
      // Trigger recommendations after successful compression
      triggerRecommendations(t('tools.imageCompressor.compressed'))
    } catch (err) {
      toast.error(t('tools.common.error'))
    } finally {
      setIsCompressing(false)
      setProgress(0)
    }
  }

  const downloadCompressed = () => {
    if (!compressedImage) return

    const url = URL.createObjectURL(compressedImage)
    const link = document.createElement('a')
    link.href = url
    link.download = `compressed-${originalImage?.name || 'image.jpg'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(t('tools.imageCompressor.downloaded'))
  }

  const handleClear = () => {
    // Revoke object URLs to free memory
    if (originalPreview) URL.revokeObjectURL(originalPreview)
    if (compressedPreview) URL.revokeObjectURL(compressedPreview)
    
    setOriginalImage(null)
    setOriginalPreview('')
    setCompressedImage(null)
    setCompressedPreview('')
    toast.success(t('tools.common.cleared'))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return `0 ${t('tools.common.bytes')}`
    const kilobyte = 1024
    const sizes = [t('tools.common.bytes'), t('tools.common.kb'), t('tools.common.mb')]
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte))
    return Math.round(bytes / Math.pow(kilobyte, sizeIndex) * 100) / 100 + ' ' + sizes[sizeIndex]
  }

  const compressionRatio = originalImage && compressedImage
    ? Math.round((1 - compressedImage.size / originalImage.size) * 100)
    : 0

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.imageCompressor.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageCompressor.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.imageCompressor.uploadImage')}</CardTitle>
              <CardDescription>
                {t('tools.imageCompressor.selectImage')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="gap-2"
                >
                  <Upload size={20} />
                  {t('tools.imageCompressor.chooseImage')}
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {originalImage && (
                  <span className="text-sm text-muted-foreground">
                    {originalImage.name} ({formatFileSize(originalImage.size)})
                  </span>
                )}
              </div>

              {originalImage && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quality-slider">{t('tools.imageCompressor.compressionQuality')}</Label>
                      <span className="text-sm font-medium text-muted-foreground">
                        {quality}%
                      </span>
                    </div>
                    <Slider
                      id="quality-slider"
                      min={10}
                      max={100}
                      step={5}
                      value={[quality]}
                      onValueChange={(value) => setQuality(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={compressImage}
                      disabled={isCompressing}
                      className="gap-2"
                    >
                      {isCompressing ? t('tools.imageCompressor.compressing') : t('tools.imageCompressor.compressImage')}
                    </Button>
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="gap-2"
                    >
                      <Trash size={16} />
                      {t('tools.common.clear')}
                    </Button>
                  </div>

                  {isCompressing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        {t('tools.imageCompressor.compressing')}: {Math.round(progress)}%
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {(originalPreview || compressedPreview) && (
            <div className="grid md:grid-cols-2 gap-6">
              {originalPreview && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('tools.imageCompressor.original')}</CardTitle>
                    <CardDescription>
                      {formatFileSize(originalImage?.size || 0)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={originalPreview}
                      alt={t('tools.common.original')}
                      className="w-full h-auto rounded-lg border border-border"
                    />
                  </CardContent>
                </Card>
              )}

              {compressedPreview && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{t('tools.imageCompressor.compressed')}</CardTitle>
                        <CardDescription>
                          {formatFileSize(compressedImage?.size || 0)}
                        </CardDescription>
                      </div>
                      <Button
                        onClick={downloadCompressed}
                        size="sm"
                        className="gap-2"
                      >
                        <Download size={16} />
                        {t('tools.common.download')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img
                      src={compressedPreview}
                      alt={t('tools.common.compressed')}
                      className="w-full h-auto rounded-lg border border-border"
                    />
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="font-medium text-green-600">
                        {compressionRatio}% {t('tools.imageCompressor.smaller')}
                      </span>
                      <span className="text-muted-foreground">
                        ({formatFileSize((originalImage?.size || 0) - (compressedImage?.size || 0))} {t('tools.imageCompressor.saved')})
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!originalImage && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload size={48} className="text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  {t('tools.imageCompressor.noImageSelected')}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('tools.imageCompressor.chooseToStart')}
                </p>
                <Button
                  onClick={() => document.getElementById('file-input')?.click()}
                  variant="outline"
                >
                  {t('tools.imageCompressor.selectImage')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Smart Tool Recommendations */}
          <ToolRecommendations currentToolId="image-compressor" />
        </div>

        {/* Recommendations Popup */}
        <PopupComponent />
      </div>
    </div>
  )
}

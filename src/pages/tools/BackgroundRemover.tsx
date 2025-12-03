import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Trash, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'
import { removeBackground } from '@imgly/background-removal'

export default function BackgroundRemover() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('background-remover')
  useSEO({ ...metadata, canonicalPath: '/tools/background-remover' })

  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [useAI, setUseAI] = useState(true) // Use AI model by default
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.backgroundRemover.selectImageFile'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.backgroundRemover.imageLoaded'))
  }

  const processWithISNet = async () => {
    if (!image) {
      toast.error(t('tools.backgroundRemover.uploadFirst'))
      return
    }

    setIsProcessing(true)

    try {
      // Fetch the image as a blob
      const response = await fetch(image)
      const blob = await response.blob()
      
      // Remove background using ISNet-Lite
      const result = await removeBackground(blob, {
        model: 'isnet',
        output: {
          format: 'image/png',
          quality: 0.9,
          type: 'foreground'
        },
        progress: (key, current, total) => {
          console.log(`Processing: ${key} - ${current}/${total}`)
        }
      })
      
      // Convert blob to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setProcessedImage(reader.result as string)
        setIsProcessing(false)
        toast.success(t('tools.backgroundRemover.backgroundRemoved'))
      }
      reader.readAsDataURL(result)
    } catch (error) {
      console.error('ISNet error:', error)
      setIsProcessing(false)
      toast.error(t('tools.backgroundRemover.processFailed'))
    }
  }

  const processWithLocalAlgorithm = async () => {
    if (!image) {
      toast.error(t('tools.backgroundRemover.uploadFirst'))
      return
    }

    setIsProcessing(true)

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          const threshold = 240
          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
            if (brightness > threshold) {
              data[i + 3] = 0
            }
          }

          ctx.putImageData(imageData, 0, 0)
          const result = canvas.toDataURL('image/png')
          
          setTimeout(() => {
            setProcessedImage(result)
            setIsProcessing(false)
            toast.success(t('tools.backgroundRemover.backgroundRemoved'))
          }, 2000)
        }
      }
      img.src = image
    } catch (error) {
      setIsProcessing(false)
      toast.error(t('tools.backgroundRemover.processFailed'))
    }
  }

  const processImageWithAI = async () => {
    if (useAI) {
      return processWithISNet()
    } else {
      return processWithLocalAlgorithm()
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.download = 'no-background.png'
    link.href = processedImage
    link.click()
    toast.success(t('tools.backgroundRemover.imageDownloaded'))
  }

  const handleClear = () => {
    setImage(null)
    setProcessedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              {t('tools.backgroundRemover.title')}
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            {t('tools.backgroundRemover.subtitle')}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2">
                <Sparkle size={20} weight="fill" className="text-purple-500" />
                <div>
                  <p className="text-sm font-medium">
                    {useAI ? 'AI Model (ISNet-Lite)' : 'Fast Algorithm'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {useAI ? 'High quality, slower' : 'Fast, good for solid backgrounds'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseAI(!useAI)}
                disabled={isProcessing}
              >
                {useAI ? 'Switch to Fast' : 'Switch to AI'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.backgroundRemover.originalImage')}</CardTitle>
              <CardDescription>{t('tools.backgroundRemover.uploadToProcess')}</CardDescription>
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
                {t('tools.backgroundRemover.uploadImage')}
              </Button>

              {image && (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={image} alt={t('tools.common.original')} className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={processImageWithAI} 
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          {t('tools.common.processing')}
                        </>
                      ) : (
                        <>
                          <Sparkle size={18} className="mr-2" weight="fill" />
                          {t('tools.backgroundRemover.removeBackground')}
                        </>
                      )}
                    </Button>
                    <Button onClick={handleClear} variant="outline" disabled={isProcessing}>
                      <Trash size={18} />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.backgroundRemover.result')}</CardTitle>
              <CardDescription>{t('tools.backgroundRemover.imageWithBackgroundRemoved')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {processedImage ? (
                <>
                  <div className="border rounded-lg p-4 bg-checkered relative">
                    <img src={processedImage} alt={t('tools.common.processed')} className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    {t('tools.backgroundRemover.downloadPng')}
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Sparkle size={48} className="mx-auto mb-2 opacity-20" />
                    <p>{t('tools.backgroundRemover.processedImagePlaceholder')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="background-remover" category="image" />
    </div>
  )
}

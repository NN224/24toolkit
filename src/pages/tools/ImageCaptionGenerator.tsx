import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Image as ImageIcon, Sparkle, Upload } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function ImageCaptionGenerator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-caption-generator')
  useSEO({ ...metadata, canonicalPath: '/tools/image-caption-generator' })

  const [imageUrl, setImageUrl] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const copyToClipboard = useCopyToClipboard()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageCaptionGenerator.invalidImageFile'))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('tools.imageCaptionGenerator.imageTooLarge'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImageUrl(result)
      setCaption('')
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.imageCaptionGenerator.imageUploaded'))
  }

  const handleGenerateCaption = async () => {
    if (!imageUrl) {
      toast.error(t('tools.imageCaptionGenerator.uploadFirst'))
      return
    }

    setIsLoading(true)
    setCaption('')

    try {
      // Extract base64 data from data URL
      const base64Data = imageUrl.split(',')[1]
      const mimeType = imageUrl.split(';')[0].split(':')[1]
      
      // Call our API endpoint with the image
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: mimeType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate caption')
      }

      if (data.caption) {
        setCaption(data.caption)
      toast.success(t('tools.imageCaptionGenerator.captionGenerated'))
      } else {
        throw new Error('No caption received from API')
      }
    } catch (error) {
      console.error('Caption generation error:', error)
      toast.error(error instanceof Error ? error.message : t('tools.imageCaptionGenerator.generationFailed'))
    } finally {
      setIsLoading(false)
    }
  }



  const handleClear = () => {
    setImageUrl('')
    setCaption('')
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              {t('tools.imageCaptionGenerator.title')}
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageCaptionGenerator.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.imageCaptionGenerator.uploadImage')}</CardTitle>
              <CardDescription>
                {t('tools.imageCaptionGenerator.uploadDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="image-upload"
                  className="w-full cursor-pointer"
                >
                  <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-accent transition-colors bg-muted/20">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                        <Upload size={32} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {t('tools.imageCaptionGenerator.clickToUpload')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('tools.imageCaptionGenerator.fileFormats')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border-2 border-accent/20 bg-muted/50">
                    <img
                      src={imageUrl}
                      alt={t('tools.imageCaptionGenerator.uploadedPreview')}
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleGenerateCaption}
                        disabled={isLoading}
                        className="gap-2 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Sparkle size={16} weight="fill" />
                        {t('tools.imageCaptionGenerator.generateCaption')}
                      </Button>
                      
                      <Button
                        onClick={handleClear}
                        variant="outline"
                      >
                        {t('tools.common.clear')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {(isLoading || caption) && (
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle>{t('tools.imageCaptionGenerator.generatedCaption')}</CardTitle>
                <CardDescription>
                  {t('tools.imageCaptionGenerator.generatedCaptionDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <AILoadingSpinner />
                ) : caption ? (
                  <div className="space-y-4">
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={20} weight="bold" className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground leading-relaxed text-lg">
                            {caption}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => copyToClipboard(caption, t('tools.imageCaptionGenerator.captionCopied'))}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Copy size={16} />
                      {t('tools.imageCaptionGenerator.copyCaption')}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {!imageUrl && !isLoading && (
            <Card className="border-border bg-muted/30">
              <CardContent className="py-12">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                    <ImageIcon size={36} weight="duotone" className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {t('tools.imageCaptionGenerator.noImageYet')}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {t('tools.imageCaptionGenerator.noImageDescription')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="image-caption-generator" category="ai" />
    </div>
  )
}

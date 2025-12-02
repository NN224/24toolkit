import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Upload, Copy, Trash, Image as ImageIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createWorker } from 'tesseract.js'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function ImageToText() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-to-text')
  useSEO({ ...metadata, canonicalPath: '/tools/image-to-text' })

  const [image, setImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageToText.invalidFileType'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setExtractedText('')
      setProgress(0)
    }
    reader.readAsDataURL(file)
  }

  const handleExtractText = async () => {
    if (!image) {
      toast.error(t('tools.imageToText.uploadFirst'))
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setExtractedText('')

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })

      const { data: { text } } = await worker.recognize(image)
      
      await worker.terminate()

      if (text.trim()) {
        setExtractedText(text)
        toast.success(t('tools.imageToText.extractSuccess'))
      } else {
        setExtractedText('')
        toast.error(t('tools.imageToText.noTextFound'))
      }
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error(t('tools.imageToText.extractFailed'))
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleCopy = async () => {
    if (!extractedText) return
    try {
      await navigator.clipboard.writeText(extractedText)
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.imageToText.copyFailed'))
    }
  }

  const handleClear = () => {
    setImage(null)
    setExtractedText('')
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success(t('tools.imageToText.cleared'))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.imageToText.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageToText.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.imageToText.uploadImage')}</CardTitle>
              <CardDescription>
                {t('tools.imageToText.uploadDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!image ? (
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary cursor-pointer transition-colors"
                >
                  <ImageIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('tools.imageToText.clickToUpload')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('tools.imageToText.fileFormats')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={image}
                      alt={t('tools.common.uploaded')}
                      className="w-full h-auto max-h-[400px] object-contain bg-muted"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleExtractText}
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <Upload size={16} />
                      {isProcessing ? t('tools.imageToText.extracting') : t('tools.imageToText.extractText')}
                    </Button>

                    <Button
                      onClick={handleUploadClick}
                      variant="outline"
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <ImageIcon size={16} />
                      {t('tools.imageToText.changeImage')}
                    </Button>

                    <Button
                      onClick={handleClear}
                      variant="outline"
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <Trash size={16} />
                      {t('tools.common.clear')}
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('tools.imageToText.processingImage')}</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {extractedText && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.imageToText.extractedText')}</CardTitle>
                <CardDescription>
                  {t('tools.imageToText.textFoundInImage')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="extracted-text"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-[200px] resize-y font-normal"
                />

                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" className="gap-2">
                    <Copy size={16} />
                    {t('tools.imageToText.copyText')}
                  </Button>
                  <Button
                    onClick={() => {
                      setExtractedText('')
                      toast.success(t('tools.imageToText.textCleared'))
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    {t('tools.imageToText.clearText')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>{t('tools.imageToText.tips')}:</strong> {t('tools.imageToText.tipsDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
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
  // Set SEO metadata
  const metadata = getPageMetadata('image-to-text')
  useSEO(metadata)

  const [image, setImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG)')
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
      toast.error('Please upload an image first')
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
        toast.success('Text extracted successfully!')
      } else {
        setExtractedText('')
        toast.error('No text found in the image')
      }
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error('Failed to extract text from image')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleCopy = async () => {
    if (!extractedText) return
    try {
      await navigator.clipboard.writeText(extractedText)
      toast.success('Text copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setImage(null)
    setExtractedText('')
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Cleared')
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image to Text (OCR Extractor)
          </h1>
          <p className="text-lg text-muted-foreground">
            Extract text from images using advanced OCR technology powered by Tesseract.js.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select a JPG or PNG image containing text to extract
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
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={image}
                      alt="Uploaded"
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
                      {isProcessing ? 'Extracting...' : 'Extract Text'}
                    </Button>

                    <Button
                      onClick={handleUploadClick}
                      variant="outline"
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <ImageIcon size={16} />
                      Change Image
                    </Button>

                    <Button
                      onClick={handleClear}
                      variant="outline"
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <Trash size={16} />
                      Clear
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Processing image...</span>
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
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>
                  Text found in the image
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
                    Copy Text
                  </Button>
                  <Button
                    onClick={() => {
                      setExtractedText('')
                      toast.success('Text cleared')
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    Clear Text
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Tips:</strong> For best results, use clear images with good contrast and readable text.
              The OCR works best with printed text and may struggle with handwriting or stylized fonts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

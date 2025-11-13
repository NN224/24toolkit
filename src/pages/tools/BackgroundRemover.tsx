import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Trash, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
    toast.success('Image loaded!')
  }

  const processImageWithAI = async () => {
    if (!image) {
      toast.error('Please upload an image first')
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
            toast.success('Background removed! (Demo: removes bright backgrounds)')
          }, 2000)
        }
      }
      img.src = image
    } catch (error) {
      setIsProcessing(false)
      toast.error('Failed to process image')
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.download = 'no-background.png'
    link.href = processedImage
    link.click()
    toast.success('Image downloaded!')
  }

  const handleClear = () => {
    setImage(null)
    setProcessedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              Background Remover
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Remove backgrounds from images using AI simulation
          </p>
        </div>

        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This tool demonstrates background removal by removing bright/white backgrounds.
              Production tools would use advanced AI models for accurate subject detection.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
              <CardDescription>Upload image to process</CardDescription>
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
                Upload Image
              </Button>

              {image && (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={image} alt="Original" className="w-full h-auto max-h-[300px] object-contain" />
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
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkle size={18} className="mr-2" weight="fill" />
                          Remove Background
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
              <CardTitle>Result</CardTitle>
              <CardDescription>Image with background removed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {processedImage ? (
                <>
                  <div className="border rounded-lg p-4 bg-checkered relative">
                    <img src={processedImage} alt="Processed" className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    Download PNG
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Sparkle size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Processed image will appear here</p>
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

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

type ImageFormat = 'png' | 'jpeg' | 'webp'

export default function ImageFormatConverter() {
  // Set SEO metadata
  const metadata = getPageMetadata('image-format-converter')
  useSEO(metadata)

  const [image, setImage] = useState<string | null>(null)
  const [originalFormat, setOriginalFormat] = useState<string>('')
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png')
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
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
    toast.success('Image loaded!')
  }

  const handleConvert = () => {
    if (!image) {
      toast.error('Please upload an image first')
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
        toast.success(`Converted to ${targetFormat.toUpperCase()}!`)
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
    toast.success('Image downloaded!')
  }

  const handleClear = () => {
    setImage(null)
    setConvertedImage(null)
    setOriginalFormat('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Format Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert images between JPG, PNG, and WebP formats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
              <CardDescription>
                {originalFormat ? `Current format: ${originalFormat.toUpperCase()}` : 'Upload image to convert'}
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
                Upload Image
              </Button>

              {image && (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={image} alt="Original" className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Convert to:</label>
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
                      Convert to {targetFormat.toUpperCase()}
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
              <CardTitle>Converted Image</CardTitle>
              <CardDescription>Preview and download</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {convertedImage ? (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={convertedImage} alt="Converted" className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Successfully converted to <strong>{targetFormat.toUpperCase()}</strong>
                    </p>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    Download {targetFormat.toUpperCase()}
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ArrowsLeftRight size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Converted image will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Format Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">PNG</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Lossless compression</li>
                  <li>• Supports transparency</li>
                  <li>• Larger file size</li>
                  <li>• Best for graphics</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">JPEG</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Lossy compression</li>
                  <li>• No transparency</li>
                  <li>• Smaller file size</li>
                  <li>• Best for photos</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">WebP</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Modern format</li>
                  <li>• Supports transparency</li>
                  <li>• Smallest file size</li>
                  <li>• Best for web</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

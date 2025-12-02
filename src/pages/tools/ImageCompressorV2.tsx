import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, Download, Trash, Gauge } from '@phosphor-icons/react'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'

export default function ImageCompressorV2() {
  const { t } = useTranslation()
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const kilobyte = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte))
    return Math.round((bytes / Math.pow(kilobyte, sizeIndex)) * 100) / 100 + ' ' + sizes[sizeIndex]
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageCompressorV2.selectImageError'))
      return
    }

    setOriginalImage(file)
    setOriginalSize(file.size)
    setCompressedImage(null)
    setCompressedPreview(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      setOriginalPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.imageCompressorV2.imageLoaded'))
  }

  const handleCompress = async () => {
    if (!originalImage) {
      toast.error(t('tools.imageCompressorV2.uploadFirst'))
      return
    }

    setIsCompressing(true)

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality / 100
      }

      const compressed = await imageCompression(originalImage, options)
      setCompressedImage(compressed)
      setCompressedSize(compressed.size)

      const reader = new FileReader()
      reader.onload = (event) => {
        setCompressedPreview(event.target?.result as string)
      }
      reader.readAsDataURL(compressed)

      toast.success(t('tools.imageCompressorV2.imageCompressed'))
    } catch (error) {
      toast.error(t('tools.imageCompressorV2.compressFailed'))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedImage) return

    const url = URL.createObjectURL(compressedImage)
    const link = document.createElement('a')
    link.download = `compressed-${originalImage?.name || 'image.jpg'}`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    toast.success(t('tools.imageCompressorV2.imageDownloaded'))
  }

  const handleClear = () => {
    setOriginalImage(null)
    setOriginalPreview(null)
    setCompressedImage(null)
    setCompressedPreview(null)
    setOriginalSize(0)
    setCompressedSize(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success(t('tools.imageCompressorV2.cleared'))
  }

  const compressionRatio = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Compressor v2
          </h1>
          <p className="text-lg text-muted-foreground">
            Compress images with advanced settings and preview comparison
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Compression Settings</CardTitle>
            <CardDescription>Adjust quality and size preferences</CardDescription>
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

            {originalImage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Quality</Label>
                    <span className="text-sm text-muted-foreground">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Lower = smaller file, lower quality</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Max Width</Label>
                    <span className="text-sm text-muted-foreground">{maxWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={3840}
                    step={160}
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Maximum width or height</p>
                </div>
              </div>
            )}

            {originalImage && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleCompress} 
                  className="flex-1"
                  disabled={isCompressing}
                >
                  {isCompressing ? (
                    <>
                      <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Gauge size={18} className="mr-2" />
                      Compress Image
                    </>
                  )}
                </Button>
                <Button onClick={handleClear} variant="outline" disabled={isCompressing}>
                  <Trash size={18} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {compressedImage && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-green-800">Compression Results</div>
                  <div className="text-xs text-green-700 mt-1">
                    {formatFileSize(originalSize)} → {formatFileSize(compressedSize)} ({compressionRatio}% reduction)
                  </div>
                </div>
                <Button onClick={handleDownload}>
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original</CardTitle>
              <CardDescription>
                {originalSize > 0 ? formatFileSize(originalSize) : 'No image uploaded'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {originalPreview ? (
                <div className="border rounded-lg p-4 bg-muted">
                  <img src={originalPreview} alt="Original" className="w-full h-auto max-h-[400px] object-contain" />
                </div>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Upload size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Upload an image to start</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compressed</CardTitle>
              <CardDescription>
                {compressedSize > 0 ? formatFileSize(compressedSize) : 'Compressed version'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {compressedPreview ? (
                <div className="border rounded-lg p-4 bg-muted">
                  <img src={compressedPreview} alt="Compressed" className="w-full h-auto max-h-[400px] object-contain" />
                </div>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Gauge size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Compressed image will appear here</p>
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

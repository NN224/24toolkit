import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string>('')
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)
  const [compressedPreview, setCompressedPreview] = useState<string>('')
  const [quality, setQuality] = useState(80)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setOriginalImage(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setOriginalPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    setCompressedImage(null)
    setCompressedPreview('')
    toast.success('Image loaded!')
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

      const reader = new FileReader()
      reader.onload = (event) => {
        setCompressedPreview(event.target?.result as string)
      }
      reader.readAsDataURL(compressed)

      toast.success('Image compressed successfully!')
    } catch (err) {
      toast.error('Failed to compress image')
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
    toast.success('Image downloaded!')
  }

  const handleClear = () => {
    setOriginalImage(null)
    setOriginalPreview('')
    setCompressedImage(null)
    setCompressedPreview('')
    toast.success('Cleared all images')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const compressionRatio = originalImage && compressedImage
    ? Math.round((1 - compressedImage.size / originalImage.size) * 100)
    : 0

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Compressor
          </h1>
          <p className="text-lg text-muted-foreground">
            Reduce image file sizes while maintaining quality. All processing happens in your browser.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image to compress (max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="gap-2"
                >
                  <Upload size={20} />
                  Choose Image
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
                      <Label htmlFor="quality-slider">Compression Quality</Label>
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
                      {isCompressing ? 'Compressing...' : 'Compress Image'}
                    </Button>
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="gap-2"
                    >
                      <Trash size={16} />
                      Clear
                    </Button>
                  </div>

                  {isCompressing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        Compressing: {Math.round(progress)}%
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
                    <CardTitle>Original</CardTitle>
                    <CardDescription>
                      {formatFileSize(originalImage?.size || 0)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={originalPreview}
                      alt="Original"
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
                        <CardTitle>Compressed</CardTitle>
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
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img
                      src={compressedPreview}
                      alt="Compressed"
                      className="w-full h-auto rounded-lg border border-border"
                    />
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="font-medium text-green-600">
                        {compressionRatio}% smaller
                      </span>
                      <span className="text-muted-foreground">
                        ({formatFileSize((originalImage?.size || 0) - (compressedImage?.size || 0))} saved)
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
                  No image selected
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose an image to get started
                </p>
                <Button
                  onClick={() => document.getElementById('file-input')?.click()}
                  variant="outline"
                >
                  Select Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

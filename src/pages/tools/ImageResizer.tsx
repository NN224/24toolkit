import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, Trash, Image as ImageIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
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
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = event.target?.result as string
      setImage(event.target?.result as string)
      setResizedImage(null)
    }
    reader.readAsDataURL(file)
    toast.success('Image loaded!')
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (maintainAspectRatio && value && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width
      const newHeight = Math.round(parseInt(value) * ratio)
      setHeight(newHeight.toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (maintainAspectRatio && value && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height
      const newWidth = Math.round(parseInt(value) * ratio)
      setWidth(newWidth.toString())
    }
  }

  const handleResize = () => {
    if (!image) {
      toast.error('Please upload an image first')
      return
    }

    if (!width || !height) {
      toast.error('Please enter width and height')
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = parseInt(width)
      canvas.height = parseInt(height)
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, parseInt(width), parseInt(height))
        const resized = canvas.toDataURL('image/png')
        setResizedImage(resized)
        toast.success('Image resized!')
      }
    }
    img.src = image
  }

  const handleDownload = () => {
    if (!resizedImage) return

    const link = document.createElement('a')
    link.download = `resized-${width}x${height}.png`
    link.href = resizedImage
    link.click()
    toast.success('Image downloaded!')
  }

  const handleClear = () => {
    setImage(null)
    setResizedImage(null)
    setWidth('')
    setHeight('')
    setOriginalDimensions({ width: 0, height: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Resizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Resize images to custom dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Configure</CardTitle>
              <CardDescription>Select image and set dimensions</CardDescription>
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
                  <div className="border rounded-lg p-4">
                    <img src={image} alt="Original" className="w-full h-auto max-h-[200px] object-contain" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Original: {originalDimensions.width} × {originalDimensions.height}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="aspect-ratio" className="cursor-pointer">
                        Maintain aspect ratio
                      </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          placeholder="Width"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          placeholder="Height"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleResize} className="flex-1">
                        <ImageIcon size={18} className="mr-2" />
                        Resize Image
                      </Button>
                      <Button onClick={handleClear} variant="outline">
                        <Trash size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>Resized image preview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resizedImage ? (
                <>
                  <div className="border rounded-lg p-4">
                    <img src={resizedImage} alt="Resized" className="w-full h-auto max-h-[300px] object-contain" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Resized: {width} × {height}
                    </p>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    Download Resized Image
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Resized image will appear here</p>
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

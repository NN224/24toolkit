import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Trash, ArrowsClockwise, ArrowsCounterClockwise, ArrowsHorizontal, ArrowsVertical } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function ImageRotator() {
  // Set SEO metadata
  const metadata = getPageMetadata('image-rotator')
  useSEO(metadata)

  const [image, setImage] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
      drawImage(event.target?.result as string, 0, false, false)
    }
    reader.readAsDataURL(file)
    toast.success('Image loaded!')
  }

  const drawImage = (imgSrc: string, rot: number, fH: boolean, fV: boolean) => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const radians = (rot * Math.PI) / 180

      if (rot === 90 || rot === 270) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(radians)

      const scaleX = fH ? -1 : 1
      const scaleY = fV ? -1 : 1
      ctx.scale(scaleX, scaleY)

      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      ctx.restore()
    }
    img.src = imgSrc
  }

  const handleRotate = (degrees: number) => {
    if (!image) return
    const newRotation = (rotation + degrees) % 360
    setRotation(newRotation)
    drawImage(image, newRotation, flipH, flipV)
    toast.success(`Rotated ${degrees > 0 ? 'right' : 'left'}`)
  }

  const handleFlip = (horizontal: boolean) => {
    if (!image) return
    if (horizontal) {
      const newFlipH = !flipH
      setFlipH(newFlipH)
      drawImage(image, rotation, newFlipH, flipV)
      toast.success('Flipped horizontally')
    } else {
      const newFlipV = !flipV
      setFlipV(newFlipV)
      drawImage(image, rotation, flipH, newFlipV)
      toast.success('Flipped vertically')
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'rotated-image.png'
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        toast.success('Image downloaded!')
      }
    })
  }

  const handleClear = () => {
    setImage(null)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Rotator
          </h1>
          <p className="text-lg text-muted-foreground">
            Rotate and flip images in any direction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {rotation !== 0 || flipH || flipV 
                  ? `Rotation: ${rotation}° ${flipH ? '| Flipped H' : ''} ${flipV ? '| Flipped V' : ''}`
                  : 'Original orientation'
                }
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
              
              {!image ? (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload size={18} className="mr-2" />
                  Upload Image
                </Button>
              ) : (
                <>
                  <div className="border rounded-lg p-4 bg-muted flex items-center justify-center min-h-[400px]">
                    <canvas ref={canvasRef} className="max-w-full max-h-[500px]" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      Download
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
              <CardTitle>Transform</CardTitle>
              <CardDescription>Rotate and flip controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rotate</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleRotate(-90)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsCounterClockwise size={18} className="mr-2" />
                    Left 90°
                  </Button>
                  <Button 
                    onClick={() => handleRotate(90)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsClockwise size={18} className="mr-2" />
                    Right 90°
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Flip</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleFlip(true)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsHorizontal size={18} className="mr-2" />
                    Horizontal
                  </Button>
                  <Button 
                    onClick={() => handleFlip(false)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsVertical size={18} className="mr-2" />
                    Vertical
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Angles</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map((angle) => (
                      <Button
                        key={angle}
                        onClick={() => {
                          setRotation(angle)
                          if (image) drawImage(image, angle, flipH, flipV)
                        }}
                        variant={rotation === angle ? 'default' : 'outline'}
                        size="sm"
                        disabled={!image}
                      >
                        {angle}°
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

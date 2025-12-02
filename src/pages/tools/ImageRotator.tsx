import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Trash, ArrowsClockwise, ArrowsCounterClockwise, ArrowsHorizontal, ArrowsVertical } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function ImageRotator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-rotator')
  useSEO({ ...metadata, canonicalPath: '/tools/image-rotator' })

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
      toast.error(t('tools.imageRotator.selectImageFile'))
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
    toast.success(t('tools.imageRotator.imageLoaded'))
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
    toast.success(t(degrees > 0 ? 'tools.imageRotator.rotatedRight' : 'tools.imageRotator.rotatedLeft'))
  }

  const handleFlip = (horizontal: boolean) => {
    if (!image) return
    if (horizontal) {
      const newFlipH = !flipH
      setFlipH(newFlipH)
      drawImage(image, rotation, newFlipH, flipV)
      toast.success(t('tools.imageRotator.flippedHorizontally'))
    } else {
      const newFlipV = !flipV
      setFlipV(newFlipV)
      drawImage(image, rotation, flipH, newFlipV)
      toast.success(t('tools.imageRotator.flippedVertically'))
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
        toast.success(t('tools.imageRotator.imageDownloaded'))
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
    toast.success(t('tools.imageRotator.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.imageRotator.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageRotator.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('tools.common.preview')}</CardTitle>
              <CardDescription>
                {rotation !== 0 || flipH || flipV 
                  ? `${t('tools.imageRotator.rotation')}: ${rotation}° ${flipH ? `| ${t('tools.imageRotator.flippedH')}` : ''} ${flipV ? `| ${t('tools.imageRotator.flippedV')}` : ''}`
                  : t('tools.imageRotator.originalOrientation')
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
                  {t('tools.imageRotator.uploadImage')}
                </Button>
              ) : (
                <>
                  <div className="border rounded-lg p-4 bg-muted flex items-center justify-center min-h-[400px]">
                    <canvas ref={canvasRef} className="max-w-full max-h-[500px]" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      {t('tools.common.download')}
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
              <CardTitle>{t('tools.imageRotator.transform')}</CardTitle>
              <CardDescription>{t('tools.imageRotator.rotateAndFlipControls')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('tools.imageRotator.rotate')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleRotate(-90)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsCounterClockwise size={18} className="mr-2" />
                    {t('tools.imageRotator.left90')}
                  </Button>
                  <Button 
                    onClick={() => handleRotate(90)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsClockwise size={18} className="mr-2" />
                    {t('tools.imageRotator.right90')}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('tools.imageRotator.flip')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleFlip(true)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsHorizontal size={18} className="mr-2" />
                    {t('tools.imageRotator.horizontal')}
                  </Button>
                  <Button 
                    onClick={() => handleFlip(false)} 
                    variant="outline"
                    disabled={!image}
                  >
                    <ArrowsVertical size={18} className="mr-2" />
                    {t('tools.imageRotator.vertical')}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('tools.imageRotator.quickAngles')}</label>
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

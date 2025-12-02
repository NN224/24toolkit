import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Trash, Scissors } from '@phosphor-icons/react'
import { toast } from 'sonner'
import Cropper, { Area } from 'react-easy-crop'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function ImageCropper() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('image-cropper')
  useSEO(metadata)

  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageCropper.selectImageFile'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setCroppedImage(null)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.imageCropper.imageLoaded'))
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async () => {
    if (!image || !croppedAreaPixels) return

    try {
      const imageElement = await createImage(image)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      const croppedImageUrl = canvas.toDataURL('image/png')
      setCroppedImage(croppedImageUrl)
      toast.success(t('tools.imageCropper.imageCropped'))
    } catch (error) {
      toast.error(t('tools.imageCropper.cropFailed'))
    }
  }

  const handleDownload = () => {
    if (!croppedImage) return

    const link = document.createElement('a')
    link.download = 'cropped-image.png'
    link.href = croppedImage
    link.click()
    toast.success(t('tools.common.downloaded'))
  }

  const handleClear = () => {
    setImage(null)
    setCroppedImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success(t('tools.imageCropper.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.imageCropper.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.imageCropper.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.imageCropper.cropArea')}</CardTitle>
              <CardDescription>{t('tools.imageCropper.adjustCropArea')}</CardDescription>
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
                  {t('tools.imageCropper.uploadImage')}
                </Button>
              ) : (
                <>
                  <div className="relative h-[400px] bg-black rounded-lg overflow-hidden">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('tools.imageCropper.zoom')}: {zoom.toFixed(1)}x</label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={getCroppedImg} className="flex-1">
                      <Scissors size={18} className="mr-2" />
                      {t('tools.imageCropper.cropImage')}
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
              <CardTitle>{t('tools.imageCropper.croppedResult')}</CardTitle>
              <CardDescription>{t('tools.imageCropper.previewAndDownload')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {croppedImage ? (
                <>
                  <div className="border rounded-lg p-4 bg-muted">
                    <img src={croppedImage} alt={t('tools.common.cropped')} className="w-full h-auto max-h-[400px] object-contain" />
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download size={18} className="mr-2" />
                    {t('tools.imageCropper.downloadCroppedImage')}
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Scissors size={48} className="mx-auto mb-2 opacity-20" />
                    <p>{t('tools.imageCropper.croppedImagePlaceholder')}</p>
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

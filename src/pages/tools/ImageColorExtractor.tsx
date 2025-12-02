import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Trash, Palette } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

interface ColorInfo {
  hex: string
  rgb: string
  percentage: number
}

export default function ImageColorExtractor() {
  // Set SEO metadata
  const metadata = getPageMetadata('image-color-extractor')
  useSEO(metadata)

  const { t } = useTranslation()
  const [image, setImage] = useState<string | null>(null)
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('tools.imageColorExtractor.selectImageError'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setColors([])
    }
    reader.readAsDataURL(file)
    toast.success(t('tools.imageColorExtractor.imageLoaded'))
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const extractColors = () => {
    if (!image) {
      toast.error(t('tools.imageColorExtractor.uploadFirst'))
      return
    }

    setIsProcessing(true)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const colorMap = new Map<string, number>()

      for (let i = 0; i < data.length; i += 40) {
        const red = data[i]
        const green = data[i + 1]
        const blue = data[i + 2]
        
        const redRounded = Math.round(red / 10) * 10
        const greenRounded = Math.round(green / 10) * 10
        const blueRounded = Math.round(blue / 10) * 10
        
        const key = `${redRounded},${greenRounded},${blueRounded}`
        colorMap.set(key, (colorMap.get(key) || 0) + 1)
      }

      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)

      const total = sortedColors.reduce((sum, [, count]) => sum + count, 0)

      const extractedColors: ColorInfo[] = sortedColors.map(([rgb, count]) => {
        const [red, green, blue] = rgb.split(',').map(Number)
        return {
          hex: rgbToHex(red, green, blue),
          rgb: `rgb(${red}, ${green}, ${blue})`,
          percentage: Math.round((count / total) * 100)
        }
      })

      setColors(extractedColors)
      setIsProcessing(false)
      toast.success(t('tools.imageColorExtractor.colorsSuccess'))
    }

    img.src = image
  }

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      toast.success(t('tools.imageColorExtractor.colorCopied'))
    } catch (err) {
      toast.error(t('tools.imageColorExtractor.copyFailed'))
    }
  }

  const handleClear = () => {
    setImage(null)
    setColors([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success(t('tools.imageColorExtractor.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Color Extractor
          </h1>
          <p className="text-lg text-muted-foreground">
            Extract dominant colors from any image
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image to analyze</CardDescription>
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
                    <img src={image} alt={t('tools.common.original')} className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={extractColors} 
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Palette size={18} className="mr-2" />
                          Extract Colors
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
              <CardTitle>Dominant Colors</CardTitle>
              <CardDescription>
                {colors.length > 0 ? `${colors.length} colors extracted` : 'Color palette will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {colors.length > 0 ? (
                <div className="space-y-3">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors group cursor-pointer"
                      onClick={() => handleCopyColor(color.hex)}
                    >
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-border flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div className="font-mono text-sm font-semibold">{color.hex}</div>
                        <div className="text-xs text-muted-foreground">{color.rgb}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{color.percentage}%</div>
                        <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to copy
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex h-12 rounded-lg overflow-hidden border">
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: color.hex,
                            width: `${color.percentage}%`
                          }}
                          title={`${color.hex} (${color.percentage}%)`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Color distribution
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Palette size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Extracted colors will appear here</p>
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

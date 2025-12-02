import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Shuffle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

interface ColorPalette {
  hex: string
  rgb: string
  hsl: string
}

export default function ColorPicker() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('color-picker')
  useSEO(metadata)

  const [selectedColor, setSelectedColor] = useState('#4A90E2')
  const [palette, setPalette] = useState<ColorPalette[]>([])
  const copyColor = useCopyToClipboard()

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return 'Invalid'
    const red = parseInt(result[1], 16)
    const green = parseInt(result[2], 16)
    const blue = parseInt(result[3], 16)
    return `rgb(${red}, ${green}, ${blue})`
  }

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return 'Invalid'
    
    const red = parseInt(result[1], 16) / 255
    const green = parseInt(result[2], 16) / 255
    const blue = parseInt(result[3], 16) / 255

    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)
    let hue = 0
    let saturation = 0
    const lightness = (max + min) / 2

    if (max !== min) {
      const delta = max - min
      saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
      
      switch (max) {
        case red: hue = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6; break
        case green: hue = ((blue - red) / delta + 2) / 6; break
        case blue: hue = ((red - green) / delta + 4) / 6; break
      }
    }

    return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`
  }

  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  const generatePalette = () => {
    const newPalette: ColorPalette[] = []
    for (let i = 0; i < 5; i++) {
      const hex = generateRandomColor()
      newPalette.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex)
      })
    }
    setPalette(newPalette)
    toast.success(t('tools.colorPicker.paletteGenerated'))
  }



  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.colorPicker.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.colorPicker.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.colorPicker.colorPickerCard')}</CardTitle>
              <CardDescription>
                {t('tools.colorPicker.selectColor')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-2">
                  <Label htmlFor="color-input">{t('tools.colorPicker.pickColor')}</Label>
                  <div className="flex gap-4 items-center">
                    <input
                      id="color-input"
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-24 h-24 rounded-lg cursor-pointer border-2 border-border"
                    />
                    <Input
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-32 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div
                  className="flex-1 rounded-lg border-2 border-border min-h-[120px]"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">HEX</Label>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{selectedColor.toUpperCase()}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyColor(selectedColor.toUpperCase(), t('tools.colorPicker.copied', { format: 'HEX' }))}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">RGB</Label>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{hexToRgb(selectedColor)}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyColor(hexToRgb(selectedColor), t('tools.colorPicker.copied', { format: 'RGB' }))}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">HSL</Label>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{hexToHsl(selectedColor)}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyColor(hexToHsl(selectedColor), t('tools.colorPicker.copied', { format: 'HSL' }))}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.colorPicker.paletteGenerator')}</CardTitle>
              <CardDescription>
                {t('tools.colorPicker.paletteDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generatePalette} className="gap-2">
                <Shuffle size={16} weight="bold" />
                {t('tools.colorPicker.generatePalette')}
              </Button>

              {palette.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {palette.map((color, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div
                        className="h-32 w-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <CardContent className="pt-4 space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <code className="text-xs font-mono">{color.hex}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyColor(color.hex, t('tools.colorPicker.copied', { format: 'HEX' }))}
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <code className="text-xs font-mono text-muted-foreground">{color.rgb}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyColor(color.rgb, t('tools.colorPicker.copied', { format: 'RGB' }))}
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <code className="text-xs font-mono text-muted-foreground">{color.hsl}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyColor(color.hsl, t('tools.colorPicker.copied', { format: 'HSL' }))}
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, Download, Trash, SlidersHorizontal } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function ImageFilterEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    blur: 0
  })
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
    }
    reader.readAsDataURL(file)
    toast.success('Image loaded!')
  }

  const getFilterStyle = () => {
    return {
      filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) saturate(${filters.saturate}%) blur(${filters.blur}px)`
    }
  }

  const handleDownload = async () => {
    if (!image) return

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) saturate(${filters.saturate}%) blur(${filters.blur}px)`
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.download = 'filtered-image.png'
              link.href = url
              link.click()
              URL.revokeObjectURL(url)
              toast.success('Image downloaded!')
            }
          })
        }
      }
      img.src = image
    } catch (error) {
      toast.error('Failed to download image')
    }
  }

  const handleReset = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
      saturate: 100,
      blur: 0
    })
    toast.success('Filters reset')
  }

  const handleClear = () => {
    setImage(null)
    setFilters({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
      saturate: 100,
      blur: 0
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Image Filter Editor
          </h1>
          <p className="text-lg text-muted-foreground">
            Apply filters and adjust image properties
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Live preview with filters applied</CardDescription>
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
                  <div className="border rounded-lg p-4 bg-muted">
                    <img 
                      src={image} 
                      alt="Preview" 
                      style={getFilterStyle()}
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download size={18} className="mr-2" />
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
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal size={20} />
                Filters
              </CardTitle>
              <CardDescription>Adjust image properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Brightness</Label>
                  <span className="text-sm text-muted-foreground">{filters.brightness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={filters.brightness}
                  onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Contrast</Label>
                  <span className="text-sm text-muted-foreground">{filters.contrast}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={filters.contrast}
                  onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Saturation</Label>
                  <span className="text-sm text-muted-foreground">{filters.saturate}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={filters.saturate}
                  onChange={(e) => setFilters({ ...filters, saturate: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Grayscale</Label>
                  <span className="text-sm text-muted-foreground">{filters.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.grayscale}
                  onChange={(e) => setFilters({ ...filters, grayscale: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Sepia</Label>
                  <span className="text-sm text-muted-foreground">{filters.sepia}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.sepia}
                  onChange={(e) => setFilters({ ...filters, sepia: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Blur</Label>
                  <span className="text-sm text-muted-foreground">{filters.blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={filters.blur}
                  onChange={(e) => setFilters({ ...filters, blur: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

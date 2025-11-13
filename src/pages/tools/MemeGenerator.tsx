import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, Trash, Smiley } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function MemeGenerator() {
  const [image, setImage] = useState<string | null>(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
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
      drawMeme(event.target?.result as string, topText, bottomText)
    }
    reader.readAsDataURL(file)
    toast.success('Image loaded!')
  }

  const drawMeme = (imgSrc: string, top: string, bottom: string) => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)

      ctx.font = `${img.width / 15}px Impact`
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = img.width / 200
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      if (top) {
        const topY = img.height * 0.05
        ctx.strokeText(top.toUpperCase(), img.width / 2, topY)
        ctx.fillText(top.toUpperCase(), img.width / 2, topY)
      }

      if (bottom) {
        ctx.textBaseline = 'bottom'
        const bottomY = img.height * 0.95
        ctx.strokeText(bottom.toUpperCase(), img.width / 2, bottomY)
        ctx.fillText(bottom.toUpperCase(), img.width / 2, bottomY)
      }
    }
    img.src = imgSrc
  }

  const handleGenerateMeme = () => {
    if (!image) {
      toast.error('Please upload an image first')
      return
    }
    drawMeme(image, topText, bottomText)
    toast.success('Meme generated!')
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'meme.png'
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        toast.success('Meme downloaded!')
      }
    })
  }

  const handleClear = () => {
    setImage(null)
    setTopText('')
    setBottomText('')
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
            Meme Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Create memes with top and bottom text
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Meme</CardTitle>
              <CardDescription>Preview and download</CardDescription>
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
                  <div className="border rounded-lg p-4 bg-black">
                    <canvas ref={canvasRef} className="w-full h-auto max-h-[500px] object-contain" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download size={18} className="mr-2" />
                      Download Meme
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
                <Smiley size={20} />
                Text Settings
              </CardTitle>
              <CardDescription>Add your meme text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="top-text">Top Text</Label>
                <Input
                  id="top-text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="TOP TEXT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottom-text">Bottom Text</Label>
                <Input
                  id="bottom-text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="BOTTOM TEXT"
                />
              </div>

              <Button onClick={handleGenerateMeme} className="w-full" disabled={!image}>
                <Smiley size={18} className="mr-2" weight="fill" />
                Generate Meme
              </Button>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Tip: Leave text fields empty if you only want top or bottom text
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

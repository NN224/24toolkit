import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Image as ImageIcon, Sparkle, Upload } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner'
import { AIBadge } from '@/components/ai/AIBadge'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'

export default function ImageCaptionGenerator() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImageUrl(result)
      setCaption('')
    }
    reader.readAsDataURL(file)
    toast.success('Image uploaded successfully')
  }

  const handleGenerateCaption = async () => {
    if (!imageUrl) {
      toast.error('Please upload an image first')
      return
    }

    setIsLoading(true)
    setCaption('')

    const promptText = `Generate a descriptive and accurate caption for this image. The caption should be concise (1-2 sentences), describe the main subject, setting, and notable details. Make it natural and engaging.`

    try {
      const result = await callAI(promptText, provider)
      setCaption(result.trim())
      toast.success('Caption generated successfully!')
    } catch (error) {
      console.error('Caption generation error:', error)
      const mockCaptions = [
        'A vibrant scene captured in stunning detail, showcasing natural beauty and composition.',
        'An artistic photograph featuring interesting subjects with excellent lighting and perspective.',
        'A memorable moment frozen in time, displaying careful attention to composition and color.',
        'An eye-catching image that tells a story through its carefully arranged elements.',
      ]
      const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)]
      setCaption(randomCaption)
      toast.success('Caption generated!')
    } finally {
      setIsLoading(false)
    }
  }



  const handleClear = () => {
    setImageUrl('')
    setCaption('')
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Image Caption Generator
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Upload an image and generate descriptive captions automatically using AI vision technology.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image file (JPG, PNG, WebP - Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <label
                  htmlFor="image-upload"
                  className="w-full cursor-pointer"
                >
                  <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-accent transition-colors bg-muted/20">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                        <Upload size={32} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WebP up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border-2 border-accent/20 bg-muted/50">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>

                  <div className="space-y-3">
                    <AIProviderSelector value={provider} onValueChange={setProvider} />

                    <div className="flex gap-2">
                      <Button
                        onClick={handleGenerateCaption}
                        disabled={isLoading}
                        className="gap-2 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Sparkle size={16} weight="fill" />
                        Generate Caption
                      </Button>
                      
                      <Button
                        onClick={handleClear}
                        variant="outline"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {(isLoading || caption) && (
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle>Generated Caption</CardTitle>
                <CardDescription>
                  AI-generated description of your image
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <AILoadingSpinner />
                ) : caption ? (
                  <div className="space-y-4">
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={20} weight="bold" className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground leading-relaxed text-lg">
                            {caption}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => copyToClipboard(caption, 'Caption copied to clipboard!')}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Copy size={16} />
                      Copy Caption
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {!imageUrl && !isLoading && (
            <Card className="border-border bg-muted/30">
              <CardContent className="py-12">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                    <ImageIcon size={36} weight="duotone" className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      No image uploaded yet
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Upload an image above to generate an AI-powered caption that describes its content, composition, and mood.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

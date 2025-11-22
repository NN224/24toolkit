import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Copy, Hash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function AIHashtagGenerator() {
  // Set SEO metadata
  const metadata = getPageMetadata('ai-hashtag-generator')
  useSEO(metadata)

  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const copyToClipboard = useCopyToClipboard()

  const generateHashtags = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to generate hashtags')
      return
    }

    setLoading(true)
    setHashtags([])
    
    try {
      const promptText = `Generate 15-20 relevant, popular hashtags for social media based on this content: "${content}"

Return only the hashtags, one per line, each starting with #. Include a mix of popular and niche hashtags.`

      let finalTags: string[] = []
      await callAI(promptText, provider, (accumulatedText) => {
        // Extract hashtags from accumulated text
        const tags = accumulatedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('#'))
        setHashtags(tags)
        finalTags = tags
      })
      
      toast.success(`Generated ${finalTags.length} hashtags!`)
    } catch (error) {
      console.error('Hashtag generation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate hashtags. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 ai-glow">
            <Hash size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">AI Hashtag Generator</h1>
            <p className="text-muted-foreground">Generate trending hashtags for social media posts</p>
          </div>
        </div>
      </div>

      <Card className="border-pink-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generate Hashtags with AI</CardTitle>
              <CardDescription>Get relevant hashtags for your social media content</CardDescription>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full">
              Powered by AI
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content-input">Post Content or Topic</Label>
            <Textarea
              id="content-input"
              placeholder="Enter your post content or describe your topic..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

          <AIProviderSelector value={provider} onValueChange={setProvider} />

          <Button
            onClick={generateHashtags}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Hashtags'}
          </Button>

          {hashtags.length > 0 && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label>Generated Hashtags ({hashtags.length})</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hashtags.join(' '), 'All hashtags copied!')}>
                  <Copy size={16} className="mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => copyToClipboard(tag, 'Hashtag copied!')}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Click any hashtag to copy it individually, or use "Copy All" to copy all hashtags at once.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

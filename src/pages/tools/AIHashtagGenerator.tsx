import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Copy, Hash, ShareNetwork, Check, TwitterLogo, LinkedinLogo, WhatsappLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AIHashtagGenerator() {
  // Set SEO metadata
  const metadata = getPageMetadata('ai-hashtag-generator')
  useSEO(metadata)

  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  const [copied, setCopied] = useState(false)
  const [isArabic, setIsArabic] = useState(false)
  const copyToClipboard = useCopyToClipboard()

  // Detect if content is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(content))
  }, [content])

  const handleCopyAll = () => {
    copyToClipboard(hashtags.join(' '), isArabic ? 'تم نسخ الهاشتاقات!' : 'All hashtags copied!')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
    const text = hashtags.join(' ')
    const encodedText = encodeURIComponent(text + ' - Created with 24Toolkit')
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      whatsapp: `https://wa.me/?text=${encodedText}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
    toast.success(isArabic ? 'جاري المشاركة...' : 'Sharing...')
  }

  const generateHashtags = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content or topic')
      return
    }

    try {
      validatePromptInput(content, 5, 5000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input')
      return
    }

    setLoading(true)
    setHashtags([])

    try {
      const promptText = AI_PROMPTS.HASHTAG_GENERATOR(content)

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
                <Label>{isArabic ? `الهاشتاقات (${hashtags.length})` : `Generated Hashtags (${hashtags.length})`}</Label>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                <div className="flex flex-wrap gap-2" dir={isArabic ? 'rtl' : 'ltr'}>
                  {hashtags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-pink-500 hover:text-white transition-colors text-sm py-1 px-3"
                      onClick={() => copyToClipboard(tag, isArabic ? 'تم النسخ!' : 'Hashtag copied!')}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopyAll}
                  variant="outline"
                  className="gap-2 flex-1 min-w-[120px]"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-500" />
                      {isArabic ? 'تم النسخ!' : 'Copied!'}
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      {isArabic ? 'نسخ الكل' : 'Copy All'}
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 flex-1 min-w-[120px]">
                      <ShareNetwork size={16} />
                      {isArabic ? 'مشاركة' : 'Share'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer">
                      <TwitterLogo size={18} weight="fill" className="text-[#1DA1F2]" />
                      Twitter / X
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-2 cursor-pointer">
                      <LinkedinLogo size={18} weight="fill" className="text-[#0077B5]" />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="gap-2 cursor-pointer">
                      <WhatsappLogo size={18} weight="fill" className="text-[#25D366]" />
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? '💡 نصيحة: اضغط على أي هاشتاق لنسخه مباشرة'
                    : '💡 Tip: Click any hashtag to copy it individually'
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

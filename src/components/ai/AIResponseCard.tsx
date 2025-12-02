import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ShareNetwork, Check, TwitterLogo, LinkedinLogo, WhatsappLogo, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AIResponseCardProps {
  title?: string
  content: string
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  variant?: 'default' | 'success' | 'purple' | 'blue' | 'pink'
  showShare?: boolean
  shareText?: string
  children?: React.ReactNode
}

export function AIResponseCard({
  title,
  content,
  isLoading = false,
  emptyMessage,
  className = '',
  variant = 'default',
  showShare = true,
  shareText,
  children
}: AIResponseCardProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [isArabic, setIsArabic] = useState(false)
  const copyToClipboard = useCopyToClipboard()

  // Detect if content is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(content))
  }, [content])

  const variantStyles = {
    default: 'bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800',
    success: 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800',
    purple: 'bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800',
    blue: 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800',
    pink: 'bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800'
  }

  const handleCopy = () => {
    copyToClipboard(content, t('common.copied'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp' | 'native') => {
    const text = shareText || content.slice(0, 280)
    const encodedText = encodeURIComponent(text)
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      native: ''
    }

    if (platform === 'native' && navigator.share) {
      navigator.share({
        title: title || '24Toolkit',
        text: text,
        url: window.location.href
      }).catch(() => {})
    } else if (platform !== 'native') {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
    
    toast.success(t('common.sharing'))
  }

  if (isLoading) {
    return (
      <Card className={`${variantStyles[variant]} border-2 ${className}`}>
        {title && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
              <Sparkle size={20} weight="fill" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500" />
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              Processing...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content && emptyMessage) {
    return (
      <Card className={`${variantStyles[variant]} border-2 ${className}`}>
        {title && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
              <Sparkle size={28} weight="fill" className="text-purple-500" />
            </div>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content) return null

  return (
    <Card className={`${variantStyles[variant]} border-2 ${className}`}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Content Display */}
        <div 
          className="rounded-xl p-6 bg-white/50 dark:bg-black/20 border border-border/50"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {content}
            </div>
          </div>
        </div>

        {/* Custom children (like tabs, extra buttons) */}
        {children}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Copy Button */}
          <Button
            onClick={handleCopy}
            variant="outline"
            className="gap-2 flex-1 min-w-[120px]"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </Button>

          {/* Share Button */}
          {showShare && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1 min-w-[120px]">
                  <ShareNetwork size={16} />
                  Share
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
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <DropdownMenuItem onClick={() => handleShare('native')} className="gap-2 cursor-pointer">
                    <ShareNetwork size={18} />
                    More...
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AIResponseCard

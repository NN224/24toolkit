import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { trackToolUsage } from '@/components/UserProgress'

export default function WordCounter() {
  // Set SEO metadata
  const metadata = getPageMetadata('word-counter')
  useSEO(metadata)

  const [text, setText] = useState('')

  // Track tool usage
  useEffect(() => {
    trackToolUsage('Word Counter')
  }, [])

  const stats = useMemo(() => {
    const trimmedText = text.trim()
    const words = trimmedText.length > 0 ? trimmedText.split(/\s+/).filter(word => word.length > 0) : []
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const paragraphs = trimmedText.length > 0 ? trimmedText.split(/\n\n+/).filter(p => p.length > 0).length : 0
    const sentences = trimmedText.length > 0 ? trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
    const readingTime = Math.ceil(words.length / 200)

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      readingTime: readingTime || 0
    }
  }, [text])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setText('')
    toast.success('Text cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Word & Character Counter
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze your text with real-time word count, character count, and reading time estimation.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Start typing or paste your text below to see live statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] resize-y font-normal"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy size={16} />
                  Copy Text
                </Button>
                <Button
                  onClick={handleClear}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.words.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Words</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.characters.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.charactersNoSpaces.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Characters (no spaces)</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.paragraphs.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Paragraphs</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.sentences.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Sentences</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-semibold text-primary mb-1">
                  {stats.readingTime}m
                </div>
                <div className="text-sm text-muted-foreground">Reading Time</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

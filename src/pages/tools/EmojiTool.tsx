import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Smiley } from '@phosphor-icons/react'
import { toast } from 'sonner'

const popularEmojis = ['😀', '😊', '😍', '🎉', '✨', '❤️', '👍', '🔥', '💯', '🌟', '🚀', '💪', '🎯', '⭐', '✅']

export default function EmojiTool() {
  const [text, setText] = useState('')

  const addEmoji = (emoji: string) => {
    setText(text + emoji)
  }

  const removeEmojis = () => {
    const cleaned = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    setText(cleaned)
    toast.success('Emojis removed')
  }

  const addRandomEmojis = () => {
    const words = text.split(' ')
    const withEmojis = words.map(word => {
      if (Math.random() > 0.7 && word.length > 0) {
        const emoji = popularEmojis[Math.floor(Math.random() * popularEmojis.length)]
        return word + emoji
      }
      return word
    }).join(' ')
    setText(withEmojis)
    toast.success('Random emojis added')
  }

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
            Emoji Adder / Cleaner
          </h1>
          <p className="text-lg text-muted-foreground">
            Add emojis to your text or remove all emojis with one click.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Type or paste text and add or remove emojis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-y font-normal"
              />
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={removeEmojis}
                    disabled={!text}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    Remove All Emojis
                  </Button>
                  <Button
                    onClick={addRandomEmojis}
                    disabled={!text}
                    variant="outline"
                    className="gap-2"
                  >
                    <Smiley size={16} />
                    Add Random Emojis
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Quick Add Emojis:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularEmojis.map(emoji => (
                      <Button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        variant="outline"
                        size="sm"
                        className="text-xl w-12 h-12"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

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
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

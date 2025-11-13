import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function RemoveLineBreaks() {
  const [text, setText] = useState('')

  const removeLineBreaks = () => {
    const cleaned = text.replace(/\n/g, ' ')
    setText(cleaned)
    toast.success('Line breaks removed')
  }

  const removeExtraSpaces = () => {
    const cleaned = text.replace(/\s+/g, ' ').trim()
    setText(cleaned)
    toast.success('Extra spaces removed')
  }

  const removeAll = () => {
    const cleaned = text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    setText(cleaned)
    toast.success('Line breaks and extra spaces removed')
  }

  const trimLines = () => {
    const cleaned = text
      .split('\n')
      .map(line => line.trim())
      .join('\n')
    setText(cleaned)
    toast.success('Lines trimmed')
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
            Remove Line Breaks & Extra Spaces
          </h1>
          <p className="text-lg text-muted-foreground">
            Clean up your text by removing unnecessary line breaks and extra whitespace.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Paste messy text and clean it up with one click
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
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={removeLineBreaks}
                  disabled={!text}
                  variant="outline"
                >
                  Remove Line Breaks
                </Button>
                <Button
                  onClick={removeExtraSpaces}
                  disabled={!text}
                  variant="outline"
                >
                  Remove Extra Spaces
                </Button>
                <Button
                  onClick={removeAll}
                  disabled={!text}
                  variant="default"
                >
                  Remove All
                </Button>
                <Button
                  onClick={trimLines}
                  disabled={!text}
                  variant="outline"
                >
                  Trim Lines
                </Button>
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

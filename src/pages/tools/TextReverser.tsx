import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function TextReverser() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')

  const reverseEntireText = () => {
    const reversed = text.split('').reverse().join('')
    setResult(reversed)
    toast.success('Text reversed')
  }

  const reverseWords = () => {
    const reversed = text.split(/\s+/).reverse().join(' ')
    setResult(reversed)
    toast.success('Words reversed')
  }

  const reverseEachWord = () => {
    const reversed = text
      .split(/\s+/)
      .map(word => word.split('').reverse().join(''))
      .join(' ')
    setResult(reversed)
    toast.success('Each word reversed')
  }

  const reverseLines = () => {
    const reversed = text.split('\n').reverse().join('\n')
    setResult(reversed)
    toast.success('Lines reversed')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      toast.success('Result copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setText('')
    setResult('')
    toast.success('Text cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Text Reverser
          </h1>
          <p className="text-lg text-muted-foreground">
            Reverse entire text, words, individual letters in words, or lines.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Type or paste your text and choose a reverse option
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] resize-y font-normal"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={reverseEntireText}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowsLeftRight size={16} />
                  Reverse All
                </Button>
                <Button
                  onClick={reverseWords}
                  disabled={!text}
                  variant="outline"
                >
                  Reverse Words
                </Button>
                <Button
                  onClick={reverseEachWord}
                  disabled={!text}
                  variant="outline"
                >
                  Reverse Each Word
                </Button>
                <Button
                  onClick={reverseLines}
                  disabled={!text}
                  variant="outline"
                >
                  Reverse Lines
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Reversed Result</CardTitle>
                <CardDescription>
                  Your reversed text is ready
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="result-output"
                  value={result}
                  readOnly
                  className="min-h-[150px] resize-y font-normal bg-muted/30"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="default"
                    className="gap-2"
                  >
                    <Copy size={16} />
                    Copy Result
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

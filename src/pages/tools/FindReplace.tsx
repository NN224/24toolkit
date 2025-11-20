import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, Trash, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function FindReplace() {
  // Set SEO metadata
  const metadata = getPageMetadata('find-replace')
  useSEO(metadata)

  const [text, setText] = useState('')
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegex, setUseRegex] = useState(false)

  const handleReplace = () => {
    if (!findText) {
      toast.error('Please enter text to find')
      return
    }

    try {
      let result = text
      
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(findText, flags)
        result = text.replace(regex, replaceText)
      } else {
        const flags = caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
        result = text.replace(regex, replaceText)
      }
      
      setText(result)
      toast.success('Text replaced successfully')
    } catch (error) {
      toast.error('Invalid regex pattern')
    }
  }

  const countOccurrences = () => {
    if (!findText) return 0

    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(findText, flags)
        const matches = text.match(regex)
        return matches ? matches.length : 0
      } else {
        const flags = caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
        const matches = text.match(regex)
        return matches ? matches.length : 0
      }
    } catch {
      return 0
    }
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
    setFindText('')
    setReplaceText('')
    toast.success('Text cleared')
  }

  const occurrences = countOccurrences()

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Find & Replace Text
          </h1>
          <p className="text-lg text-muted-foreground">
            Search and replace text with support for regex patterns and case sensitivity.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Paste text and use find & replace options below
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Find & Replace Options</CardTitle>
              <CardDescription>
                Configure search and replace parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="find-text">Find Text</Label>
                  <Input
                    id="find-text"
                    placeholder="Enter text to find..."
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replace-text">Replace With</Label>
                  <Input
                    id="replace-text"
                    placeholder="Enter replacement text..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="case-sensitive"
                    checked={caseSensitive}
                    onCheckedChange={setCaseSensitive}
                  />
                  <Label htmlFor="case-sensitive" className="cursor-pointer">
                    Case Sensitive
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-regex"
                    checked={useRegex}
                    onCheckedChange={setUseRegex}
                  />
                  <Label htmlFor="use-regex" className="cursor-pointer">
                    Use Regex
                  </Label>
                </div>
              </div>

              {findText && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                  <MagnifyingGlass size={16} />
                  <span>
                    Found {occurrences} {occurrences === 1 ? 'occurrence' : 'occurrences'}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleReplace}
                  disabled={!text || !findText}
                  variant="default"
                >
                  Replace All
                </Button>
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

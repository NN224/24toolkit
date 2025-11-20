import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { marked } from 'marked'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function MarkdownPreviewer() {
  // Set SEO metadata
  const metadata = getPageMetadata('markdown-previewer')
  useSEO(metadata)

  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Previewer

## Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- \`Inline code\`

### Code Blocks

\`\`\`javascript
function hello() {
  return "Hello, World!";
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Bullet point
- Another point

> Blockquote example

---

### Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`)
  const [html, setHtml] = useState('')

  const handlePreview = () => {
    if (!markdown.trim()) {
      toast.error('Please enter markdown text')
      return
    }

    try {
      const rendered = marked(markdown)
      setHtml(rendered as string)
      toast.success('Markdown rendered!')
    } catch (error) {
      toast.error('Failed to render markdown')
    }
  }

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      toast.success('Markdown copied!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(html)
      toast.success('HTML copied!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleClear = () => {
    setMarkdown('')
    setHtml('')
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Markdown Previewer
          </h1>
          <p className="text-lg text-muted-foreground">
            Write Markdown and see the live HTML preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Markdown Editor</CardTitle>
              <CardDescription>Write your markdown here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="markdown-input"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="# Enter markdown here..."
                className="font-mono text-sm min-h-[500px]"
              />

              <div className="flex gap-2">
                <Button onClick={handlePreview} className="flex-1">
                  <Eye size={18} className="mr-2" />
                  Preview
                </Button>
                <Button onClick={handleCopyMarkdown} variant="outline">
                  <Copy size={18} className="mr-2" />
                  Copy MD
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Rendered HTML output</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {html ? (
                <>
                  <div 
                    className="prose prose-sm max-w-none min-h-[500px] p-4 bg-muted rounded-lg overflow-auto"
                    dangerouslySetInnerHTML={{ __html: html }}
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                  />

                  <Button onClick={handleCopyHTML} variant="outline" className="w-full">
                    <Copy size={18} className="mr-2" />
                    Copy HTML
                  </Button>
                </>
              ) : (
                <div className="min-h-[500px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  Preview will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Markdown Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <div className="font-semibold">Headers</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded"># H1, ## H2, ### H3</code>
                </div>
                <div>
                  <div className="font-semibold">Bold & Italic</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">**bold** *italic*</code>
                </div>
                <div>
                  <div className="font-semibold">Links</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">[text](url)</code>
                </div>
                <div>
                  <div className="font-semibold">Images</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">![alt](url)</code>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold">Code</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">`inline code`</code>
                </div>
                <div>
                  <div className="font-semibold">Lists</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">- item or 1. item</code>
                </div>
                <div>
                  <div className="font-semibold">Blockquote</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">&gt; quote</code>
                </div>
                <div>
                  <div className="font-semibold">Horizontal Rule</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">---</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

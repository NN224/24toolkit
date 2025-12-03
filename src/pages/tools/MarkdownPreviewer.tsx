import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function MarkdownPreviewer() {
  const { t } = useTranslation()

  // Set SEO metadata
  const metadata = getPageMetadata('markdown-previewer')
  useSEO({ ...metadata, canonicalPath: '/tools/markdown-previewer' })

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
      toast.error(t('tools.markdownPreviewer.enterMarkdown'))
      return
    }

    try {
      // Render markdown to HTML
      const rendered = marked(markdown) as string
      
      // Sanitize HTML to prevent XSS attacks
      const sanitizedHtml = DOMPurify.sanitize(rendered, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'blockquote', 'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
        ALLOWED_ATTR: ['href', 'title', 'class'],
        ALLOW_DATA_ATTR: false
      })
      
      setHtml(sanitizedHtml)
      toast.success(t('tools.markdownPreviewer.rendered'))
    } catch (error) {
      toast.error(t('tools.markdownPreviewer.renderFailed'))
    }
  }

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      toast.success(t('tools.markdownPreviewer.markdownCopied'))
    } catch (err) {
      toast.error(t('tools.markdownPreviewer.copyFailed'))
    }
  }

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(html)
      toast.success(t('tools.markdownPreviewer.htmlCopied'))
    } catch (err) {
      toast.error(t('tools.markdownPreviewer.copyFailed'))
    }
  }

  const handleClear = () => {
    setMarkdown('')
    setHtml('')
    toast.success(t('tools.markdownPreviewer.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.markdownPreviewer.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.markdownPreviewer.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.markdownPreviewer.editor')}</CardTitle>
              <CardDescription>{t('tools.markdownPreviewer.enterMarkdown')}</CardDescription>
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
                  {t('tools.markdownPreviewer.preview')}
                </Button>
                <Button onClick={handleCopyMarkdown} variant="outline">
                  <Copy size={18} className="mr-2" />
                  {t('tools.common.copy')} MD
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.markdownPreviewer.preview')}</CardTitle>
              <CardDescription>{t('tools.markdownPreviewer.renderedOutput')}</CardDescription>
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
                    {t('tools.common.copy')} HTML
                  </Button>
                </>
              ) : (
                <div className="min-h-[500px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  {t('tools.markdownPreviewer.previewPlaceholder')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('tools.markdownPreviewer.quickReference')}</CardTitle>
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

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="markdown-previewer" category="dev" />
    </div>
  )
}

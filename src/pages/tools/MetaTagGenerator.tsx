import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Tag } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function MetaTagGenerator() {
  const [pageTitle, setPageTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [generatedTags, setGeneratedTags] = useState('')

  const generateTags = () => {
    if (!pageTitle) {
      toast.error('Please enter at least a page title')
      return
    }

    const tags = `<!-- Primary Meta Tags -->
<title>${pageTitle}</title>
<meta name="title" content="${pageTitle}">
${description ? `<meta name="description" content="${description}">` : ''}
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
${url ? `<meta property="og:url" content="${url}">` : ''}
<meta property="og:title" content="${pageTitle}">
${description ? `<meta property="og:description" content="${description}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
${url ? `<meta property="twitter:url" content="${url}">` : ''}
<meta property="twitter:title" content="${pageTitle}">
${description ? `<meta property="twitter:description" content="${description}">` : ''}

<!-- Viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="UTF-8">`

    setGeneratedTags(tags)
    toast.success('Meta tags generated!')
  }

  const copyTags = () => {
    navigator.clipboard.writeText(generatedTags)
    toast.success('Meta tags copied to clipboard!')
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Tag size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Meta Tag Generator</h1>
            <p className="text-muted-foreground">Generate SEO-optimized meta tags for your website</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Meta Information</CardTitle>
          <CardDescription>Enter your website details to generate meta tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-title">Page Title *</Label>
            <Input
              id="page-title"
              placeholder="e.g., My Awesome Website"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your page (150-160 characters recommended)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {description.length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., web development, SEO, tools"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Your name or company"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <Button onClick={generateTags} className="w-full">
            Generate Meta Tags
          </Button>

          {generatedTags && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>Generated Meta Tags</Label>
                <Button variant="ghost" size="sm" onClick={copyTags}>
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
                  {generatedTags}
                </pre>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  💡 Copy and paste these tags inside the {'<head>'} section of your HTML document.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

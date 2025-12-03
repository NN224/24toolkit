import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Tag } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function MetaTagGenerator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('meta-tag-generator')
  useSEO({ ...metadata, canonicalPath: '/tools/meta-tag-generator' })

  const [pageTitle, setPageTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [generatedTags, setGeneratedTags] = useState('')

  const generateTags = () => {
    if (!pageTitle) {
      toast.error(t('tools.metaTagGenerator.enterTitleError'))
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
    toast.success(t('tools.metaTagGenerator.tagsGenerated'))
  }

  const copyTags = () => {
    navigator.clipboard.writeText(generatedTags)
    toast.success(t('tools.metaTagGenerator.tagsCopied'))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Tag size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.metaTagGenerator.pageTitle')}</h1>
            <p className="text-muted-foreground">{t('tools.metaTagGenerator.subtitle')}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tools.metaTagGenerator.cardTitle')}</CardTitle>
          <CardDescription>{t('tools.metaTagGenerator.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-title">{t('tools.metaTagGenerator.pageTitleLabel')} *</Label>
            <Input
              id="page-title"
              placeholder={t('tools.metaTagGenerator.pageTitlePlaceholder')}
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('tools.metaTagGenerator.metaDescription')}</Label>
            <Textarea
              id="description"
              placeholder={t('tools.metaTagGenerator.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {description.length} {t('tools.metaTagGenerator.characters')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">{t('tools.metaTagGenerator.keywords')}</Label>
            <Input
              id="keywords"
              placeholder={t('tools.metaTagGenerator.keywordsPlaceholder')}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">{t('tools.metaTagGenerator.websiteUrl')}</Label>
            <Input
              id="url"
              type="url"
              placeholder={t('tools.metaTagGenerator.urlPlaceholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">{t('tools.metaTagGenerator.author')}</Label>
            <Input
              id="author"
              placeholder={t('tools.metaTagGenerator.authorPlaceholder')}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <Button onClick={generateTags} className="w-full">
            {t('tools.metaTagGenerator.generateButton')}
          </Button>

          {generatedTags && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>{t('tools.metaTagGenerator.generatedTags')}</Label>
                <Button variant="ghost" size="sm" onClick={copyTags}>
                  <Copy size={16} className="mr-2" />
                  {t('tools.common.copy')}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
                  {generatedTags}
                </pre>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  💡 {t('tools.metaTagGenerator.copyInstructions')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="meta-tag-generator" category="dev" />
    </div>
  )
}

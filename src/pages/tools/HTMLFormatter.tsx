import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, Code } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function HTMLFormatter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('html-formatter')
  useSEO({ ...metadata, canonicalPath: '/tools/html-formatter' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.htmlFormatter.title')

  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [language, setLanguage] = useState<'html' | 'css' | 'javascript'>('html')

  const formatHTML = (html: string): string => {
    let formatted = ''
    let indent = 0
    const lines = html.split(/>\s*</)
    
    lines.forEach((line, index) => {
      if (index > 0) line = '<' + line
      if (index < lines.length - 1) line = line + '>'
      
      const isClosing = line.startsWith('</')
      const isSelfClosing = line.endsWith('/>')
      const isOpening = !isClosing && !isSelfClosing && line.startsWith('<') && !line.startsWith('<!') && !line.startsWith('<?')
      
      if (isClosing) indent--
      
      formatted += '  '.repeat(Math.max(0, indent)) + line.trim() + '\n'
      
      if (isOpening) indent++
    })
    
    return formatted.trim()
  }

  const formatCSS = (css: string): string => {
    let formatted = ''
    let indent = 0
    const lines = css.split(/[{};]/)
    
    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      if (trimmed.includes('}')) {
        indent--
      }
      
      formatted += '  '.repeat(Math.max(0, indent)) + trimmed
      
      if (trimmed.includes('{')) {
        formatted += ' {\n'
        indent++
      } else if (trimmed.includes('}')) {
        formatted += '\n'
      } else {
        formatted += ';\n'
      }
    })
    
    return formatted.trim()
  }

  const formatJavaScript = (js: string): string => {
    let formatted = ''
    let indent = 0
    const lines = js.split(/\n/)
    
    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indent--
      }
      
      formatted += '  '.repeat(Math.max(0, indent)) + trimmed + '\n'
      
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indent++
      }
    })
    
    return formatted.trim()
  }

  const handleFormat = () => {
    if (!input.trim()) {
      toast.error(t('tools.htmlFormatter.enterCodeError'))
      return
    }

    try {
      let result = ''
      if (language === 'html') {
        result = formatHTML(input)
      } else if (language === 'css') {
        result = formatCSS(input)
      } else {
        result = formatJavaScript(input)
      }
      setFormatted(result)
      toast.success(t('tools.htmlFormatter.formatSuccess'))
    } catch (error) {
      toast.error(t('tools.htmlFormatter.formatFailed'))
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      toast.success(t('tools.htmlFormatter.codeCopied'))
    } catch (err) {
      toast.error(t('tools.htmlFormatter.copyFailed'))
    }
  }

  const handleClear = () => {
    setInput('')
    setFormatted('')
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {pageH1}
          </h1>
          <p className="text-lg text-muted-foreground">
            {metadata.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.htmlFormatter.inputCode')}</CardTitle>
              <CardDescription>{t('tools.htmlFormatter.pasteCodeHere')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={language} onValueChange={(v) => setLanguage(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Textarea
                id="code-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('tools.htmlFormatter.enterCodePlaceholder', { language: language.toUpperCase() })}
                className="font-mono text-sm min-h-[400px]"
              />

              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  <Code size={18} className="mr-2" />
                  {t('tools.htmlFormatter.formatCode')}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.htmlFormatter.formattedOutput')}</CardTitle>
              <CardDescription>{t('tools.htmlFormatter.beautifiedCode')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formatted ? (
                <div className="relative">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      maxHeight: '400px',
                      fontSize: '0.875rem'
                    }}
                  >
                    {formatted}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  {t('tools.htmlFormatter.formattedCodePlaceholder')}
                </div>
              )}

              {formatted && (
                <Button onClick={handleCopy} className="w-full">
                  <Copy size={18} className="mr-2" />
                  {t('tools.htmlFormatter.copyFormattedCode')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="html-formatter" category="dev" />
    </div>
  )
}

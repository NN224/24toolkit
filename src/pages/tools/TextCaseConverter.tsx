import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TextCaseConverter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('text-case-converter')
  useSEO({ ...metadata, canonicalPath: '/tools/text-case-converter' })

  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const copyToClipboard = useCopyToClipboard()

  const convertToUpper = () => {
    const converted = text.toUpperCase()
    setResult(converted)
    toast.success(t('tools.textCaseConverter.convertedToUppercase'))
  }

  const convertToLower = () => {
    const converted = text.toLowerCase()
    setResult(converted)
    toast.success(t('tools.textCaseConverter.convertedToLowercase'))
  }

  const convertToTitle = () => {
    const converted = text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
    setResult(converted)
    toast.success(t('tools.textCaseConverter.convertedToTitleCase'))
  }

  const convertToSentence = () => {
    const converted = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase())
    setResult(converted)
    toast.success(t('tools.textCaseConverter.convertedToSentenceCase'))
  }

  const convertToCamel = () => {
    const converted = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    setResult(converted)
    toast.success(t('tools.textCaseConverter.convertedToCamelCase'))
  }

  const convertToSnake = () => {
    const converted = text
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[A-Z]/g, char => '_' + char.toLowerCase())
      .replace(/^_/, '')
    setResult(converted)
    toast.success(t('tools.textCaseConverter.convertedToSnakeCase'))
  }



  const handleClear = () => {
    setText('')
    setResult('')
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.textCaseConverter.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.textCaseConverter.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.textCaseConverter.enterText')}</CardTitle>
              <CardDescription>
                {t('tools.textCaseConverter.typeOrPaste')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.common.typeOrPaste')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] resize-y font-normal"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button
                  onClick={convertToUpper}
                  disabled={!text}
                  variant="outline"
                >
                  UPPERCASE
                </Button>
                <Button
                  onClick={convertToLower}
                  disabled={!text}
                  variant="outline"
                >
                  lowercase
                </Button>
                <Button
                  onClick={convertToTitle}
                  disabled={!text}
                  variant="outline"
                >
                  Title Case
                </Button>
                <Button
                  onClick={convertToSentence}
                  disabled={!text}
                  variant="outline"
                >
                  Sentence case
                </Button>
                <Button
                  onClick={convertToCamel}
                  disabled={!text}
                  variant="outline"
                >
                  camelCase
                </Button>
                <Button
                  onClick={convertToSnake}
                  disabled={!text}
                  variant="outline"
                >
                  snake_case
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.textCaseConverter.convertedResult')}</CardTitle>
                <CardDescription>
                  {t('tools.textCaseConverter.textReady')}
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
                    onClick={() => copyToClipboard(result, t('tools.common.copied'))}
                    variant="default"
                    className="gap-2"
                  >
                    <Copy size={16} />
                    {t('tools.common.copyResult')}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2"
                  >
                    <Trash size={16} />
                    {t('tools.common.clearAll')}
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

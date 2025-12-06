import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { RelatedTools } from '@/components/RelatedTools'

export default function FindReplace() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('find-replace')
  useSEO({ ...metadata, canonicalPath: '/tools/find-replace' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.findReplace.name')

  const [text, setText] = useState('')
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegex, setUseRegex] = useState(false)

  const handleReplace = () => {
    if (!findText) {
      toast.error(t('tools.findReplace.noMatches'))
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
      toast.success(t('tools.findReplace.replaced'))
    } catch (error) {
      toast.error(t('tools.common.error'))
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
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleClear = () => {
    setText('')
    setFindText('')
    setReplaceText('')
    toast.success(t('tools.common.success'))
  }

  const occurrences = countOccurrences()

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">{pageH1}</h1>
          <p className="text-lg text-muted-foreground">{metadata.description}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.findReplace.enterText')}</CardTitle>
              <CardDescription>
                {t('tools.findReplace.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="text-input"
                placeholder={t('tools.common.enterText')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-y font-normal"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.common.options')}</CardTitle>
              <CardDescription>
                {t('tools.findReplace.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="find-text">{t('tools.findReplace.find')}</Label>
                  <Input
                    id="find-text"
                    placeholder={t('tools.common.enterText')}
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replace-text">{t('tools.findReplace.replace')}</Label>
                  <Input
                    id="replace-text"
                    placeholder={t('tools.common.enterText')}
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
                    {t('tools.findReplace.caseSensitive')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-regex"
                    checked={useRegex}
                    onCheckedChange={setUseRegex}
                  />
                  <Label htmlFor="use-regex" className="cursor-pointer">
                    {t('tools.findReplace.useRegex')}
                  </Label>
                </div>
              </div>

              {findText && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                  <MagnifyingGlass size={16} />
                  <span>
                    {occurrences} {t('tools.findReplace.matchesFound')}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleReplace}
                  disabled={!text || !findText}
                  variant="default"
                >
                  {t('tools.findReplace.replaceAll')}
                </Button>
                <Button
                  onClick={handleCopy}
                  disabled={!text}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy size={16} />
                  {t('tools.common.copy')}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  {t('tools.common.clear')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="find-replace" category="text" />
    </div>
  )
}

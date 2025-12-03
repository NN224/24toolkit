import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function Base64Tool() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('base64-tool')
  useSEO({ ...metadata, canonicalPath: '/tools/base64-tool' })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const copyToClipboard = useCopyToClipboard()

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t('tools.base64Tool.enterTextToEncode'))
      return
    }

    try {
      const encoded = btoa(input)
      setOutput(encoded)
      toast.success(t('tools.base64Tool.encoded'))
    } catch (error) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error(t('tools.base64Tool.enterBase64ToDecode'))
      return
    }

    try {
      const decoded = atob(input)
      setOutput(decoded)
      toast.success(t('tools.base64Tool.decoded'))
    } catch (error) {
      toast.error(t('tools.base64Tool.invalidBase64'))
    }
  }



  const handleClear = () => {
    setInput('')
    setOutput('')
    toast.success(t('tools.common.cleared'))
  }

  const handleSwap = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.base64Tool.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.base64Tool.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.base64Tool.input')}</CardTitle>
              <CardDescription>
                {mode === 'encode' ? t('tools.base64Tool.enterTextToEncode') : t('tools.base64Tool.enterBase64ToDecode')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encode">{t('tools.base64Tool.encode')}</TabsTrigger>
                  <TabsTrigger value="decode">{t('tools.base64Tool.decode')}</TabsTrigger>
                </TabsList>
              </Tabs>

              <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? t('tools.base64Tool.enterPlainText') : t('tools.base64Tool.enterBase64String')}
                className="font-mono text-sm min-h-[300px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={mode === 'encode' ? handleEncode : handleDecode} 
                  className="flex-1"
                >
                  {mode === 'encode' ? t('tools.base64Tool.encode') : t('tools.base64Tool.decode')}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.base64Tool.output')}</CardTitle>
              <CardDescription>
                {mode === 'encode' ? t('tools.base64Tool.encodedResult') : t('tools.base64Tool.decodedResult')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {output ? (
                <>
                  <Textarea
                    value={output}
                    readOnly
                    className="font-mono text-sm min-h-[300px] bg-muted"
                  />

                  <div className="flex gap-2">
                    <Button onClick={() => copyToClipboard(output)} className="flex-1">
                      <Copy size={18} className="ltr:mr-2 rtl:ml-2" />
                      {t('tools.common.copyResult')}
                    </Button>
                    <Button onClick={handleSwap} variant="outline">
                      <ArrowsLeftRight size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="min-h-[300px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  {t('tools.base64Tool.resultWillAppear')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('tools.base64Tool.aboutBase64')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('tools.base64Tool.aboutDescription')}
            </p>
          </CardContent>
        </Card>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="base64-tool" category="dev" />
    </div>
  )
}

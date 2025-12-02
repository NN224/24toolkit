import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Trash, ArrowsLeftRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function URLEncoderDecoder() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('url-encoder-decoder')
  useSEO(metadata)

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error(t('tools.urlEncoderDecoder.enterText'))
      return
    }

    try {
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
      toast.success(t('tools.urlEncoderDecoder.encoded'))
    } catch (error) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error(t('tools.urlEncoderDecoder.enterText'))
      return
    }

    try {
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
      toast.success(t('tools.urlEncoderDecoder.decoded'))
    } catch (error) {
      toast.error(t('tools.common.error'))
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.common.error'))
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
            {t('tools.urlEncoderDecoder.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.urlEncoderDecoder.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.urlEncoderDecoder.input')}</CardTitle>
              <CardDescription>
                {mode === 'encode' ? t('tools.urlEncoderDecoder.enterText') : t('tools.urlEncoderDecoder.enterText')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encode">{t('tools.urlEncoderDecoder.encode')}</TabsTrigger>
                  <TabsTrigger value="decode">{t('tools.urlEncoderDecoder.decode')}</TabsTrigger>
                </TabsList>
              </Tabs>

              <Textarea
                id="url-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text with special characters...' 
                  : 'Enter URL encoded string...'
                }
                className="font-mono text-sm min-h-[300px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={mode === 'encode' ? handleEncode : handleDecode} 
                  className="flex-1"
                >
                  {mode === 'encode' ? t('tools.urlEncoderDecoder.encode') : t('tools.urlEncoderDecoder.decode')}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.urlEncoderDecoder.output')}</CardTitle>
              <CardDescription>
                {mode === 'encode' ? t('tools.urlEncoderDecoder.encoded') : t('tools.urlEncoderDecoder.decoded')}
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
                    <Button onClick={handleCopy} className="flex-1">
                      <Copy size={18} className="mr-2" />
                      {t('tools.common.copy')}
                    </Button>
                    <Button onClick={handleSwap} variant="outline">
                      <ArrowsLeftRight size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="min-h-[300px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  {t('tools.urlEncoderDecoder.resultWillAppear')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common URL Encoded Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded">Space → %20</div>
                <div className="font-mono bg-muted p-2 rounded">! → %21</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded"># → %23</div>
                <div className="font-mono bg-muted p-2 rounded">$ → %24</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded">& → %26</div>
                <div className="font-mono bg-muted p-2 rounded">= → %3D</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono bg-muted p-2 rounded">? → %3F</div>
                <div className="font-mono bg-muted p-2 rounded">@ → %40</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

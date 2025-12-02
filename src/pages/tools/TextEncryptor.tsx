import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Trash, LockKey } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TextEncryptor() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('text-encryptor')
  useSEO(metadata)

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')

  const simpleEncrypt = (text: string, key: string): string => {
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode ^ keyChar)
    }
    return btoa(result)
  }

  const simpleDecrypt = (encrypted: string, key: string): string => {
    try {
      const decoded = atob(encrypted)
      let result = ''
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode ^ keyChar)
      }
      return result
    } catch {
      throw new Error('Invalid encrypted text or wrong password')
    }
  }

  const handleEncrypt = () => {
    if (!input.trim()) {
      toast.error(t('tools.textEncryptor.enterTextToEncrypt'))
      return
    }

    if (!password.trim()) {
      toast.error(t('tools.textEncryptor.enterPassword'))
      return
    }

    try {
      const encrypted = simpleEncrypt(input, password)
      setOutput(encrypted)
      toast.success(t('tools.textEncryptor.textEncrypted'))
    } catch (error) {
      toast.error(t('tools.textEncryptor.failedToEncrypt'))
    }
  }

  const handleDecrypt = () => {
    if (!input.trim()) {
      toast.error(t('tools.textEncryptor.enterTextToDecrypt'))
      return
    }

    if (!password.trim()) {
      toast.error(t('tools.textEncryptor.enterThePassword'))
      return
    }

    try {
      const decrypted = simpleDecrypt(input, password)
      setOutput(decrypted)
      toast.success(t('tools.textEncryptor.textDecrypted'))
    } catch (error) {
      toast.error(t('tools.textEncryptor.failedToDecrypt'))
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.textEncryptor.failedToCopy'))
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setPassword('')
    toast.success(t('tools.common.cleared'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.textEncryptor.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.textEncryptor.subtitle')}
          </p>
        </div>

        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <LockKey size={20} />
              {t('tools.textEncryptor.securityNotice')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800" dangerouslySetInnerHTML={{ __html: t('tools.textEncryptor.securityNoticeText') }} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.common.input')}</CardTitle>
              <CardDescription>
                {mode === 'encrypt' ? t('tools.textEncryptor.enterTextToEncrypt') : t('tools.textEncryptor.enterEncryptedText')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encrypt">{t('tools.common.encrypt')}</TabsTrigger>
                  <TabsTrigger value="decrypt">{t('tools.common.decrypt')}</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="password">{t('tools.textEncryptor.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('tools.textEncryptor.enterPasswordPlaceholder')}
                />
              </div>

              <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encrypt' 
                  ? t('tools.textEncryptor.enterTextToEncryptPlaceholder') 
                  : t('tools.textEncryptor.pasteEncryptedTextPlaceholder')
                }
                className="font-mono text-sm min-h-[250px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt} 
                  className="flex-1"
                >
                  {mode === 'encrypt' ? t('tools.textEncryptor.encryptText') : t('tools.textEncryptor.decryptText')}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.common.output')}</CardTitle>
              <CardDescription>
                {mode === 'encrypt' ? t('tools.textEncryptor.encryptedResult') : t('tools.textEncryptor.decryptedResult')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {output ? (
                <>
                  <Textarea
                    value={output}
                    readOnly
                    className="font-mono text-sm min-h-[250px] bg-muted"
                  />

                  <Button onClick={handleCopy} className="w-full">
                    <Copy size={18} className="mr-2" />
                    {t('tools.textEncryptor.copyResult')}
                  </Button>
                </>
              ) : (
                <div className="min-h-[250px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  {t('tools.textEncryptor.resultWillAppear')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('tools.textEncryptor.howItWorks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                {t('tools.textEncryptor.howItWorksIntro')}
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>{t('tools.textEncryptor.howItWorksStep1')}</li>
                <li>{t('tools.textEncryptor.howItWorksStep2')}</li>
                <li>{t('tools.textEncryptor.howItWorksStep3')}</li>
              </ol>
              <p className="text-xs mt-4">
                <strong>{t('tools.textEncryptor.remember')}</strong> {t('tools.textEncryptor.rememberText')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

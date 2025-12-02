import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, LockOpen, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function AESEncryptor() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('aes-encryptor')
  useSEO({ ...metadata, canonicalPath: '/tools/aes-encryptor' })

  const [plaintext, setPlaintext] = useState('')
  const [ciphertext, setCiphertext] = useState('')
  const [encryptKey, setEncryptKey] = useState('')
  const [decryptKey, setDecryptKey] = useState('')
  const [decryptInput, setDecryptInput] = useState('')
  const [decryptedText, setDecryptedText] = useState('')

  async function deriveKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )
    
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('24toolkit-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      toast.error(t('tools.aesEncryptor.enterTextToEncrypt'))
      return
    }
    if (!encryptKey.trim()) {
      toast.error(t('tools.aesEncryptor.enterEncryptionKey'))
      return
    }

    try {
      const key = await deriveKey(encryptKey)
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const encoder = new TextEncoder()
      
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(plaintext)
      )

      const encryptedArray = new Uint8Array(encryptedBuffer)
      const combined = new Uint8Array(iv.length + encryptedArray.length)
      combined.set(iv)
      combined.set(encryptedArray, iv.length)

      const base64 = btoa(String.fromCharCode(...combined))
      setCiphertext(base64)
      toast.success(t('tools.aesEncryptor.encryptedSuccess'))
    } catch (error) {
      toast.error(t('tools.aesEncryptor.encryptionFailed'))
    }
  }

  const handleDecrypt = async () => {
    if (!decryptInput.trim()) {
      toast.error(t('tools.aesEncryptor.enterEncryptedText'))
      return
    }
    if (!decryptKey.trim()) {
      toast.error(t('tools.aesEncryptor.enterDecryptionKey'))
      return
    }

    try {
      const key = await deriveKey(decryptKey)
      const combined = new Uint8Array(
        atob(decryptInput).split('').map(c => c.charCodeAt(0))
      )
      
      const iv = combined.slice(0, 12)
      const encryptedData = combined.slice(12)

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      )

      const decoder = new TextDecoder()
      const decrypted = decoder.decode(decryptedBuffer)
      setDecryptedText(decrypted)
      toast.success(t('tools.aesEncryptor.decryptedSuccess'))
    } catch (error) {
      toast.error(t('tools.aesEncryptor.decryptionFailed'))
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('tools.aesEncryptor.copied'))
    } catch {
      toast.error(t('tools.aesEncryptor.copyFailed'))
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.aesEncryptor.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.aesEncryptor.description')}
          </p>
        </div>

        <Tabs defaultValue="encrypt" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">{t('tools.common.encrypt')}</TabsTrigger>
            <TabsTrigger value="decrypt">{t('tools.common.decrypt')}</TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.common.encrypt')}</CardTitle>
                <CardDescription>
                  {t('tools.aesEncryptor.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plaintext">{t('tools.common.input')}</Label>
                  <Textarea
                    id="plaintext"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder={t('tools.common.enterText')}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encrypt-key">{t('tools.aesEncryptor.secretKey')}</Label>
                  <Input
                    id="encrypt-key"
                    type="password"
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                    placeholder={t('tools.aesEncryptor.secretKey')}
                  />
                </div>

                <Button onClick={handleEncrypt} className="w-full gap-2" size="lg">
                  <Lock size={20} />
                  {t('tools.common.encrypt')}
                </Button>

                {ciphertext && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="ciphertext">{t('tools.aesEncryptor.encryptedText')}</Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="ciphertext"
                        value={ciphertext}
                        readOnly
                        className="min-h-[120px] font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={() => handleCopy(ciphertext)}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Copy size={20} />
                      {t('tools.common.copy')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.common.decrypt')}</CardTitle>
                <CardDescription>
                  {t('tools.aesEncryptor.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decrypt-input">{t('tools.aesEncryptor.encryptedText')}</Label>
                  <Textarea
                    id="decrypt-input"
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value)}
                    placeholder={t('tools.common.paste')}
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrypt-key">{t('tools.aesEncryptor.secretKey')}</Label>
                  <Input
                    id="decrypt-key"
                    type="password"
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    placeholder={t('tools.aesEncryptor.secretKey')}
                  />
                </div>

                <Button onClick={handleDecrypt} className="w-full gap-2" size="lg">
                  <LockOpen size={20} />
                  {t('tools.common.decrypt')}
                </Button>

                {decryptedText && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="decrypted-text">{t('tools.aesEncryptor.decryptedText')}</Label>
                    <Textarea
                      id="decrypted-text"
                      value={decryptedText}
                      readOnly
                      className="min-h-[120px]"
                    />
                    <Button
                      onClick={() => handleCopy(decryptedText)}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Copy size={20} />
                      {t('tools.common.copy')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

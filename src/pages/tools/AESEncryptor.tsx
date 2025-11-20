import { useState } from 'react'
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
  // Set SEO metadata
  const metadata = getPageMetadata('aes-encryptor')
  useSEO(metadata)

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
      toast.error('Please enter text to encrypt')
      return
    }
    if (!encryptKey.trim()) {
      toast.error('Please enter an encryption key')
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
      toast.success('Text encrypted successfully!')
    } catch (error) {
      toast.error('Encryption failed')
    }
  }

  const handleDecrypt = async () => {
    if (!decryptInput.trim()) {
      toast.error('Please enter encrypted text')
      return
    }
    if (!decryptKey.trim()) {
      toast.error('Please enter the decryption key')
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
      toast.success('Text decrypted successfully!')
    } catch (error) {
      toast.error('Decryption failed. Check your key and encrypted text.')
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            AES Text Encryptor / Decryptor
          </h1>
          <p className="text-lg text-muted-foreground">
            Encrypt and decrypt text using AES-256-GCM encryption with password-based key derivation.
          </p>
        </div>

        <Tabs defaultValue="encrypt" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Encrypt Text</CardTitle>
                <CardDescription>
                  Enter your text and a secret key to encrypt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plaintext">Text to Encrypt</Label>
                  <Textarea
                    id="plaintext"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="Enter text to encrypt..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encrypt-key">Encryption Key</Label>
                  <Input
                    id="encrypt-key"
                    type="password"
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                    placeholder="Enter a strong password..."
                  />
                </div>

                <Button onClick={handleEncrypt} className="w-full gap-2" size="lg">
                  <Lock size={20} />
                  Encrypt Text
                </Button>

                {ciphertext && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="ciphertext">Encrypted Text</Label>
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
                      Copy Encrypted Text
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decrypt Text</CardTitle>
                <CardDescription>
                  Enter encrypted text and the secret key to decrypt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decrypt-input">Encrypted Text</Label>
                  <Textarea
                    id="decrypt-input"
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value)}
                    placeholder="Paste encrypted text here..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrypt-key">Decryption Key</Label>
                  <Input
                    id="decrypt-key"
                    type="password"
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    placeholder="Enter the encryption password..."
                  />
                </div>

                <Button onClick={handleDecrypt} className="w-full gap-2" size="lg">
                  <LockOpen size={20} />
                  Decrypt Text
                </Button>

                {decryptedText && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="decrypted-text">Decrypted Text</Label>
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
                      Copy Decrypted Text
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

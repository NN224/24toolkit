import { useState } from 'react'
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
      toast.error('Please enter text to encrypt')
      return
    }

    if (!password.trim()) {
      toast.error('Please enter a password')
      return
    }

    try {
      const encrypted = simpleEncrypt(input, password)
      setOutput(encrypted)
      toast.success('Text encrypted!')
    } catch (error) {
      toast.error('Failed to encrypt text')
    }
  }

  const handleDecrypt = () => {
    if (!input.trim()) {
      toast.error('Please enter text to decrypt')
      return
    }

    if (!password.trim()) {
      toast.error('Please enter the password')
      return
    }

    try {
      const decrypted = simpleDecrypt(input, password)
      setOutput(decrypted)
      toast.success('Text decrypted!')
    } catch (error) {
      toast.error('Failed to decrypt. Wrong password or invalid data.')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setPassword('')
    toast.success('Cleared')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Text Encrypt / Decrypt
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple XOR-based encryption for text (educational purposes)
          </p>
        </div>

        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <LockKey size={20} />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800">
              This is a <strong>simple XOR cipher</strong> for educational purposes only. 
              It should <strong>NOT</strong> be used for securing sensitive data. 
              For real encryption needs, use industry-standard libraries like Web Crypto API or libsodium.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                {mode === 'encrypt' ? 'Enter text to encrypt' : 'Enter encrypted text'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                  <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                />
              </div>

              <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encrypt' 
                  ? 'Enter text to encrypt...' 
                  : 'Paste encrypted text...'
                }
                className="font-mono text-sm min-h-[250px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt} 
                  className="flex-1"
                >
                  {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                {mode === 'encrypt' ? 'Encrypted result' : 'Decrypted result'}
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
                    Copy Result
                  </Button>
                </>
              ) : (
                <div className="min-h-[250px] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                  Result will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                This tool uses a simple XOR cipher with Base64 encoding:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Each character is XORed with the corresponding password character</li>
                <li>The result is encoded in Base64 for safe text transmission</li>
                <li>Decryption reverses this process using the same password</li>
              </ol>
              <p className="text-xs mt-4">
                <strong>Remember:</strong> Use the same password for encryption and decryption!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

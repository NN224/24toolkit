import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Copy, Hash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

export default function HashGenerator() {
  const [text, setText] = useState('')
  const [hashes, setHashes] = useState({
    sha256: '',
    md5: '',
    sha1: ''
  })
  const copyToClipboard = useCopyToClipboard()

  async function sha256Hash(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  async function sha1Hash(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  function md5Hash(str: string): string {
    function rotateLeft(value: number, amount: number): number {
      return (value << amount) | (value >>> (32 - amount))
    }

    function addUnsigned(x: number, y: number): number {
      return (x + y) >>> 0
    }

    function md5cycle(x: number[], k: number[]): void {
      let a = x[0], b = x[1], c = x[2], d = x[3]

      a = ff(a, b, c, d, k[0], 7, 0xd76aa478)
      d = ff(d, a, b, c, k[1], 12, 0xe8c7b756)
      c = ff(c, d, a, b, k[2], 17, 0x242070db)
      b = ff(b, c, d, a, k[3], 22, 0xc1bdceee)
      a = ff(a, b, c, d, k[4], 7, 0xf57c0faf)
      d = ff(d, a, b, c, k[5], 12, 0x4787c62a)
      c = ff(c, d, a, b, k[6], 17, 0xa8304613)
      b = ff(b, c, d, a, k[7], 22, 0xfd469501)
      a = ff(a, b, c, d, k[8], 7, 0x698098d8)
      d = ff(d, a, b, c, k[9], 12, 0x8b44f7af)
      c = ff(c, d, a, b, k[10], 17, 0xffff5bb1)
      b = ff(b, c, d, a, k[11], 22, 0x895cd7be)
      a = ff(a, b, c, d, k[12], 7, 0x6b901122)
      d = ff(d, a, b, c, k[13], 12, 0xfd987193)
      c = ff(c, d, a, b, k[14], 17, 0xa679438e)
      b = ff(b, c, d, a, k[15], 22, 0x49b40821)

      a = gg(a, b, c, d, k[1], 5, 0xf61e2562)
      d = gg(d, a, b, c, k[6], 9, 0xc040b340)
      c = gg(c, d, a, b, k[11], 14, 0x265e5a51)
      b = gg(b, c, d, a, k[0], 20, 0xe9b6c7aa)
      a = gg(a, b, c, d, k[5], 5, 0xd62f105d)
      d = gg(d, a, b, c, k[10], 9, 0x02441453)
      c = gg(c, d, a, b, k[15], 14, 0xd8a1e681)
      b = gg(b, c, d, a, k[4], 20, 0xe7d3fbc8)
      a = gg(a, b, c, d, k[9], 5, 0x21e1cde6)
      d = gg(d, a, b, c, k[14], 9, 0xc33707d6)
      c = gg(c, d, a, b, k[3], 14, 0xf4d50d87)
      b = gg(b, c, d, a, k[8], 20, 0x455a14ed)
      a = gg(a, b, c, d, k[13], 5, 0xa9e3e905)
      d = gg(d, a, b, c, k[2], 9, 0xfcefa3f8)
      c = gg(c, d, a, b, k[7], 14, 0x676f02d9)
      b = gg(b, c, d, a, k[12], 20, 0x8d2a4c8a)

      a = hh(a, b, c, d, k[5], 4, 0xfffa3942)
      d = hh(d, a, b, c, k[8], 11, 0x8771f681)
      c = hh(c, d, a, b, k[11], 16, 0x6d9d6122)
      b = hh(b, c, d, a, k[14], 23, 0xfde5380c)
      a = hh(a, b, c, d, k[1], 4, 0xa4beea44)
      d = hh(d, a, b, c, k[4], 11, 0x4bdecfa9)
      c = hh(c, d, a, b, k[7], 16, 0xf6bb4b60)
      b = hh(b, c, d, a, k[10], 23, 0xbebfbc70)
      a = hh(a, b, c, d, k[13], 4, 0x289b7ec6)
      d = hh(d, a, b, c, k[0], 11, 0xeaa127fa)
      c = hh(c, d, a, b, k[3], 16, 0xd4ef3085)
      b = hh(b, c, d, a, k[6], 23, 0x04881d05)
      a = hh(a, b, c, d, k[9], 4, 0xd9d4d039)
      d = hh(d, a, b, c, k[12], 11, 0xe6db99e5)
      c = hh(c, d, a, b, k[15], 16, 0x1fa27cf8)
      b = hh(b, c, d, a, k[2], 23, 0xc4ac5665)

      a = ii(a, b, c, d, k[0], 6, 0xf4292244)
      d = ii(d, a, b, c, k[7], 10, 0x432aff97)
      c = ii(c, d, a, b, k[14], 15, 0xab9423a7)
      b = ii(b, c, d, a, k[5], 21, 0xfc93a039)
      a = ii(a, b, c, d, k[12], 6, 0x655b59c3)
      d = ii(d, a, b, c, k[3], 10, 0x8f0ccc92)
      c = ii(c, d, a, b, k[10], 15, 0xffeff47d)
      b = ii(b, c, d, a, k[1], 21, 0x85845dd1)
      a = ii(a, b, c, d, k[8], 6, 0x6fa87e4f)
      d = ii(d, a, b, c, k[15], 10, 0xfe2ce6e0)
      c = ii(c, d, a, b, k[6], 15, 0xa3014314)
      b = ii(b, c, d, a, k[13], 21, 0x4e0811a1)
      a = ii(a, b, c, d, k[4], 6, 0xf7537e82)
      d = ii(d, a, b, c, k[11], 10, 0xbd3af235)
      c = ii(c, d, a, b, k[2], 15, 0x2ad7d2bb)
      b = ii(b, c, d, a, k[9], 21, 0xeb86d391)

      x[0] = addUnsigned(a, x[0])
      x[1] = addUnsigned(b, x[1])
      x[2] = addUnsigned(c, x[2])
      x[3] = addUnsigned(d, x[3])

      function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
        a = addUnsigned(addUnsigned(a, q), addUnsigned(x, t))
        return addUnsigned(rotateLeft(a, s), b)
      }

      function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return cmn((b & c) | (~b & d), a, b, x, s, t)
      }

      function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return cmn((b & d) | (c & ~d), a, b, x, s, t)
      }

      function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return cmn(b ^ c ^ d, a, b, x, s, t)
      }

      function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return cmn(c ^ (b | ~d), a, b, x, s, t)
      }
    }

    const n = str.length
    const state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    
    for (let i = 0; i < n; i += 64) {
      const block = new Array(16)
      for (let j = 0; j < 16; j++) {
        block[j] = 
          (str.charCodeAt(i + j * 4) || 0) +
          ((str.charCodeAt(i + j * 4 + 1) || 0) << 8) +
          ((str.charCodeAt(i + j * 4 + 2) || 0) << 16) +
          ((str.charCodeAt(i + j * 4 + 3) || 0) << 24)
      }
      md5cycle(state, block)
    }

    const end = n % 64
    const bytes = new Uint8Array(64)
    for (let i = 0; i < end; i++) {
      bytes[i] = str.charCodeAt(n - end + i)
    }
    bytes[end] = 0x80
    
    if (end >= 56) {
      for (let i = 0; i < 16; i++) {
        tail[i] = bytes[i * 4] + (bytes[i * 4 + 1] << 8) + (bytes[i * 4 + 2] << 16) + (bytes[i * 4 + 3] << 24)
      }
      md5cycle(state, tail)
      for (let i = 0; i < 16; i++) tail[i] = 0
    } else {
      for (let i = 0; i < 16; i++) {
        tail[i] = bytes[i * 4] + (bytes[i * 4 + 1] << 8) + (bytes[i * 4 + 2] << 16) + (bytes[i * 4 + 3] << 24)
      }
    }
    
    tail[14] = (n * 8) >>> 0
    tail[15] = (n * 8) / 0x100000000
    md5cycle(state, tail)

    return state.map(x => x.toString(16).padStart(8, '0')).join('')
  }

  const generateHashes = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to hash')
      return
    }

    const sha256Result = await sha256Hash(text)
    const sha1Result = await sha1Hash(text)
    const md5Result = md5Hash(text)

    setHashes({
      sha256: sha256Result,
      md5: md5Result,
      sha1: sha1Result
    })

    toast.success('Hashes generated successfully!')
  }



  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            SHA256 / MD5 Hash Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate secure cryptographic hashes (SHA-256, SHA-1, MD5) from any text input.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Enter the text you want to hash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text</Label>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to generate hashes..."
                  className="min-h-[120px] font-mono"
                />
              </div>

              <Button onClick={generateHashes} className="w-full gap-2" size="lg">
                <Hash size={20} />
                Generate Hashes
              </Button>
            </CardContent>
          </Card>

          {(hashes.sha256 || hashes.md5 || hashes.sha1) && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Hashes</CardTitle>
                <CardDescription>
                  Your cryptographic hash results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sha256-output">SHA-256</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sha256-output"
                      value={hashes.sha256}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(hashes.sha256, 'SHA-256 hash copied to clipboard!')}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Copy size={20} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sha1-output">SHA-1</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sha1-output"
                      value={hashes.sha1}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(hashes.sha1, 'SHA-1 hash copied to clipboard!')}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Copy size={20} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="md5-output">MD5</Label>
                  <div className="flex gap-2">
                    <Input
                      id="md5-output"
                      value={hashes.md5}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(hashes.md5, 'MD5 hash copied to clipboard!')}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Copy size={20} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

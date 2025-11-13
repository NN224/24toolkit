import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Copy, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function RandomStringGenerator() {
  const [result, setResult] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    hex: false,
    base64: false
  })

  const generateString = () => {
    if (options.hex) {
      const array = new Uint8Array(length / 2)
      window.crypto.getRandomValues(array)
      const hexString = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      setResult(hexString)
      toast.success('Hex string generated!')
      return
    }

    if (options.base64) {
      const array = new Uint8Array(length)
      window.crypto.getRandomValues(array)
      const base64String = btoa(String.fromCharCode(...array))
        .substring(0, length)
      setResult(base64String)
      toast.success('Base64 string generated!')
      return
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let charset = ''
    if (options.uppercase) charset += uppercase
    if (options.lowercase) charset += lowercase
    if (options.numbers) charset += numbers
    if (options.symbols) charset += symbols

    if (charset === '') {
      toast.error('Please select at least one character type')
      return
    }

    let randomString = ''
    const array = new Uint32Array(length)
    window.crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      randomString += charset[array[i] % charset.length]
    }

    setResult(randomString)
    toast.success('Random string generated!')
  }

  const handleCopy = async () => {
    if (!result) return
    
    try {
      await navigator.clipboard.writeText(result)
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
            Random String Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate cryptographically secure random strings for tokens, keys, and identifiers.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated String</CardTitle>
              <CardDescription>
                Your cryptographically random string
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="string-output"
                  value={result}
                  readOnly
                  placeholder="Click 'Generate String' to create"
                  className="font-mono text-lg"
                />
                <Button
                  onClick={handleCopy}
                  disabled={!result}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Copy size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Customize your random string
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="length-slider">String Length</Label>
                    <span className="text-sm font-medium text-muted-foreground">
                      {length} characters
                    </span>
                  </div>
                  <Slider
                    id="length-slider"
                    min={8}
                    max={128}
                    step={1}
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hex" className="cursor-pointer">
                      Hexadecimal Only (0-9, a-f)
                    </Label>
                    <Switch
                      id="hex"
                      checked={options.hex}
                      onCheckedChange={(checked) => 
                        setOptions({ 
                          uppercase: false,
                          lowercase: false,
                          numbers: false,
                          symbols: false,
                          hex: checked,
                          base64: false
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="base64" className="cursor-pointer">
                      Base64 Encoding
                    </Label>
                    <Switch
                      id="base64"
                      checked={options.base64}
                      onCheckedChange={(checked) => 
                        setOptions({ 
                          uppercase: false,
                          lowercase: false,
                          numbers: false,
                          symbols: false,
                          hex: false,
                          base64: checked
                        })
                      }
                    />
                  </div>

                  {!options.hex && !options.base64 && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="uppercase" className="cursor-pointer">
                          Uppercase Letters (A-Z)
                        </Label>
                        <Switch
                          id="uppercase"
                          checked={options.uppercase}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, uppercase: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="lowercase" className="cursor-pointer">
                          Lowercase Letters (a-z)
                        </Label>
                        <Switch
                          id="lowercase"
                          checked={options.lowercase}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, lowercase: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="numbers" className="cursor-pointer">
                          Numbers (0-9)
                        </Label>
                        <Switch
                          id="numbers"
                          checked={options.numbers}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, numbers: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="symbols" className="cursor-pointer">
                          Symbols (!@#$%^&*)
                        </Label>
                        <Switch
                          id="symbols"
                          checked={options.symbols}
                          onCheckedChange={(checked) => 
                            setOptions({ ...options, symbols: checked })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button onClick={generateString} className="w-full gap-2" size="lg">
                <Sparkle size={20} />
                Generate Random String
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

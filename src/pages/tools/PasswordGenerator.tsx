import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Copy, Shuffle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  })
  const copyToClipboard = useCopyToClipboard()

  const generatePassword = () => {
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

    let newPassword = ''
    const cryptoObj = window.crypto || (window as any).msCrypto
    const array = new Uint32Array(length)
    cryptoObj.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length]
    }

    setPassword(newPassword)
    toast.success('Password generated!')
  }

  const calculateStrength = () => {
    if (!password) return { label: 'None', color: 'secondary' }
    
    let score = 0
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { label: 'Weak', color: 'destructive' }
    if (score <= 4) return { label: 'Medium', color: 'default' }
    return { label: 'Strong', color: 'default' }
  }



  const strength = calculateStrength()

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Password Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate secure, random passwords with customizable options and strength analysis.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Password</CardTitle>
              <CardDescription>
                Your secure password will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="password-output"
                  value={password}
                  readOnly
                  placeholder="Click 'Generate Password' to create a password"
                  className="font-mono text-lg"
                />
                <Button
                  onClick={() => password && copyToClipboard(password, 'Password copied to clipboard!')}
                  disabled={!password}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label="Copy password"
                >
                  <Copy size={20} />
                </Button>
              </div>

              {password && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Strength:</span>
                  <Badge 
                    variant={strength.color as any}
                    className={
                      strength.label === 'Strong' ? 'bg-green-500 hover:bg-green-600' :
                      strength.label === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      ''
                    }
                  >
                    {strength.label}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Options</CardTitle>
              <CardDescription>
                Customize your password requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="length-slider">Password Length</Label>
                    <span className="text-sm font-medium text-muted-foreground">
                      {length} characters
                    </span>
                  </div>
                  <Slider
                    id="length-slider"
                    min={8}
                    max={64}
                    step={1}
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3 pt-2">
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
                </div>
              </div>

              <Button 
                onClick={generatePassword} 
                className="w-full gap-2"
                size="lg"
              >
                <Shuffle size={20} />
                Generate Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

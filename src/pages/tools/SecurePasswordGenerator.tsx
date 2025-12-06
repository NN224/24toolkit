import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Copy, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function SecurePasswordGenerator() {
  const { t } = useTranslation()
  // Set SEO metadata
  const metadata = getPageMetadata('secure-password-generator')
  useSEO({ ...metadata, canonicalPath: '/tools/secure-password-generator' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.securePasswordGenerator.name')
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(20)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    ambiguous: false,
    pronounceable: false
  })

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    const lowercase = 'abcdefghjkmnpqrstuvwxyz'
    const numbers = '23456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const ambiguousChars = 'il1Lo0O'

    let charset = ''
    if (options.uppercase) charset += uppercase
    if (options.lowercase) charset += lowercase
    if (options.numbers) charset += numbers
    if (options.symbols) charset += symbols
    if (options.ambiguous) {
      charset += ambiguousChars
    }

    if (charset === '') {
      toast.error(t('tools.securePasswordGenerator.selectCharTypeError'))
      return
    }

    let newPassword = ''
    const cryptoObj = window.crypto
    const array = new Uint32Array(length)
    cryptoObj.getRandomValues(array)

    if (options.pronounceable) {
      const vowels = 'aeiou'
      const consonants = 'bcdfghjklmnpqrstvwxyz'
      
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          newPassword += consonants[array[i] % consonants.length]
        } else {
          newPassword += vowels[array[i] % vowels.length]
        }
      }

      if (options.uppercase) {
        newPassword = newPassword.charAt(0).toUpperCase() + newPassword.slice(1)
      }
      if (options.numbers) {
        newPassword += numbers[array[0] % numbers.length]
      }
      if (options.symbols) {
        newPassword += symbols[array[1] % symbols.length]
      }
    } else {
      for (let i = 0; i < length; i++) {
        newPassword += charset[array[i] % charset.length]
      }
    }

    setPassword(newPassword)
    toast.success(t('tools.securePasswordGenerator.passwordGenerated'))
  }

  const calculateEntropy = () => {
    if (!password) return 0
    
    let charsetSize = 0
    if (/[a-z]/.test(password)) charsetSize += 26
    if (/[A-Z]/.test(password)) charsetSize += 26
    if (/[0-9]/.test(password)) charsetSize += 10
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32

    return Math.floor(password.length * Math.log2(charsetSize))
  }

  const handleCopy = async () => {
    if (!password) return
    
    try {
      await navigator.clipboard.writeText(password)
      toast.success(t('tools.securePasswordGenerator.passwordCopied'))
    } catch {
      toast.error(t('tools.securePasswordGenerator.copyFailed'))
    }
  }

  const entropy = calculateEntropy()

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
              <CardTitle>{t('tools.securePasswordGenerator.generatedPassword')}</CardTitle>
              <CardDescription>
                {t('tools.securePasswordGenerator.yourSecurePassword')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="password-output"
                  value={password}
                  readOnly
                  placeholder={t('tools.securePasswordGenerator.clickGenerate')}
                  className="font-mono text-lg"
                />
                <Button
                  onClick={handleCopy}
                  disabled={!password}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Copy size={20} />
                </Button>
              </div>

              {password && (
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">{t('tools.securePasswordGenerator.entropy')} </span>
                    <Badge variant="default" className="bg-purple-500">
                      {entropy} {t('tools.securePasswordGenerator.bits')}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{t('tools.securePasswordGenerator.strength')} </span>
                    <Badge 
                      className={
                        entropy >= 80 ? 'bg-green-500' :
                        entropy >= 60 ? 'bg-blue-500' :
                        entropy >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }
                    >
                      {entropy >= 80 ? t('tools.securePasswordGenerator.veryStrong') :
                       entropy >= 60 ? t('tools.securePasswordGenerator.strong') :
                       entropy >= 40 ? t('tools.securePasswordGenerator.good') : t('tools.securePasswordGenerator.fair')}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.securePasswordGenerator.advancedOptions')}</CardTitle>
              <CardDescription>
                {t('tools.securePasswordGenerator.customizeRequirements')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="length-slider">{t('tools.securePasswordGenerator.passwordLength')}</Label>
                    <span className="text-sm font-medium text-muted-foreground">
                      {length} {t('tools.securePasswordGenerator.characters')}
                    </span>
                  </div>
                  <Slider
                    id="length-slider"
                    min={12}
                    max={64}
                    step={1}
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase" className="cursor-pointer">
                      {t('tools.securePasswordGenerator.uppercase')}
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
                      {t('tools.securePasswordGenerator.lowercase')}
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
                      {t('tools.securePasswordGenerator.numbers')}
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
                      {t('tools.securePasswordGenerator.symbols')}
                    </Label>
                    <Switch
                      id="symbols"
                      checked={options.symbols}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, symbols: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="ambiguous" className="cursor-pointer">
                      {t('tools.securePasswordGenerator.ambiguous')}
                    </Label>
                    <Switch
                      id="ambiguous"
                      checked={options.ambiguous}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, ambiguous: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pronounceable" className="cursor-pointer">
                      {t('tools.securePasswordGenerator.pronounceable')}
                    </Label>
                    <Switch
                      id="pronounceable"
                      checked={options.pronounceable}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, pronounceable: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full gap-2" size="lg">
                <Sparkle size={20} />
                {t('tools.securePasswordGenerator.generateSecure')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="secure-password-generator" category="security" />
    </div>
  )
}

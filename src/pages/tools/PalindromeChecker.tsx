import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function PalindromeChecker() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('palindrome-checker')
  useSEO({ ...metadata, canonicalPath: '/tools/palindrome-checker' })

  const [text, setText] = useState('')
  const [checked, setChecked] = useState(false)
  const [isPalindrome, setIsPalindrome] = useState(false)

  const checkPalindrome = () => {
    if (!text.trim()) {
      toast.error(t('tools.palindromeChecker.enterTextError'))
      return
    }

    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    const reversed = cleanText.split('').reverse().join('')
    const result = cleanText === reversed

    setIsPalindrome(result)
    setChecked(true)
    
    if (result) {
      toast.success(t('tools.palindromeChecker.isPalindrome'))
    } else {
      toast.error(t('tools.palindromeChecker.notPalindrome'))
    }
  }

  const handleClear = () => {
    setText('')
    setChecked(false)
    setIsPalindrome(false)
    toast.success(t('tools.common.cleared'))
  }

  const examples = [
    'A man a plan a canal Panama',
    'racecar',
    'Was it a car or a cat I saw?',
    'Madam',
    'Never odd or even',
    '12321'
  ]

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.palindromeChecker.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.palindromeChecker.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.palindromeChecker.enterYourText')}</CardTitle>
              <CardDescription>
                {t('tools.palindromeChecker.enterDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">{t('tools.palindromeChecker.textToCheck')}</Label>
                <Input
                  id="text-input"
                  placeholder={t('tools.palindromeChecker.placeholder')}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    setChecked(false)
                  }}
                  className="text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkPalindrome()
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={checkPalindrome}
                  disabled={!text}
                  variant="default"
                >
                  {t('tools.palindromeChecker.checkButton')}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  {t('tools.common.clear')}
                </Button>
              </div>

              {checked && (
                <div className={`p-6 rounded-lg border-2 ${isPalindrome ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                  <div className="flex items-center gap-3">
                    {isPalindrome ? (
                      <>
                        <CheckCircle size={32} weight="fill" className="text-green-600" />
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{t('tools.palindromeChecker.yesResult')}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('tools.palindromeChecker.yesDescription')}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle size={32} weight="fill" className="text-red-600" />
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{t('tools.palindromeChecker.noResult')}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('tools.palindromeChecker.noDescription')}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.palindromeChecker.tryExamples')}</CardTitle>
              <CardDescription>
                {t('tools.palindromeChecker.clickExample')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setText(example)
                      setChecked(false)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>{t('tools.palindromeChecker.whatIsPalindrome')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                {t('tools.palindromeChecker.palindromeExplanation')}
              </p>
              <p className="font-medium text-foreground">
                {t('tools.palindromeChecker.examplesText')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="palindrome-checker" category="text" />
    </div>
  )
}

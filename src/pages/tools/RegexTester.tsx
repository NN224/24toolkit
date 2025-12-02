import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Trash, CheckCircle, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function RegexTester() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('regex-tester')
  useSEO({ ...metadata, canonicalPath: '/tools/regex-tester' })

  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')

  const testRegex = () => {
    if (!pattern) {
      toast.error(t('tools.regexTester.enterPatternError'))
      return
    }

    if (!testString) {
      toast.error(t('tools.regexTester.enterTestStringError'))
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const found = testString.match(regex)
      
      setMatches(found || [])
      setIsValid(true)
      setError('')
      
      if (found && found.length > 0) {
        toast.success(`${t('tools.regexTester.matches')}: ${found.length}`)
      } else {
        toast.info(t('tools.regexTester.noMatches'))
      }
    } catch (err) {
      setIsValid(false)
      setError((err as Error).message)
      setMatches([])
      toast.error(t('tools.regexTester.invalidPattern'))
    }
  }

  const handleClear = () => {
    setPattern('')
    setTestString('')
    setMatches([])
    setIsValid(true)
    setError('')
    toast.success(t('tools.regexTester.cleared'))
  }

  const highlightMatches = () => {
    if (!pattern || !testString || matches.length === 0) {
      return testString
    }

    try {
      const regex = new RegExp(pattern, flags)
      const parts = testString.split(regex)
      const highlighted: React.ReactNode[] = []

      let matchIndex = 0
      parts.forEach((part, index) => {
        highlighted.push(<span key={`text-${index}`}>{part}</span>)
        if (matchIndex < matches.length) {
          highlighted.push(
            <span key={`match-${index}`} className="bg-yellow-300 text-yellow-900 font-semibold">
              {matches[matchIndex]}
            </span>
          )
          matchIndex++
        }
      })

      return highlighted
    } catch {
      return testString
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.regexTester.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.regexTester.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.regexTester.pattern')}</CardTitle>
              <CardDescription>{t('tools.regexTester.enterPattern')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regex-pattern">{t('tools.regexTester.pattern')}</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="regex-pattern"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder={t('tools.regexTester.patternExample')}
                      className="font-mono"
                    />
                    {pattern && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValid ? (
                          <CheckCircle size={20} className="text-green-500" weight="fill" />
                        ) : (
                          <XCircle size={20} className="text-red-500" weight="fill" />
                        )}
                      </div>
                    )}
                  </div>
                  <Input
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder={t('tools.regexTester.flags')}
                    className="w-24 font-mono"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('tools.regexTester.flagsHint')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.regexTester.testString')}</CardTitle>
              <CardDescription>{t('tools.regexTester.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="test-string"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder={t('tools.regexTester.enterTestText')}
                className="min-h-[150px] font-mono"
              />

              <div className="flex gap-2">
                <Button onClick={testRegex} className="flex-1">
                  {t('tools.regexTester.testRegex')}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <Trash size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {(matches.length > 0 || testString) && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.common.result')}</CardTitle>
                <CardDescription>
                  {matches.length > 0 
                    ? `${t('tools.regexTester.matches')}: ${matches.length}`
                    : t('tools.regexTester.noMatches')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-words">
                  {highlightMatches()}
                </div>

                {matches.length > 0 && (
                  <div className="space-y-2">
                    <Label>{t('tools.regexTester.matches')}:</Label>
                    <div className="space-y-1">
                      {matches.map((match, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-accent rounded">
                          <span className="text-sm font-mono flex-1">{match}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await navigator.clipboard.writeText(match)
                              toast.success(t('tools.regexTester.matchCopied'))
                            }}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

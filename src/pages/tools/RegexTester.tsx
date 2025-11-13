import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Trash, CheckCircle, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')

  const testRegex = () => {
    if (!pattern) {
      toast.error('Please enter a regex pattern')
      return
    }

    if (!testString) {
      toast.error('Please enter a test string')
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const found = testString.match(regex)
      
      setMatches(found || [])
      setIsValid(true)
      setError('')
      
      if (found && found.length > 0) {
        toast.success(`Found ${found.length} match${found.length > 1 ? 'es' : ''}`)
      } else {
        toast.info('No matches found')
      }
    } catch (err) {
      setIsValid(false)
      setError((err as Error).message)
      setMatches([])
      toast.error('Invalid regex pattern')
    }
  }

  const handleClear = () => {
    setPattern('')
    setTestString('')
    setMatches([])
    setIsValid(true)
    setError('')
    toast.success('Cleared')
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
            Regex Tester
          </h1>
          <p className="text-lg text-muted-foreground">
            Test and debug regular expressions with live pattern matching
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regex Pattern</CardTitle>
              <CardDescription>Enter your regular expression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regex-pattern">Pattern</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="regex-pattern"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="e.g., \d{3}-\d{3}-\d{4}"
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
                    placeholder="Flags"
                    className="w-24 font-mono"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Common flags: g (global), i (case-insensitive), m (multiline)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test String</CardTitle>
              <CardDescription>Enter text to test against your regex</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="test-string"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test..."
                className="min-h-[150px] font-mono"
              />

              <div className="flex gap-2">
                <Button onClick={testRegex} className="flex-1">
                  Test Regex
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
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  {matches.length > 0 
                    ? `Found ${matches.length} match${matches.length > 1 ? 'es' : ''}`
                    : 'No matches found'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-words">
                  {highlightMatches()}
                </div>

                {matches.length > 0 && (
                  <div className="space-y-2">
                    <Label>Matches:</Label>
                    <div className="space-y-1">
                      {matches.map((match, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-accent rounded">
                          <span className="text-sm font-mono flex-1">{match}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await navigator.clipboard.writeText(match)
                              toast.success('Match copied!')
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

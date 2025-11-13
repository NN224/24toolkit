import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function PalindromeChecker() {
  const [text, setText] = useState('')
  const [checked, setChecked] = useState(false)
  const [isPalindrome, setIsPalindrome] = useState(false)

  const checkPalindrome = () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    const reversed = cleanText.split('').reverse().join('')
    const result = cleanText === reversed

    setIsPalindrome(result)
    setChecked(true)
    
    if (result) {
      toast.success('It\'s a palindrome!')
    } else {
      toast.error('Not a palindrome')
    }
  }

  const handleClear = () => {
    setText('')
    setChecked(false)
    setIsPalindrome(false)
    toast.success('Text cleared')
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
            Palindrome Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Check if a string is a palindrome (reads the same forwards and backwards).
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Type or paste text to check if it's a palindrome
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text to Check</Label>
                <Input
                  id="text-input"
                  placeholder="Enter text to check..."
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
                  Check Palindrome
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash size={16} />
                  Clear
                </Button>
              </div>

              {checked && (
                <div className={`p-6 rounded-lg border-2 ${isPalindrome ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                  <div className="flex items-center gap-3">
                    {isPalindrome ? (
                      <>
                        <CheckCircle size={32} weight="fill" className="text-green-600" />
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">Yes, it's a palindrome! ✓</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            This text reads the same forwards and backwards
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle size={32} weight="fill" className="text-red-600" />
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">Not a palindrome ✗</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            This text does not read the same forwards and backwards
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
              <CardTitle>Try These Examples</CardTitle>
              <CardDescription>
                Click any example to test it
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
              <CardTitle>What is a Palindrome?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward (ignoring spaces, punctuation, and capitalization).
              </p>
              <p className="font-medium text-foreground">
                Examples: "radar", "level", "A Santa at NASA", "12321"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

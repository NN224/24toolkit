import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldCheck, ShieldWarning, ShieldSlash, CheckCircle, XCircle } from '@phosphor-icons/react'

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('')

  const analyzePassword = (pwd: string) => {
    let score = 0
    const feedback: string[] = []
    const checks = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[^a-zA-Z0-9]/.test(pwd),
      noCommon: !['password', '123456', 'qwerty', 'abc123', 'letmein'].some(common => 
        pwd.toLowerCase().includes(common)
      ),
      noSequential: !/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(pwd),
      noRepeated: !/(.)\1{2,}/.test(pwd)
    }

    if (checks.length) score += 25
    else feedback.push('Use at least 12 characters')

    if (checks.uppercase) score += 10
    else feedback.push('Add uppercase letters (A-Z)')

    if (checks.lowercase) score += 10
    else feedback.push('Add lowercase letters (a-z)')

    if (checks.numbers) score += 10
    else feedback.push('Include numbers (0-9)')

    if (checks.symbols) score += 15
    else feedback.push('Include special characters (!@#$%)')

    if (checks.noCommon) score += 15
    else feedback.push('Avoid common passwords')

    if (checks.noSequential) score += 10
    else feedback.push('Avoid sequential patterns (123, abc)')

    if (checks.noRepeated) score += 5
    else feedback.push('Avoid repeated characters (aaa, 111)')

    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    let icon = ShieldSlash
    let color = 'text-red-500'
    let bgColor = 'bg-red-500'
    let label = 'Weak'

    if (score >= 80) {
      strength = 'strong'
      icon = ShieldCheck
      color = 'text-green-500'
      bgColor = 'bg-green-500'
      label = 'Strong'
    } else if (score >= 60) {
      strength = 'good'
      icon = ShieldCheck
      color = 'text-blue-500'
      bgColor = 'bg-blue-500'
      label = 'Good'
    } else if (score >= 40) {
      strength = 'fair'
      icon = ShieldWarning
      color = 'text-yellow-500'
      bgColor = 'bg-yellow-500'
      label = 'Fair'
    }

    return { score, strength, feedback, checks, icon, color, bgColor, label }
  }

  const analysis = password ? analyzePassword(password) : null

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Password Strength Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Test password strength and get recommendations for creating secure passwords.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Password</CardTitle>
              <CardDescription>
                Type or paste a password to analyze its strength
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-input">Password</Label>
                <Input
                  id="password-input"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to check..."
                  className="font-mono text-lg"
                />
              </div>

              {analysis && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <analysis.icon size={32} className={analysis.color} />
                      <div>
                        <p className="font-semibold text-lg">{analysis.label} Password</p>
                        <p className="text-sm text-muted-foreground">
                          Strength Score: {analysis.score}/100
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={`${analysis.bgColor} text-white`}
                      variant="default"
                    >
                      {analysis.score}%
                    </Badge>
                  </div>

                  <Progress value={analysis.score} className="h-3" />
                </div>
              )}
            </CardContent>
          </Card>

          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Security Checks</CardTitle>
                  <CardDescription>
                    Password requirements and validation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {analysis.checks.length ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.length ? 'text-foreground' : 'text-muted-foreground'}>
                      At least 12 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.uppercase ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.uppercase ? 'text-foreground' : 'text-muted-foreground'}>
                      Contains uppercase letters (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.lowercase ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.lowercase ? 'text-foreground' : 'text-muted-foreground'}>
                      Contains lowercase letters (a-z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.numbers ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.numbers ? 'text-foreground' : 'text-muted-foreground'}>
                      Contains numbers (0-9)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.symbols ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.symbols ? 'text-foreground' : 'text-muted-foreground'}>
                      Contains special characters (!@#$%)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.noCommon ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.noCommon ? 'text-foreground' : 'text-muted-foreground'}>
                      Not a common password
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.noSequential ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.noSequential ? 'text-foreground' : 'text-muted-foreground'}>
                      No sequential patterns
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {analysis.checks.noRepeated ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={analysis.checks.noRepeated ? 'text-foreground' : 'text-muted-foreground'}>
                      No repeated characters
                    </span>
                  </div>
                </CardContent>
              </Card>

              {analysis.feedback.length > 0 && (
                <Alert variant={analysis.strength === 'weak' ? 'destructive' : 'default'}>
                  <ShieldWarning size={20} />
                  <AlertDescription>
                    <p className="font-semibold mb-2">Suggestions to improve:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.feedback.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

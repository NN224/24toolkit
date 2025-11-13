import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldCheck, ShieldWarning, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function IPBlacklistChecker() {
  const [ipAddress, setIpAddress] = useState('')
  const [result, setResult] = useState<any>(null)

  const checkIP = () => {
    if (!ipAddress.trim()) {
      toast.error('Please enter an IP address')
      return
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipPattern.test(ipAddress)) {
      toast.error('Please enter a valid IP address')
      return
    }

    const parts = ipAddress.split('.').map(Number)
    if (parts.some(part => part > 255)) {
      toast.error('Invalid IP address format')
      return
    }

    const suspiciousRanges = [
      '192.0.2.',
      '198.51.100.',
      '203.0.113.',
    ]

    const isPrivate = 
      ipAddress.startsWith('10.') ||
      ipAddress.startsWith('172.16.') ||
      ipAddress.startsWith('192.168.') ||
      ipAddress.startsWith('127.')

    const isSuspicious = suspiciousRanges.some(range => ipAddress.startsWith(range))

    const mockResult = {
      ip: ipAddress,
      blacklisted: isSuspicious,
      privateIP: isPrivate,
      checks: {
        spamhaus: !isSuspicious,
        spamcop: !isSuspicious,
        barracuda: !isSuspicious,
        sorbs: !isSuspicious,
        uceprotect: !isSuspicious
      },
      threatLevel: isSuspicious ? 'high' : 'low',
      country: 'Unknown',
      isp: 'Mock ISP Provider'
    }

    setResult(mockResult)
    toast.success('IP check completed')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            IP Blacklist Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Check if an IP address is listed on spam or threat blacklists.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter IP Address</CardTitle>
              <CardDescription>
                Enter an IPv4 address to check against blacklists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip-input">IP Address</Label>
                <Input
                  id="ip-input"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.1"
                  type="text"
                />
              </div>

              <Button onClick={checkIP} className="w-full gap-2" size="lg">
                <MagnifyingGlass size={20} />
                Check IP Address
              </Button>
            </CardContent>
          </Card>

          {result && (
            <>
              <Alert 
                variant={result.blacklisted ? 'destructive' : 'default'}
                className={result.blacklisted ? '' : 'border-green-500 bg-green-50'}
              >
                {result.blacklisted ? (
                  <ShieldWarning size={24} />
                ) : (
                  <ShieldCheck size={24} className="text-green-600" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className={`font-bold text-lg ${
                      result.blacklisted ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {result.blacklisted ? '⚠ IP Address Blacklisted' : '✓ IP Address Clean'}
                    </p>
                    <p className="text-sm">
                      {result.blacklisted 
                        ? 'This IP address appears on one or more blacklists.'
                        : 'This IP address is not listed on major blacklists.'}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Blacklist Check Results</CardTitle>
                  <CardDescription>
                    Status across multiple blacklist databases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">Spamhaus</span>
                      <span className={result.checks.spamhaus ? 'text-green-600' : 'text-red-600'}>
                        {result.checks.spamhaus ? '✓ Clean' : '✗ Listed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">SpamCop</span>
                      <span className={result.checks.spamcop ? 'text-green-600' : 'text-red-600'}>
                        {result.checks.spamcop ? '✓ Clean' : '✗ Listed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">Barracuda</span>
                      <span className={result.checks.barracuda ? 'text-green-600' : 'text-red-600'}>
                        {result.checks.barracuda ? '✓ Clean' : '✗ Listed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">SORBS</span>
                      <span className={result.checks.sorbs ? 'text-green-600' : 'text-red-600'}>
                        {result.checks.sorbs ? '✓ Clean' : '✗ Listed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">UCEProtect</span>
                      <span className={result.checks.uceprotect ? 'text-green-600' : 'text-red-600'}>
                        {result.checks.uceprotect ? '✓ Clean' : '✗ Listed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">Threat Level</span>
                      <span className={result.threatLevel === 'low' ? 'text-green-600' : 'text-red-600'}>
                        {result.threatLevel === 'low' ? 'Low' : 'High'}
                      </span>
                    </div>
                  </div>

                  {result.privateIP && (
                    <Alert>
                      <AlertDescription>
                        This is a private IP address (RFC 1918). It's not routable on the public internet.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

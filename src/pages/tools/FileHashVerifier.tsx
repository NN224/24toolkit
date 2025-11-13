import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, CheckCircle, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function FileHashVerifier() {
  const [file, setFile] = useState<File | null>(null)
  const [calculatedHash, setCalculatedHash] = useState('')
  const [expectedHash, setExpectedHash] = useState('')
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-1' | 'MD5'>('SHA-256')
  const [isProcessing, setIsProcessing] = useState(false)

  const calculateFileHash = async (file: File, algo: string): Promise<string> => {
    const buffer = await file.arrayBuffer()
    
    if (algo === 'SHA-256') {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } else if (algo === 'SHA-1') {
      const hashBuffer = await crypto.subtle.digest('SHA-1', buffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
    
    return ''
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setCalculatedHash('')
    setIsProcessing(true)

    try {
      const hash = await calculateFileHash(selectedFile, algorithm)
      setCalculatedHash(hash)
      toast.success('File hash calculated successfully!')
    } catch (error) {
      toast.error('Failed to calculate file hash')
    } finally {
      setIsProcessing(false)
    }
  }

  const hashesMatch = calculatedHash && expectedHash && 
    calculatedHash.toLowerCase() === expectedHash.toLowerCase().trim()
  const hasComparison = calculatedHash && expectedHash.trim()

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            File Hash Verifier
          </h1>
          <p className="text-lg text-muted-foreground">
            Verify file integrity by calculating and comparing cryptographic hashes.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Select a file to calculate its hash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-input">Select File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />
                  {file && (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Hash Algorithm</Label>
                <select
                  id="algorithm"
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isProcessing}
                >
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-1">SHA-1</option>
                </select>
              </div>

              {isProcessing && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Calculating hash...</p>
                </div>
              )}

              {calculatedHash && (
                <div className="space-y-2">
                  <Label htmlFor="calculated-hash">Calculated {algorithm} Hash</Label>
                  <Input
                    id="calculated-hash"
                    value={calculatedHash}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {calculatedHash && (
            <Card>
              <CardHeader>
                <CardTitle>Verify Hash</CardTitle>
                <CardDescription>
                  Enter the expected hash to compare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expected-hash">Expected Hash</Label>
                  <Input
                    id="expected-hash"
                    value={expectedHash}
                    onChange={(e) => setExpectedHash(e.target.value)}
                    placeholder="Paste expected hash here..."
                    className="font-mono text-sm"
                  />
                </div>

                {hasComparison && (
                  <Alert variant={hashesMatch ? 'default' : 'destructive'}>
                    {hashesMatch ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} />
                    )}
                    <AlertDescription>
                      {hashesMatch ? (
                        <div>
                          <p className="font-semibold text-green-600">✓ Hash Match Verified</p>
                          <p className="text-sm mt-1">The file hash matches the expected hash. File integrity confirmed.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">✗ Hash Mismatch</p>
                          <p className="text-sm mt-1">The hashes do not match. The file may be corrupted or tampered with.</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

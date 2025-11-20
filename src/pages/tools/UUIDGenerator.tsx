import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function UUIDGenerator() {
  // Set SEO metadata
  const metadata = getPageMetadata('uuid-generator')
  useSEO(metadata)

  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const copyToClipboard = useCopyToClipboard()

  const generateUUIDs = (num: number) => {
    const newUuids: string[] = []
    for (let i = 0; i < num; i++) {
      newUuids.push(uuidv4())
    }
    setUuids(newUuids)
    toast.success(`Generated ${num} UUID${num > 1 ? 's' : ''}`)
  }



  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            UUID Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate unique UUIDs (v4) for your applications
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate UUIDs</CardTitle>
            <CardDescription>Create one or multiple unique identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {[1, 5, 10, 25, 50, 100].map((num) => (
                <Button
                  key={num}
                  onClick={() => {
                    setCount(num)
                    generateUUIDs(num)
                  }}
                  variant={count === num ? 'default' : 'outline'}
                >
                  <Sparkle size={16} className="mr-2" weight="fill" />
                  Generate {num}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {uuids.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated UUIDs</CardTitle>
                  <CardDescription>{uuids.length} unique identifier{uuids.length > 1 ? 's' : ''}</CardDescription>
                </div>
                <Button onClick={() => copyToClipboard(uuids.join('\n'), 'All UUIDs copied!')} variant="outline">
                  <Copy size={18} className="mr-2" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-accent transition-colors group"
                  >
                    <span className="text-sm font-mono flex-1 select-all">{uuid}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(uuid, 'UUID copied!')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About UUID v4</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit identifier that is unique across space and time.
              </p>
              <p>
                <strong>Version 4</strong> UUIDs are randomly generated, providing a practical approach to generating unique identifiers
                without requiring a central authority or timestamp.
              </p>
              <p className="font-mono text-xs bg-muted p-2 rounded">
                Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

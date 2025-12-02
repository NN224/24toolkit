import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function UUIDGenerator() {
  const { t } = useTranslation()
  
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
    toast.success(num > 1 ? t('tools.uuidGenerator.generatedPlural', { count: num }) : t('tools.uuidGenerator.generated', { count: num }))
  }



  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.uuidGenerator.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.uuidGenerator.description')}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('tools.common.generate')} UUIDs</CardTitle>
            <CardDescription>{t('tools.uuidGenerator.description')}</CardDescription>
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
                  {t('tools.common.generate')} {num}
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
                  <CardTitle>{t('tools.uuidGenerator.generated')}</CardTitle>
                  <CardDescription>{uuids.length} UUID{uuids.length > 1 ? 's' : ''}</CardDescription>
                </div>
                <Button onClick={() => copyToClipboard(uuids.join('\n'), t('tools.common.copied'))} variant="outline">
                  <Copy size={18} className="mr-2" />
                  {t('tools.common.copy')} {t('common.viewAll').replace('View ', '')}
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
                      onClick={() => copyToClipboard(uuid, t('tools.common.copied'))}
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
            <CardTitle>{t('tools.uuidGenerator.version')} 4</CardTitle>
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

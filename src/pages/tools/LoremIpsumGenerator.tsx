import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Copy, FileText } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

const loremParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa."
]

export default function LoremIpsumGenerator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('lorem-ipsum-generator')
  useSEO({ ...metadata, canonicalPath: '/tools/lorem-ipsum-generator' })

  const [output, setOutput] = useState('')
  const [paragraphs, setParagraphs] = useState(3)
  const copyToClipboard = useCopyToClipboard()

  const generateLorem = () => {
    const generated: string[] = []
    for (let i = 0; i < paragraphs; i++) {
      generated.push(loremParagraphs[i % loremParagraphs.length])
    }
    setOutput(generated.join('\n\n'))
    toast.success(t('tools.loremIpsumGenerator.generated', { count: paragraphs }))
  }



  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.loremIpsumGenerator.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.loremIpsumGenerator.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.loremIpsumGenerator.options')}</CardTitle>
              <CardDescription>
                {t('tools.loremIpsumGenerator.paragraphs')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paragraphs">{t('tools.loremIpsumGenerator.paragraphs')}</Label>
                <select
                  id="paragraphs"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <Button onClick={generateLorem} className="w-full gap-2" size="lg">
                <FileText size={20} />
                {t('tools.loremIpsumGenerator.generate')}
              </Button>
            </CardContent>
          </Card>

          {output && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.loremIpsumGenerator.generatedText')}</CardTitle>
                <CardDescription>
                  {t('tools.loremIpsumGenerator.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[300px] font-serif"
                />

                <Button onClick={() => copyToClipboard(output, t('tools.common.copied'))} variant="outline" className="w-full gap-2">
                  <Copy size={20} />
                  {t('tools.common.copy')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

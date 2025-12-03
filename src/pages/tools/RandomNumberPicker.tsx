import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function RandomNumberPicker() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('random-number-picker')
  useSEO({ ...metadata, canonicalPath: '/tools/random-number-picker' })

  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [result, setResult] = useState<number | null>(null)
  const [count, setCount] = useState(1)
  const [results, setResults] = useState<number[]>([])

  const generateNumber = () => {
    if (min >= max) {
      toast.error(t('tools.randomNumberPicker.minLessThanMax'))
      return
    }

    if (count === 1) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min
      setResult(random)
      setResults([])
      toast.success(t('tools.randomNumberPicker.numberGenerated'))
    } else {
      const generated: number[] = []
      for (let i = 0; i < count; i++) {
        const random = Math.floor(Math.random() * (max - min + 1)) + min
        generated.push(random)
      }
      setResults(generated)
      setResult(null)
      toast.success(t('tools.randomNumberPicker.numbersGenerated', { count }))
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.randomNumberPicker.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.randomNumberPicker.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.randomNumberPicker.numberRange')}</CardTitle>
              <CardDescription>
                {t('tools.randomNumberPicker.rangeDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min">{t('tools.randomNumberPicker.min')}</Label>
                  <Input
                    id="min"
                    type="number"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max">{t('tools.randomNumberPicker.max')}</Label>
                  <Input
                    id="max"
                    type="number"
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">{t('tools.randomNumberPicker.howManyNumbers')}</Label>
                <select
                  id="count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={1}>{t('tools.randomNumberPicker.oneNumber')}</option>
                  <option value={5}>{t('tools.randomNumberPicker.fiveNumbers')}</option>
                  <option value={10}>{t('tools.randomNumberPicker.tenNumbers')}</option>
                  <option value={20}>{t('tools.randomNumberPicker.twentyNumbers')}</option>
                </select>
              </div>

              <Button onClick={generateNumber} className="w-full gap-2" size="lg">
                <Sparkle size={20} />
                {count === 1 ? t('tools.randomNumberPicker.pickRandomNumber') : t('tools.randomNumberPicker.pickRandomNumbers')}
              </Button>
            </CardContent>
          </Card>

          {result !== null && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500">
                <CardContent className="flex items-center justify-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="text-8xl font-bold text-white"
                  >
                    {result}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.randomNumberPicker.generatedNumbers')}</CardTitle>
                <CardDescription>
                  {t('tools.randomNumberPicker.yourRandomNumbers', { count: results.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {results.map((num, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xl"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="random-number-picker" category="fun" />
    </div>
  )
}

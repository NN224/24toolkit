import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Percent } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function PercentageCalculator() {
  const { t } = useTranslation()

  // Set SEO metadata
  const metadata = getPageMetadata('percentage-calculator')
  useSEO({ ...metadata, canonicalPath: '/tools/percentage-calculator' })

  const [value, setValue] = useState('')
  const [percent, setPercent] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const [num1, setNum1] = useState('')
  const [num2, setNum2] = useState('')
  const [percentageResult, setPercentageResult] = useState<number | null>(null)

  const [baseValue, setBaseValue] = useState('')
  const [increasePercent, setIncreasePercent] = useState('')
  const [increaseResult, setIncreaseResult] = useState<number | null>(null)

  const calculatePercentOf = () => {
    const val = parseFloat(value)
    const pct = parseFloat(percent)
    if (!isNaN(val) && !isNaN(pct)) {
      setResult((val * pct) / 100)
    }
  }

  const calculateWhatPercent = () => {
    const n1 = parseFloat(num1)
    const n2 = parseFloat(num2)
    if (!isNaN(n1) && !isNaN(n2) && n2 !== 0) {
      setPercentageResult((n1 / n2) * 100)
    }
  }

  const calculateIncrease = () => {
    const base = parseFloat(baseValue)
    const inc = parseFloat(increasePercent)
    if (!isNaN(base) && !isNaN(inc)) {
      const newValue = base + (base * inc) / 100
      setIncreaseResult(newValue)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <Percent size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.percentageCalculator.name')}</h1>
            <p className="text-muted-foreground">{t('tools.percentageCalculator.description')}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="percent-of" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="percent-of">{t('tools.percentageCalculator.whatIsPercent')}</TabsTrigger>
          <TabsTrigger value="what-percent">{t('tools.percentageCalculator.xIsWhatPercent')}</TabsTrigger>
          <TabsTrigger value="increase">{t('tools.percentageCalculator.percentChange')}</TabsTrigger>
        </TabsList>

        <TabsContent value="percent-of" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.percentageCalculator.whatIsPercent')}</CardTitle>
              <CardDescription>{t('tools.percentageCalculator.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="percent-input">{t('tools.percentageCalculator.percentage')}</Label>
                  <Input
                    id="percent-input"
                    type="number"
                    placeholder={t('tools.percentageCalculator.percentPlaceholder')}
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value-input">{t('tools.percentageCalculator.ofValue')}</Label>
                  <Input
                    id="value-input"
                    type="number"
                    placeholder={t('tools.percentageCalculator.valuePlaceholder')}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculatePercentOf} className="w-full">
                {t('tools.common.calculate')}
              </Button>
              {result !== null && (
                <div className="p-6 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('tools.common.result')}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {result.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {percent}% of {value} = {result.toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="what-percent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.percentageCalculator.xIsWhatPercent')}</CardTitle>
              <CardDescription>{t('tools.percentageCalculator.findPercentage')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="num1-input">{t('tools.percentageCalculator.value')}</Label>
                  <Input
                    id="num1-input"
                    type="number"
                    placeholder={t('tools.percentageCalculator.num1Placeholder')}
                    value={num1}
                    onChange={(e) => setNum1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num2-input">{t('tools.percentageCalculator.outOf')}</Label>
                  <Input
                    id="num2-input"
                    type="number"
                    placeholder={t('tools.percentageCalculator.valuePlaceholder')}
                    value={num2}
                    onChange={(e) => setNum2(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculateWhatPercent} className="w-full">
                {t('tools.common.calculate')}
              </Button>
              {percentageResult !== null && (
                <div className="p-6 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('tools.common.result')}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {percentageResult.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {num1} is {percentageResult.toFixed(2)}% of {num2}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="increase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.percentageCalculator.percentChange')}</CardTitle>
              <CardDescription>{t('tools.percentageCalculator.calculateAfterChange')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base-value">{t('tools.percentageCalculator.baseValue')}</Label>
                  <Input
                    id="base-value"
                    type="number"
                    placeholder={t('tools.percentageCalculator.basePlaceholder')}
                    value={baseValue}
                    onChange={(e) => setBaseValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="increase-percent">{t('tools.percentageCalculator.increaseDecrease')}</Label>
                  <Input
                    id="increase-percent"
                    type="number"
                    placeholder={t('tools.percentageCalculator.changePlaceholder')}
                    value={increasePercent}
                    onChange={(e) => setIncreasePercent(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculateIncrease} className="w-full">
                {t('tools.common.calculate')}
              </Button>
              {increaseResult !== null && (
                <div className="p-6 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('tools.percentageCalculator.newValue')}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {increaseResult.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {baseValue} {parseFloat(increasePercent) >= 0 ? '+' : ''}{increasePercent}% = {increaseResult.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('tools.percentageCalculator.change')}: {(increaseResult - parseFloat(baseValue)).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="percentage-calculator" category="calc" />
    </div>
  )
}

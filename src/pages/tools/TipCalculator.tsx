import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Receipt } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TipCalculator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('tip-calculator')
  useSEO({ ...metadata, canonicalPath: '/tools/tip-calculator' })

  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState('15')
  const [numPeople, setNumPeople] = useState('1')
  const [result, setResult] = useState<{
    tipAmount: number
    totalAmount: number
    perPerson: number
    tipPerPerson: number
  } | null>(null)

  const calculateTip = () => {
    const bill = parseFloat(billAmount)
    const tip = parseFloat(tipPercent)
    const people = parseInt(numPeople)

    if (isNaN(bill) || isNaN(tip) || isNaN(people) || people < 1) return

    const tipAmount = (bill * tip) / 100
    const totalAmount = bill + tipAmount
    const perPerson = totalAmount / people
    const tipPerPerson = tipAmount / people

    setResult({ tipAmount, totalAmount, perPerson, tipPerPerson })
  }

  const quickTipPercents = [10, 15, 18, 20, 25]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
            <Receipt size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.tipCalculator.name')}</h1>
            <p className="text-muted-foreground">{t('tools.tipCalculator.description')}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tools.tipCalculator.cardTitle')}</CardTitle>
          <CardDescription>{t('tools.tipCalculator.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-amount">{t('tools.tipCalculator.billAmount')} ($)</Label>
            <Input
              id="bill-amount"
              type="number"
              placeholder={t('tools.tipCalculator.billAmountPlaceholder')}
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-percent">{t('tools.tipCalculator.tipPercent')} (%)</Label>
            <div className="flex gap-2 mb-2">
              {quickTipPercents.map((pct) => (
                <Button
                  key={pct}
                  variant={tipPercent === pct.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTipPercent(pct.toString())}
                  className="flex-1"
                >
                  {pct}%
                </Button>
              ))}
            </div>
            <Input
              id="tip-percent"
              type="number"
              placeholder={t('tools.tipCalculator.customPercent')}
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num-people">{t('tools.tipCalculator.numberOfPeople')}</Label>
            <Input
              id="num-people"
              type="number"
              placeholder={t('tools.tipCalculator.numberOfPeoplePlaceholder')}
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              min="1"
            />
          </div>

          <Button onClick={calculateTip} className="w-full">
            {t('tools.common.calculate')}
          </Button>

          {result && (
            <div className="space-y-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-lg border border-teal-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('tools.tipCalculator.tipAmount')}</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${result.tipAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('tools.tipCalculator.totalBill')}</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${result.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {parseInt(numPeople) > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground mb-1">{t('tools.tipCalculator.perPerson')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${result.perPerson.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground mb-1">{t('tools.tipCalculator.tipPerPerson')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${result.tipPerPerson.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p>{t('tools.tipCalculator.billLabel')}: ${billAmount} + {t('tools.tipCalculator.tipLabel')} ({tipPercent}%): ${result.tipAmount.toFixed(2)} = ${result.totalAmount.toFixed(2)}</p>
                {parseInt(numPeople) > 1 && (
                  <p className="mt-1">{t('tools.tipCalculator.splitWays', { count: numPeople, amount: result.perPerson.toFixed(2) })}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

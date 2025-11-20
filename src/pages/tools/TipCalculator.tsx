import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Receipt } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TipCalculator() {
  // Set SEO metadata
  const metadata = getPageMetadata('tip-calculator')
  useSEO(metadata)

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
            <h1 className="text-3xl font-semibold text-foreground">Tip Calculator</h1>
            <p className="text-muted-foreground">Calculate tip and split bills easily</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Tip & Split Bill</CardTitle>
          <CardDescription>Enter bill amount and choose tip percentage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-amount">Bill Amount ($)</Label>
            <Input
              id="bill-amount"
              type="number"
              placeholder="e.g., 50.00"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-percent">Tip Percentage (%)</Label>
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
              placeholder="Custom %"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num-people">Number of People</Label>
            <Input
              id="num-people"
              type="number"
              placeholder="e.g., 4"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              min="1"
            />
          </div>

          <Button onClick={calculateTip} className="w-full">
            Calculate
          </Button>

          {result && (
            <div className="space-y-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-lg border border-teal-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tip Amount</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${result.tipAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Bill</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${result.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {parseInt(numPeople) > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground mb-1">Per Person</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${result.perPerson.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground mb-1">Tip Per Person</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${result.tipPerPerson.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p>Bill: ${billAmount} + Tip ({tipPercent}%): ${result.tipAmount.toFixed(2)} = ${result.totalAmount.toFixed(2)}</p>
                {parseInt(numPeople) > 1 && (
                  <p className="mt-1">Split {numPeople} ways: ${result.perPerson.toFixed(2)} per person</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Percent } from '@phosphor-icons/react'

export default function PercentageCalculator() {
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
            <h1 className="text-3xl font-semibold text-foreground">Percentage Calculator</h1>
            <p className="text-muted-foreground">Calculate percentages, increases, and decreases</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="percent-of" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="percent-of">% of Value</TabsTrigger>
          <TabsTrigger value="what-percent">What %</TabsTrigger>
          <TabsTrigger value="increase">% Change</TabsTrigger>
        </TabsList>

        <TabsContent value="percent-of" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Percentage of a Value</CardTitle>
              <CardDescription>What is X% of Y?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="percent-input">Percentage (%)</Label>
                  <Input
                    id="percent-input"
                    type="number"
                    placeholder="e.g., 25"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value-input">Of Value</Label>
                  <Input
                    id="value-input"
                    type="number"
                    placeholder="e.g., 200"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculatePercentOf} className="w-full">
                Calculate
              </Button>
              {result !== null && (
                <div className="p-6 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Result</p>
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
              <CardTitle>What Percentage is X of Y?</CardTitle>
              <CardDescription>Find what percentage one number is of another</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="num1-input">Value</Label>
                  <Input
                    id="num1-input"
                    type="number"
                    placeholder="e.g., 50"
                    value={num1}
                    onChange={(e) => setNum1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num2-input">Out of</Label>
                  <Input
                    id="num2-input"
                    type="number"
                    placeholder="e.g., 200"
                    value={num2}
                    onChange={(e) => setNum2(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculateWhatPercent} className="w-full">
                Calculate
              </Button>
              {percentageResult !== null && (
                <div className="p-6 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Result</p>
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
              <CardTitle>Percentage Increase/Decrease</CardTitle>
              <CardDescription>Calculate value after percentage change</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base-value">Base Value</Label>
                  <Input
                    id="base-value"
                    type="number"
                    placeholder="e.g., 100"
                    value={baseValue}
                    onChange={(e) => setBaseValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="increase-percent">Increase/Decrease (%)</Label>
                  <Input
                    id="increase-percent"
                    type="number"
                    placeholder="e.g., 15 or -10"
                    value={increasePercent}
                    onChange={(e) => setIncreasePercent(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculateIncrease} className="w-full">
                Calculate
              </Button>
              {increaseResult !== null && (
                <div className="p-6 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">New Value</p>
                  <p className="text-3xl font-bold text-foreground">
                    {increaseResult.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {baseValue} {parseFloat(increasePercent) >= 0 ? '+' : ''}{increasePercent}% = {increaseResult.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Change: {(increaseResult - parseFloat(baseValue)).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Activity } from '@phosphor-icons/react'

export default function BMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [bmiResult, setBmiResult] = useState<{
    bmi: number
    category: string
    color: string
  } | null>(null)

  const calculateBMI = () => {
    let w = parseFloat(weight)
    let h = parseFloat(height)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return

    if (unit === 'imperial') {
      w = w * 0.453592
      h = h * 0.0254
    } else {
      h = h / 100
    }

    const bmi = w / (h * h)
    let category = ''
    let color = ''

    if (bmi < 18.5) {
      category = 'Underweight'
      color = 'text-blue-600'
    } else if (bmi < 25) {
      category = 'Normal weight'
      color = 'text-green-600'
    } else if (bmi < 30) {
      category = 'Overweight'
      color = 'text-yellow-600'
    } else {
      category = 'Obese'
      color = 'text-red-600'
    }

    setBmiResult({ bmi, category, color })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
            <Activity size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">BMI Calculator</h1>
            <p className="text-muted-foreground">Calculate your Body Mass Index</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Body Mass Index Calculator</CardTitle>
          <CardDescription>Enter your weight and height to calculate BMI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={unit === 'metric' ? 'default' : 'outline'}
              onClick={() => setUnit('metric')}
              className="flex-1"
            >
              Metric (kg, cm)
            </Button>
            <Button
              variant={unit === 'imperial' ? 'default' : 'outline'}
              onClick={() => setUnit('imperial')}
              className="flex-1"
            >
              Imperial (lbs, in)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight-input">
                Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
              </Label>
              <Input
                id="weight-input"
                type="number"
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-input">
                Height {unit === 'metric' ? '(cm)' : '(inches)'}
              </Label>
              <Input
                id="height-input"
                type="number"
                placeholder={unit === 'metric' ? 'e.g., 170' : 'e.g., 67'}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateBMI} className="w-full">
            Calculate BMI
          </Button>

          {bmiResult && (
            <div className="space-y-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-lg text-center border border-pink-200">
                <p className="text-sm text-muted-foreground mb-2">Your BMI</p>
                <p className="text-5xl font-bold text-foreground">
                  {bmiResult.bmi.toFixed(1)}
                </p>
                <p className={`text-xl font-semibold mt-2 ${bmiResult.color}`}>
                  {bmiResult.category}
                </p>
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">BMI Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Underweight</span>
                    <span className="text-blue-600 font-medium">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal weight</span>
                    <span className="text-green-600 font-medium">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overweight</span>
                    <span className="text-yellow-600 font-medium">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Obese</span>
                    <span className="text-red-600 font-medium">&ge; 30</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

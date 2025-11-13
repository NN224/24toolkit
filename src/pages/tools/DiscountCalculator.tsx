import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tag } from '@phosphor-icons/react'

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [result, setResult] = useState<{
    discount: number
    finalPrice: number
    savings: number
  } | null>(null)

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice)
    const discount = parseFloat(discountPercent)

    if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0 || discount > 100) {
      return
    }

    const discountAmount = (price * discount) / 100
    const finalPrice = price - discountAmount

    setResult({
      discount: discountAmount,
      finalPrice,
      savings: discountAmount
    })
  }

  const quickDiscounts = [10, 20, 25, 30, 50]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
            <Tag size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Discount Calculator</h1>
            <p className="text-muted-foreground">Calculate sale prices and savings</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Discount & Final Price</CardTitle>
          <CardDescription>Find out how much you save with discounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-price">Original Price ($)</Label>
            <Input
              id="original-price"
              type="number"
              placeholder="e.g., 99.99"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-percent">Discount Percentage (%)</Label>
            <div className="flex gap-2 mb-2">
              {quickDiscounts.map((pct) => (
                <Button
                  key={pct}
                  variant={discountPercent === pct.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDiscountPercent(pct.toString())}
                  className="flex-1"
                >
                  {pct}%
                </Button>
              ))}
            </div>
            <Input
              id="discount-percent"
              type="number"
              placeholder="Custom %"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              max="100"
              min="0"
            />
          </div>

          <Button onClick={calculateDiscount} className="w-full">
            Calculate
          </Button>

          {result && (
            <div className="space-y-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">You Save</p>
                    <p className="text-3xl font-bold text-red-600">
                      ${result.savings.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Final Price</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${result.finalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Price:</span>
                  <span className="font-semibold">${originalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount ({discountPercent}%):</span>
                  <span className="font-semibold text-red-600">-${result.discount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Final Price:</span>
                  <span className="font-bold text-green-600">${result.finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

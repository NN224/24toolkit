import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CurrencyDollar } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function CurrencyConverter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('currency-converter')
  useSEO({ ...metadata, canonicalPath: '/tools/currency-converter' })

  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [rates, setRates] = useState<Record<string, number>>({})

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN',
    'BRL', 'ZAR', 'RUB', 'KRW', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'NZD'
  ]

  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error(t('errors.invalidInput'))
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      const data = await response.json()
      
      if (data.rates) {
        setRates(data.rates)
        const rate = data.rates[toCurrency]
        const convertedAmount = parseFloat(amount) * rate
        setResult(convertedAmount)
        toast.success(t('common.success'))
      }
    } catch (error) {
      toast.error(t('errors.network'))
      const fallbackRates: Record<string, number> = {
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.52,
        CAD: 1.36, CHF: 0.88, CNY: 7.24, INR: 83.12, MXN: 17.05
      }
      const rate = fallbackRates[toCurrency] / fallbackRates[fromCurrency]
      setResult(parseFloat(amount) * rate)
    } finally {
      setLoading(false)
    }
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    setResult(null)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
            <CurrencyDollar size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.currencyConverter.name')}</h1>
            <p className="text-muted-foreground">{t('tools.currencyConverter.description')}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tools.currencyConverter.name')}</CardTitle>
          <CardDescription>{t('tools.currencyConverter.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount-input">{t('tools.currencyConverter.amount')}</Label>
            <Input
              id="amount-input"
              type="number"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-currency">{t('tools.currencyConverter.from')}</Label>
              <select
                id="from-currency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-currency">{t('tools.currencyConverter.to')}</Label>
              <select
                id="to-currency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={convertCurrency} className="flex-1" disabled={loading}>
              {loading ? t('common.loading') : t('tools.common.convert')}
            </Button>
            <Button onClick={swapCurrencies} variant="outline">
              {t('tools.currencyConverter.swap')}
            </Button>
          </div>

          {result !== null && (
            <div className="space-y-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg text-center border border-emerald-200">
                <p className="text-sm text-muted-foreground mb-2">{t('tools.common.result')}</p>
                <p className="text-4xl font-bold text-foreground">
                  {result.toFixed(2)} {toCurrency}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                </p>
              </div>

              {rates[toCurrency] && (
                <div className="p-4 bg-muted/50 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    {t('tools.currencyConverter.exchangeRate')}: 1 {fromCurrency} = {rates[toCurrency].toFixed(4)} {toCurrency}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

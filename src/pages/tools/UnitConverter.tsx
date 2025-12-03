import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowsDownUp } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'speed'

interface ConversionUnit {
  name: string
  symbol: string
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

const conversionData: Record<UnitCategory, { name: string; units: Record<string, ConversionUnit> }> = {
  length: {
    name: 'Length',
    units: {
      meter: {
        name: 'Meter',
        symbol: 'm',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      kilometer: {
        name: 'Kilometer',
        symbol: 'km',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      centimeter: {
        name: 'Centimeter',
        symbol: 'cm',
        toBase: (v) => v / 100,
        fromBase: (v) => v * 100,
      },
      millimeter: {
        name: 'Millimeter',
        symbol: 'mm',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      mile: {
        name: 'Mile',
        symbol: 'mi',
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
      },
      yard: {
        name: 'Yard',
        symbol: 'yd',
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
      },
      foot: {
        name: 'Foot',
        symbol: 'ft',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
      inch: {
        name: 'Inch',
        symbol: 'in',
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
      },
    },
  },
  weight: {
    name: 'Weight',
    units: {
      kilogram: {
        name: 'Kilogram',
        symbol: 'kg',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      gram: {
        name: 'Gram',
        symbol: 'g',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      milligram: {
        name: 'Milligram',
        symbol: 'mg',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      pound: {
        name: 'Pound',
        symbol: 'lb',
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592,
      },
      ounce: {
        name: 'Ounce',
        symbol: 'oz',
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495,
      },
      ton: {
        name: 'Ton',
        symbol: 't',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: {
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      fahrenheit: {
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => (v - 32) * 5 / 9,
        fromBase: (v) => (v * 9 / 5) + 32,
      },
      kelvin: {
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  volume: {
    name: 'Volume',
    units: {
      liter: {
        name: 'Liter',
        symbol: 'L',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      milliliter: {
        name: 'Milliliter',
        symbol: 'mL',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      gallon: {
        name: 'Gallon (US)',
        symbol: 'gal',
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541,
      },
      quart: {
        name: 'Quart',
        symbol: 'qt',
        toBase: (v) => v * 0.946353,
        fromBase: (v) => v / 0.946353,
      },
      pint: {
        name: 'Pint',
        symbol: 'pt',
        toBase: (v) => v * 0.473176,
        fromBase: (v) => v / 0.473176,
      },
      cup: {
        name: 'Cup',
        symbol: 'cup',
        toBase: (v) => v * 0.236588,
        fromBase: (v) => v / 0.236588,
      },
    },
  },
  area: {
    name: 'Area',
    units: {
      squareMeter: {
        name: 'Square Meter',
        symbol: 'm²',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      squareKilometer: {
        name: 'Square Kilometer',
        symbol: 'km²',
        toBase: (v) => v * 1000000,
        fromBase: (v) => v / 1000000,
      },
      squareFoot: {
        name: 'Square Foot',
        symbol: 'ft²',
        toBase: (v) => v * 0.092903,
        fromBase: (v) => v / 0.092903,
      },
      acre: {
        name: 'Acre',
        symbol: 'ac',
        toBase: (v) => v * 4046.86,
        fromBase: (v) => v / 4046.86,
      },
      hectare: {
        name: 'Hectare',
        symbol: 'ha',
        toBase: (v) => v * 10000,
        fromBase: (v) => v / 10000,
      },
    },
  },
  speed: {
    name: 'Speed',
    units: {
      meterPerSecond: {
        name: 'Meter per Second',
        symbol: 'm/s',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      kilometerPerHour: {
        name: 'Kilometer per Hour',
        symbol: 'km/h',
        toBase: (v) => v / 3.6,
        fromBase: (v) => v * 3.6,
      },
      milePerHour: {
        name: 'Mile per Hour',
        symbol: 'mph',
        toBase: (v) => v * 0.44704,
        fromBase: (v) => v / 0.44704,
      },
      knot: {
        name: 'Knot',
        symbol: 'kn',
        toBase: (v) => v * 0.514444,
        fromBase: (v) => v / 0.514444,
      },
    },
  },
}

export default function UnitConverter() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('unit-converter')
  useSEO({ ...metadata, canonicalPath: '/tools/unit-converter' })

  const [category, setCategory] = useState<UnitCategory>('length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('kilometer')
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')

  useEffect(() => {
    const units = Object.keys(conversionData[category].units)
    setFromUnit(units[0])
    setToUnit(units[1] || units[0])
    setInputValue('')
    setResult('')
  }, [category])

  useEffect(() => {
    if (!inputValue || isNaN(parseFloat(inputValue))) {
      setResult('')
      return
    }

    const value = parseFloat(inputValue)
    const units = conversionData[category].units
    const baseValue = units[fromUnit].toBase(value)
    const convertedValue = units[toUnit].fromBase(baseValue)
    
    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''))
  }, [inputValue, fromUnit, toUnit, category])

  const currentUnits = conversionData[category].units

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.unitConverter.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.unitConverter.description')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.unitConverter.selectCategory')}</CardTitle>
              <CardDescription>
                {t('tools.unitConverter.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as UnitCategory)}>
                  <SelectTrigger id="category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(conversionData).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convert Units</CardTitle>
              <CardDescription>
                Enter a value and select units to convert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from-value">{t('tools.unitConverter.from')}</Label>
                  <Input
                    id="from-value"
                    type="number"
                    placeholder={t('tools.unitConverter.value')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currentUnits).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name} ({unit.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center md:pt-8">
                  <ArrowsDownUp size={24} className="text-muted-foreground" />
                </div>

                <div className="space-y-2 md:col-start-2">
                  <Label htmlFor="to-value">{t('tools.unitConverter.to')}</Label>
                  <div className="text-lg font-semibold text-primary h-10 flex items-center px-3 bg-muted rounded-md border border-border">
                    {result || '0'}
                  </div>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currentUnits).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name} ({unit.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {result && (
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-center">
                    <span className="font-semibold">{inputValue} {currentUnits[fromUnit].symbol}</span>
                    {' = '}
                    <span className="font-semibold text-primary">{result} {currentUnits[toUnit].symbol}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(conversionData).map(([key, value]) => (
              <Card key={key} className={key === category ? 'border-primary' : ''}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{value.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(value.units).length} units available
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="unit-converter" category="calc" />
    </div>
  )
}

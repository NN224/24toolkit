import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function RandomNumberPicker() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [result, setResult] = useState<number | null>(null)
  const [count, setCount] = useState(1)
  const [results, setResults] = useState<number[]>([])

  const generateNumber = () => {
    if (min >= max) {
      toast.error('Minimum must be less than maximum')
      return
    }

    if (count === 1) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min
      setResult(random)
      setResults([])
      toast.success('Random number generated!')
    } else {
      const generated: number[] = []
      for (let i = 0; i < count; i++) {
        const random = Math.floor(Math.random() * (max - min + 1)) + min
        generated.push(random)
      }
      setResults(generated)
      setResult(null)
      toast.success(`Generated ${count} random numbers!`)
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Random Number Picker
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate random numbers within a custom range for games, draws, or testing.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Number Range</CardTitle>
              <CardDescription>
                Set the minimum and maximum values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min">Minimum</Label>
                  <Input
                    id="min"
                    type="number"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max">Maximum</Label>
                  <Input
                    id="max"
                    type="number"
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">How many numbers?</Label>
                <select
                  id="count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={1}>1 number</option>
                  <option value={5}>5 numbers</option>
                  <option value={10}>10 numbers</option>
                  <option value={20}>20 numbers</option>
                </select>
              </div>

              <Button onClick={generateNumber} className="w-full gap-2" size="lg">
                <Sparkle size={20} />
                Pick Random {count === 1 ? 'Number' : 'Numbers'}
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
                <CardTitle>Generated Numbers</CardTitle>
                <CardDescription>
                  Your {results.length} random numbers
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
    </div>
  )
}

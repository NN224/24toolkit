import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DiceSix, CoinVertical } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function DiceRollerCoinFlipper() {
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [coinResult, setCoinResult] = useState<'Heads' | 'Tails' | null>(null)
  const [diceCount, setDiceCount] = useState(1)

  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1
    setDiceResult(result)
    setCoinResult(null)
    toast.success(`Rolled ${result}!`)
  }

  const flipCoin = () => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails'
    setCoinResult(result)
    setDiceResult(null)
    toast.success(`${result}!`)
  }

  const getDiceEmoji = (num: number) => {
    const emojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
    return emojis[num - 1]
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Dice Roller / Coin Flipper
          </h1>
          <p className="text-lg text-muted-foreground">
            Roll dice or flip a coin for games, decisions, and random choices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Roll Dice</CardTitle>
              <CardDescription>
                Roll a standard 6-sided die
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {diceResult !== null && (
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="text-9xl">
                    {getDiceEmoji(diceResult)}
                  </div>
                </motion.div>
              )}

              <Button onClick={rollDice} className="w-full gap-2" size="lg">
                <DiceSix size={24} />
                Roll Dice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flip Coin</CardTitle>
              <CardDescription>
                Flip a coin for heads or tails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {coinResult && (
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 720 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="text-center">
                    <div className="text-8xl mb-2">
                      {coinResult === 'Heads' ? '🪙' : '💰'}
                    </div>
                    <div className={`text-3xl font-bold ${
                      coinResult === 'Heads' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {coinResult}
                    </div>
                  </div>
                </motion.div>
              )}

              <Button onClick={flipCoin} className="w-full gap-2" size="lg">
                <CoinVertical size={24} />
                Flip Coin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Sparkle, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
  'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green'
]

export default function RandomNameGenerator() {
  const [names, setNames] = useState<string[]>([])
  const [count, setCount] = useState(5)

  const generateNames = () => {
    const generated: string[] = []
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      generated.push(`${firstName} ${lastName}`)
    }
    setNames(generated)
    toast.success(`Generated ${count} random names!`)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(names.join('\n'))
      toast.success('Names copied to clipboard!')
    } catch {
      toast.error('Failed to copy names')
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Random Name Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate random names for testing, characters, or placeholder content.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generator Settings</CardTitle>
              <CardDescription>
                Configure how many names to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Names</Label>
                <select
                  id="count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={1}>1 name</option>
                  <option value={5}>5 names</option>
                  <option value={10}>10 names</option>
                  <option value={20}>20 names</option>
                  <option value={50}>50 names</option>
                </select>
              </div>

              <Button onClick={generateNames} className="w-full gap-2" size="lg">
                <Sparkle size={20} />
                Generate Names
              </Button>
            </CardContent>
          </Card>

          {names.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Names</CardTitle>
                <CardDescription>
                  {names.length} random {names.length === 1 ? 'name' : 'names'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <ul className="space-y-2">
                    {names.map((name, index) => (
                      <li key={index} className="text-sm font-mono">
                        {index + 1}. {name}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={handleCopy} variant="outline" className="w-full gap-2">
                  <Copy size={20} />
                  Copy All Names
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

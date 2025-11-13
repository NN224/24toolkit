import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Trash, ArrowRight, ArrowLeft } from '@phosphor-icons/react'
import { toast } from 'sonner'
import Papa from 'papaparse'

export default function JSONCSVConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convertJSONToCSV = () => {
    if (!input.trim()) {
      toast.error('Please enter JSON data')
      return
    }

    try {
      const jsonData = JSON.parse(input)
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]
      
      const csv = Papa.unparse(dataArray)
      setOutput(csv)
      toast.success('Converted JSON to CSV!')
    } catch (err) {
      toast.error('Invalid JSON format')
    }
  }

  const convertCSVToJSON = () => {
    if (!input.trim()) {
      toast.error('Please enter CSV data')
      return
    }

    try {
      const result = Papa.parse(input, {
        header: true,
        skipEmptyLines: true
      })

      if (result.errors.length > 0) {
        toast.error('Invalid CSV format')
        return
      }

      const json = JSON.stringify(result.data, null, 2)
      setOutput(json)
      toast.success('Converted CSV to JSON!')
    } catch (err) {
      toast.error('Failed to parse CSV')
    }
  }

  const handleCopyOutput = async () => {
    if (!output) return
    
    try {
      await navigator.clipboard.writeText(output)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    toast.success('Cleared all fields')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            JSON ⇄ CSV Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert between JSON and CSV formats seamlessly with validation and error handling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Paste your JSON or CSV data here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="input-data"
                placeholder="Paste your JSON or CSV data here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-y"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                Converted data will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="output-data"
                placeholder="Converted data will appear here..."
                value={output}
                readOnly
                className="min-h-[400px] font-mono text-sm resize-y"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyOutput}
                  disabled={!output}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy size={16} />
                  Copy Result
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button 
            onClick={convertJSONToCSV}
            disabled={!input}
            className="gap-2 w-full sm:w-auto"
            size="lg"
          >
            <span className="hidden sm:inline">Convert JSON</span>
            <span className="sm:hidden">JSON</span>
            <ArrowRight size={20} weight="bold" />
            <span className="hidden sm:inline">CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>

          <Button 
            onClick={convertCSVToJSON}
            disabled={!input}
            variant="secondary"
            className="gap-2 w-full sm:w-auto"
            size="lg"
          >
            <span className="hidden sm:inline">Convert CSV</span>
            <span className="sm:hidden">CSV</span>
            <ArrowLeft size={20} weight="bold" />
            <span className="hidden sm:inline">JSON</span>
            <span className="sm:hidden">JSON</span>
          </Button>

          <Button 
            onClick={handleClear}
            disabled={!input && !output}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            size="lg"
          >
            <Trash size={20} />
            Clear All
          </Button>
        </div>

        <Card className="mt-6 border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <p className="font-medium text-foreground">Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>JSON arrays of objects work best for conversion to CSV</li>
                <li>CSV must have headers in the first row for proper JSON conversion</li>
                <li>Complex nested JSON structures may not convert cleanly to CSV</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Trash, ArrowRight, ArrowLeft } from '@phosphor-icons/react'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function JSONCSVConverter() {
  const { t } = useTranslation()

  // Set SEO metadata
  const metadata = getPageMetadata('json-csv-converter')
  useSEO(metadata)

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convertJSONToCSV = () => {
    if (!input.trim()) {
      toast.error(t('tools.jsonCsvConverter.enterJsonData'))
      return
    }

    try {
      const jsonData = JSON.parse(input)
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]
      
      const csv = Papa.unparse(dataArray)
      setOutput(csv)
      toast.success(t('tools.jsonCsvConverter.convertedJsonToCsv'))
    } catch (err) {
      toast.error(t('tools.jsonCsvConverter.invalidJsonFormat'))
    }
  }

  const convertCSVToJSON = () => {
    if (!input.trim()) {
      toast.error(t('tools.jsonCsvConverter.enterCsvData'))
      return
    }

    try {
      const result = Papa.parse(input, {
        header: true,
        skipEmptyLines: true
      })

      if (result.errors.length > 0) {
        toast.error(t('tools.jsonCsvConverter.invalidCsvFormat'))
        return
      }

      const json = JSON.stringify(result.data, null, 2)
      setOutput(json)
      toast.success(t('tools.jsonCsvConverter.convertedCsvToJson'))
    } catch (err) {
      toast.error(t('tools.jsonCsvConverter.failedToParseCsv'))
    }
  }

  const handleCopyOutput = async () => {
    if (!output) return
    
    try {
      await navigator.clipboard.writeText(output)
      toast.success(t('tools.common.copied'))
    } catch (err) {
      toast.error(t('tools.jsonCsvConverter.failedToCopy'))
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    toast.success(t('tools.jsonCsvConverter.clearedAllFields'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.jsonCsvConverter.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.jsonCsvConverter.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.common.input')}</CardTitle>
              <CardDescription>
                {t('tools.jsonCsvConverter.inputDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="input-data"
                placeholder={t('tools.jsonCsvConverter.inputPlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-y"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.common.output')}</CardTitle>
              <CardDescription>
                {t('tools.jsonCsvConverter.outputDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="output-data"
                placeholder={t('tools.jsonCsvConverter.outputPlaceholder')}
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
                  {t('tools.jsonCsvConverter.copyResult')}
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
            <span className="hidden sm:inline">{t('tools.jsonCsvConverter.convertJson')}</span>
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
            <span className="hidden sm:inline">{t('tools.jsonCsvConverter.convertCsv')}</span>
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
            {t('tools.jsonCsvConverter.clearAll')}
          </Button>
        </div>

        <Card className="mt-6 border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <p className="font-medium text-foreground">{t('tools.jsonCsvConverter.tips')}:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('tools.jsonCsvConverter.tip1')}</li>
                <li>{t('tools.jsonCsvConverter.tip2')}</li>
                <li>{t('tools.jsonCsvConverter.tip3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

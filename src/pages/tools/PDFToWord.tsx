import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, Trash, FilePdf, FileDoc, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function PDFToWord() {
  // Set SEO metadata
  const metadata = getPageMetadata('pdf-to-word')
  useSEO({ ...metadata, canonicalPath: '/tools/pdf-to-word' })

  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [conversionComplete, setConversionComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      toast.error(t('tools.pdfToWord.selectPdfError'))
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(t('tools.pdfToWord.fileSizeError'))
      return
    }

    setFile(selectedFile)
    setConversionComplete(false)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (!file) {
      toast.error(t('tools.pdfToWord.uploadFirst'))
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setConversionComplete(false)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)
      setConversionComplete(true)
      toast.info(t('tools.pdfToWord.demoNotice'))
    }, 5000)
  }

  const handleDownload = () => {
    toast.info(t('tools.pdfToWord.demoDownloadNotice'))
  }

  const handleClear = () => {
    setFile(null)
    setConversionComplete(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success(t('tools.pdfToWord.cleared'))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.pdfToWord.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.pdfToWord.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Alert>
            <Info size={16} className="mt-0.5" />
            <AlertDescription>
              <strong>{t('tools.pdfToWord.demoMode')}</strong> {t('tools.pdfToWord.demoModeDesc')}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.pdfToWord.uploadPdf')}</CardTitle>
              <CardDescription>
                {t('tools.pdfToWord.uploadDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!file ? (
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary cursor-pointer transition-colors"
                >
                  <FilePdf size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('tools.pdfToWord.clickToUpload')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('tools.pdfToWord.pdfFilesOnly')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border border-border">
                    <FilePdf size={40} className="text-destructive" weight="fill" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleConvert}
                      disabled={isProcessing || conversionComplete}
                      className="gap-2"
                    >
                      <FileDoc size={16} />
                      {isProcessing ? t('tools.pdfToWord.converting') : conversionComplete ? t('tools.pdfToWord.converted') : t('tools.pdfToWord.convertToWord')}
                    </Button>

                    <Button
                      onClick={handleUploadClick}
                      variant="outline"
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <Upload size={16} />
                      {t('tools.pdfToWord.changeFile')}
                    </Button>

                    <Button
                      onClick={handleClear}
                      variant="outline"
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <Trash size={16} />
                      {t('tools.common.clear')}
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('tools.pdfToWord.convertingToWord')}</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {conversionComplete && (
                    <Card className="bg-accent/10 border-accent/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <FileDoc size={40} className="text-primary" weight="fill" />
                          <div className="flex-1">
                            <p className="font-medium">{t('tools.pdfToWord.conversionComplete')}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.name.replace('.pdf', '.docx')}
                            </p>
                          </div>
                          <Button onClick={handleDownload} className="gap-2">
                            <Download size={16} />
                            {t('tools.common.download')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.pdfToWord.howItWorks')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('tools.pdfToWord.step1Title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('tools.pdfToWord.step1Desc')}
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <FileDoc size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('tools.pdfToWord.step2Title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('tools.pdfToWord.step2Desc')}
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Download size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('tools.pdfToWord.step3Title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('tools.pdfToWord.step3Desc')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>{t('tools.common.note')}:</strong> {t('tools.pdfToWord.productionNote')}
            </p>
          </div>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="pdf-to-word" category="fun" />
    </div>
  )
}

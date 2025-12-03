import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpeakerHigh, Stop, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function TextToSpeech() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('text-to-speech')
  useSEO({ ...metadata, canonicalPath: '/tools/text-to-speech' })

  const [text, setText] = useState('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [selectedVoice])

  const handleSpeak = () => {
    if (!text.trim()) {
      toast.error(t('tools.textToSpeech.enterTextError'))
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find(v => v.name === selectedVoice)
    
    if (voice) {
      utterance.voice = voice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => {
      setIsSpeaking(false)
      toast.error(t('tools.textToSpeech.conversionFailed'))
    }

    window.speechSynthesis.speak(utterance)
    toast.success(t('tools.textToSpeech.playingAudio'))
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    toast.success(t('tools.textToSpeech.stopped'))
  }

  const handleDownload = () => {
    toast.info(t('tools.textToSpeech.downloadNotice'))
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.textToSpeech.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.textToSpeech.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.textToSpeech.enterYourText')}</CardTitle>
              <CardDescription>
                {t('tools.textToSpeech.enterDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">{t('tools.textToSpeech.textContent')}</Label>
                <Textarea
                  id="text-input"
                  placeholder={t('tools.textToSpeech.placeholder')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-y font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-select">{t('tools.textToSpeech.selectVoice')}</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger id="voice-select">
                    <SelectValue placeholder={t('tools.textToSpeech.chooseVoice')} />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleSpeak}
                  disabled={!text.trim() || isSpeaking}
                  className="gap-2"
                >
                  <SpeakerHigh size={16} weight="fill" />
                  {isSpeaking ? t('tools.textToSpeech.speaking') : t('tools.textToSpeech.convertToSpeech')}
                </Button>
                
                <Button
                  onClick={handleStop}
                  disabled={!isSpeaking}
                  variant="outline"
                  className="gap-2"
                >
                  <Stop size={16} weight="fill" />
                  {t('tools.textToSpeech.stop')}
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="gap-2"
                  disabled={!text.trim()}
                >
                  <Download size={16} />
                  {t('tools.textToSpeech.downloadMp3')}
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>{t('tools.textToSpeech.note')}</strong> {t('tools.textToSpeech.noteText')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="text-to-speech" category="fun" />
    </div>
  )
}

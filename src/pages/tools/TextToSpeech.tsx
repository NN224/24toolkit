import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpeakerHigh, Stop, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TextToSpeech() {
  // Set SEO metadata
  const metadata = getPageMetadata('text-to-speech')
  useSEO(metadata)

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
      toast.error('Please enter some text to convert')
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
      toast.error('Failed to convert text to speech')
    }

    window.speechSynthesis.speak(utterance)
    toast.success('Playing audio...')
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    toast.success('Stopped')
  }

  const handleDownload = () => {
    toast.info('MP3 download requires server-side processing. Playing audio in browser only.')
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Text to Speech Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert any text to natural-sounding speech with multiple voice options using Web Speech API.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Text</CardTitle>
              <CardDescription>
                Type or paste the text you want to convert to speech
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Content</Label>
                <Textarea
                  id="text-input"
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-y font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-select">Select Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger id="voice-select">
                    <SelectValue placeholder="Choose a voice" />
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
                  {isSpeaking ? 'Speaking...' : 'Convert to Speech'}
                </Button>
                
                <Button
                  onClick={handleStop}
                  disabled={!isSpeaking}
                  variant="outline"
                  className="gap-2"
                >
                  <Stop size={16} weight="fill" />
                  Stop
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="gap-2"
                  disabled={!text.trim()}
                >
                  <Download size={16} />
                  Download MP3
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This tool uses your browser's built-in speech synthesis. 
                  MP3 download requires server-side processing and is not available in the browser version.
                  Voice quality and availability may vary by browser and operating system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

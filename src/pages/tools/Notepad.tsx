import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FloppyDisk, Trash, NotePencil } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function Notepad() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('notepad')
  useSEO({ ...metadata, canonicalPath: '/tools/notepad' })

  const [note, setNote] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('24toolkit-notepad')
    if (saved) {
      setNote(saved)
    }
  }, [])

  const saveNote = () => {
    localStorage.setItem('24toolkit-notepad', note)
    toast.success(t('tools.notepad.noteSaved'))
  }

  const clearNote = () => {
    if (confirm(t('tools.notepad.confirmClear'))) {
      setNote('')
      localStorage.removeItem('24toolkit-notepad')
      toast.success(t('tools.notepad.noteCleared'))
    }
  }

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0
  const charCount = note.length

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.notepad.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.notepad.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <NotePencil size={24} />
                  {t('tools.notepad.yourNotes')}
                </CardTitle>
                <CardDescription>
                  {wordCount} {t('tools.notepad.words')}, {charCount} {t('tools.notepad.characters')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              id="notepad-text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('tools.notepad.placeholder')}
              className="min-h-[400px] font-mono"
            />

            <div className="flex gap-2">
              <Button onClick={saveNote} className="gap-2 flex-1">
                <FloppyDisk size={20} />
                {t('tools.notepad.saveNote')}
              </Button>
              <Button onClick={clearNote} variant="outline" className="gap-2">
                <Trash size={20} />
                {t('tools.common.clear')}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-semibold mb-1">💡 {t('tools.notepad.tips')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('tools.notepad.tip1')}</li>
                <li>{t('tools.notepad.tip2')}</li>
                <li>{t('tools.notepad.tip3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

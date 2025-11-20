import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FloppyDisk, Trash, NotePencil } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function Notepad() {
  // Set SEO metadata
  const metadata = getPageMetadata('notepad')
  useSEO(metadata)

  const [note, setNote] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('24toolkit-notepad')
    if (saved) {
      setNote(saved)
    }
  }, [])

  const saveNote = () => {
    localStorage.setItem('24toolkit-notepad', note)
    toast.success('Note saved!')
  }

  const clearNote = () => {
    if (confirm('Are you sure you want to clear your note?')) {
      setNote('')
      localStorage.removeItem('24toolkit-notepad')
      toast.success('Note cleared!')
    }
  }

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0
  const charCount = note.length

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Notepad
          </h1>
          <p className="text-lg text-muted-foreground">
            Quick notes saved locally in your browser.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <NotePencil size={24} />
                  Your Notes
                </CardTitle>
                <CardDescription>
                  {wordCount} words, {charCount} characters
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              id="notepad-text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start typing your notes here..."
              className="min-h-[400px] font-mono"
            />

            <div className="flex gap-2">
              <Button onClick={saveNote} className="gap-2 flex-1">
                <FloppyDisk size={20} />
                Save Note
              </Button>
              <Button onClick={clearNote} variant="outline" className="gap-2">
                <Trash size={20} />
                Clear
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-semibold mb-1">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your notes are saved locally in your browser</li>
                <li>Click "Save Note" to store your text</li>
                <li>Notes persist between sessions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

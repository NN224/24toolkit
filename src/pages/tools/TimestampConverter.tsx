import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Trash, Calendar, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [readable, setReadable] = useState('')
  const [mode, setMode] = useState<'toReadable' | 'toTimestamp'>('toReadable')

  const handleToReadable = () => {
    if (!timestamp.trim()) {
      toast.error('Please enter a Unix timestamp')
      return
    }

    try {
      const ts = parseInt(timestamp)
      if (isNaN(ts)) {
        toast.error('Invalid timestamp')
        return
      }

      const date = new Date(ts * 1000)
      setReadable(date.toISOString())
      toast.success('Converted to readable date!')
    } catch (error) {
      toast.error('Failed to convert timestamp')
    }
  }

  const handleToTimestamp = () => {
    if (!readable.trim()) {
      toast.error('Please enter a date')
      return
    }

    try {
      const date = new Date(readable)
      if (isNaN(date.getTime())) {
        toast.error('Invalid date format')
        return
      }

      const ts = Math.floor(date.getTime() / 1000)
      setTimestamp(ts.toString())
      toast.success('Converted to Unix timestamp!')
    } catch (error) {
      toast.error('Failed to convert date')
    }
  }

  const handleCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
    setReadable(new Date().toISOString())
    toast.success('Current time loaded!')
  }

  const handleClear = () => {
    setTimestamp('')
    setReadable('')
    toast.success('Cleared')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      return {
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        unix: Math.floor(date.getTime() / 1000)
      }
    } catch {
      return null
    }
  }

  const formatted = readable ? formatDate(readable) : null

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            Timestamp Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert between Unix timestamps and human-readable dates
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={handleCurrentTime} variant="outline" className="flex-1">
                <Clock size={18} className="mr-2" />
                Current Time
              </Button>
              <Button onClick={handleClear} variant="outline">
                <Trash size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Unix Timestamp
              </CardTitle>
              <CardDescription>Seconds since January 1, 1970 UTC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp (seconds)</Label>
                <Input
                  id="timestamp"
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="e.g., 1672531200"
                  className="font-mono"
                />
              </div>

              <Button onClick={handleToReadable} className="w-full">
                Convert to Date →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Human-Readable Date
              </CardTitle>
              <CardDescription>ISO 8601 format or any valid date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="readable">Date</Label>
                <Input
                  id="readable"
                  type="text"
                  value={readable}
                  onChange={(e) => setReadable(e.target.value)}
                  placeholder="e.g., 2024-01-01 or 2024-01-01T00:00:00Z"
                  className="font-mono"
                />
              </div>

              <Button onClick={handleToTimestamp} className="w-full">
                ← Convert to Timestamp
              </Button>
            </CardContent>
          </Card>
        </div>

        {formatted && (
          <Card>
            <CardHeader>
              <CardTitle>All Formats</CardTitle>
              <CardDescription>Various date/time representations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Unix Timestamp', value: formatted.unix.toString(), key: 'unix' },
                  { label: 'ISO 8601', value: formatted.iso, key: 'iso' },
                  { label: 'UTC String', value: formatted.utc, key: 'utc' },
                  { label: 'Local String', value: formatted.local, key: 'local' },
                  { label: 'Date Only', value: formatted.date, key: 'date' },
                  { label: 'Time Only', value: formatted.time, key: 'time' }
                ].map((format) => (
                  <div key={format.key} className="flex items-center gap-2 p-3 bg-muted rounded-lg group">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">{format.label}</div>
                      <div className="text-sm font-mono">{format.value}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await navigator.clipboard.writeText(format.value)
                        toast.success('Copied!')
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

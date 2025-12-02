import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function DailyPlannerTemplate() {
  // Set SEO metadata
  const metadata = getPageMetadata('daily-planner-template')
  useSEO({ ...metadata, canonicalPath: '/tools/daily-planner-template' })

  const { t } = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const generateTemplate = () => {
    const selectedDate = new Date(date)
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    return `📅 DAILY PLANNER
${dayName}, ${formattedDate}

🎯 TODAY'S TOP 3 PRIORITIES:
1. _________________________________
2. _________________________________
3. _________________________________

⏰ SCHEDULE:
08:00 AM - __________________
09:00 AM - __________________
10:00 AM - __________________
11:00 AM - __________________
12:00 PM - __________________
01:00 PM - __________________
02:00 PM - __________________
03:00 PM - __________________
04:00 PM - __________________
05:00 PM - __________________

📋 TO-DO LIST:
☐ _________________________________
☐ _________________________________
☐ _________________________________
☐ _________________________________
☐ _________________________________

💡 NOTES & IDEAS:
_____________________________________
_____________________________________
_____________________________________

🙏 GRATITUDE:
Today I'm grateful for:
_____________________________________
_____________________________________

✨ WINS FOR TODAY:
_____________________________________
_____________________________________`
  }

  const template = generateTemplate()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template)
      toast.success(t('tools.dailyPlannerTemplate.templateCopied'))
    } catch {
      toast.error(t('tools.dailyPlannerTemplate.copyFailed'))
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('tools.dailyPlannerTemplate.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tools.dailyPlannerTemplate.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tools.dailyPlannerTemplate.selectDate')}</CardTitle>
              <CardDescription>
                {t('tools.dailyPlannerTemplate.selectDateDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tools.dailyPlannerTemplate.dailyPlannerTemplate')}</CardTitle>
              <CardDescription>
                {t('tools.dailyPlannerTemplate.copyAndPaste')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={template}
                readOnly
                className="min-h-[600px] font-mono text-sm"
              />

              <Button onClick={handleCopy} className="w-full gap-2" size="lg">
                <Copy size={20} />
                {t('tools.dailyPlannerTemplate.copyTemplate')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

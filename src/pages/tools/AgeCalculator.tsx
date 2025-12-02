import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@phosphor-icons/react'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function AgeCalculator() {
  const { t } = useTranslation()
  
  // Set SEO metadata
  const metadata = getPageMetadata('age-calculator')
  useSEO({ ...metadata, canonicalPath: '/tools/age-calculator' })

  const [birthDate, setBirthDate] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [ageResult, setAgeResult] = useState<{
    years: number
    months: number
    days: number
    totalDays: number
    totalHours: number
    nextBirthday: string
  } | null>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const target = targetDate ? new Date(targetDate) : new Date()

    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalHours = totalDays * 24

    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < target) {
      nextBirthday.setFullYear(target.getFullYear() + 1)
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      nextBirthday: `${daysToNextBirthday} days`
    })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
            <Calendar size={24} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t('tools.ageCalculator.name')}</h1>
            <p className="text-muted-foreground">{t('tools.ageCalculator.description')}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tools.common.calculate')} {t('tools.ageCalculator.age')}</CardTitle>
          <CardDescription>{t('tools.ageCalculator.enterBirthDate')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birth-date">{t('tools.ageCalculator.birthDate')}</Label>
              <Input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-date">{t('tools.ageCalculator.targetDate')}</Label>
              <Input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder={t('tools.ageCalculator.leaveEmptyForToday')}
              />
            </div>
          </div>
          <Button onClick={calculateAge} className="w-full" disabled={!birthDate}>
            {t('tools.common.calculate')} {t('tools.ageCalculator.age')}
          </Button>

          {ageResult && (
            <div className="space-y-4 mt-6">
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg text-center border border-blue-200">
                <p className="text-sm text-muted-foreground mb-2">{t('tools.ageCalculator.yourAge')}</p>
                <p className="text-4xl font-bold text-foreground">
                  {ageResult.years} {t('tools.ageCalculator.years')}
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {ageResult.months} {t('tools.ageCalculator.months')}, {ageResult.days} {t('tools.ageCalculator.days')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card rounded-lg border text-center">
                  <p className="text-2xl font-bold text-foreground">{ageResult.totalDays.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{t('tools.ageCalculator.totalDays')}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border text-center">
                  <p className="text-2xl font-bold text-foreground">{ageResult.totalHours.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{t('tools.ageCalculator.totalHours')}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border text-center">
                  <p className="text-2xl font-bold text-foreground">{ageResult.nextBirthday}</p>
                  <p className="text-sm text-muted-foreground">{t('tools.ageCalculator.toNextBirthday')}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

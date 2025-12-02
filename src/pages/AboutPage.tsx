import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkle, Code, Lightning, Globe } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function AboutPage() {
  const { t } = useTranslation()
  // Set SEO metadata for about page
  const aboutMetadata = getPageMetadata('about')
  useSEO({ ...aboutMetadata, canonicalPath: '/about' })
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">
            {t('about.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkle size={24} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-2xl">{t('about.mission')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.missionDesc')}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                  <Lightning size={20} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-lg">{t('about.features.fast')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('about.features.fastDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                  <Globe size={20} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-lg">{t('about.features.privacy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('about.features.privacyDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <Code size={20} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-lg">{t('about.features.open')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('about.features.openDesc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">{t('about.whatMakesUsDifferent')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">{t('about.differences.noSignup')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('about.differences.noSignupDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">{t('about.differences.aiPowered')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('about.differences.aiPoweredDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">{t('about.differences.alwaysFree')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('about.differences.alwaysFreeDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">{t('about.differences.crossPlatform')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('about.differences.crossPlatformDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('about.ourTools')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-2">✨ {t('categories.ai')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('about.aiToolsList')}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">🛠️ {t('categories.all')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('about.essentialToolsList')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Sparkle size={20} weight="fill" />
              {t('common.exploreTools')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

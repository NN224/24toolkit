import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  // Set SEO metadata for privacy policy page
  const privacyMetadata = getPageMetadata('privacyPolicy')
  useSEO({ ...privacyMetadata, canonicalPath: '/privacy-policy' })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft size={16} className="ltr:mr-2 rtl:ml-2 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 transition-transform" />
              {t('common.backToHome')}
            </Button>
          </Link>

          <div className="glass-card rounded-2xl p-8 md:p-12 border border-border/50">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                {t('privacyPolicy.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('legal.lastUpdated')}: {new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.introduction.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('privacyPolicy.sections.introduction.p1')}</p>
                  <p>{t('privacyPolicy.sections.introduction.p2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.dataCollection.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p className="font-medium text-foreground">{t('privacyPolicy.sections.dataCollection.priority')}</p>
                  <p>
                    <strong>{t('privacyPolicy.sections.dataCollection.clientSide')}</strong> {t('privacyPolicy.sections.dataCollection.clientSideDesc')}
                  </p>
                  <p>
                    <strong>{t('privacyPolicy.sections.dataCollection.noStorage')}</strong> {t('privacyPolicy.sections.dataCollection.noStorageDesc')}
                  </p>
                  <p>
                    <strong>{t('privacyPolicy.sections.dataCollection.aiTools')}</strong> {t('privacyPolicy.sections.dataCollection.aiToolsDesc')}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.cookies.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    <strong>{t('privacyPolicy.sections.cookies.analytics')}</strong> {t('privacyPolicy.sections.cookies.analyticsDesc')}
                  </p>
                  <p>
                    <strong>{t('privacyPolicy.sections.cookies.essential')}</strong> {t('privacyPolicy.sections.cookies.essentialDesc')}
                  </p>
                  <p>
                    <strong>{t('privacyPolicy.sections.cookies.optOut')}</strong> {t('privacyPolicy.sections.cookies.optOutDesc')}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.thirdParty.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('privacyPolicy.sections.thirdParty.desc')}</p>
                  <p>
                    <strong>{t('privacyPolicy.sections.thirdParty.advertising')}</strong> {t('privacyPolicy.sections.thirdParty.advertisingDesc')}
                  </p>
                  <p>{t('privacyPolicy.sections.thirdParty.review')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{t('privacyPolicy.sections.thirdParty.links.googlePrivacy')}</a></li>
                    <li><a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{t('privacyPolicy.sections.thirdParty.links.googleAds')}</a></li>
                    <li><a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{t('privacyPolicy.sections.thirdParty.links.googleAnalytics')}</a></li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.rights.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('privacyPolicy.sections.rights.desc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('privacyPolicy.sections.rights.disableCookies')}</li>
                    <li>{t('privacyPolicy.sections.rights.optOutAds')}</li>
                    <li>{t('privacyPolicy.sections.rights.contactUs')}</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.children.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('privacyPolicy.sections.children.desc')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.changes.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('privacyPolicy.sections.changes.p1')}</p>
                  <p>{t('privacyPolicy.sections.changes.p2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('privacyPolicy.sections.contact.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('privacyPolicy.sections.contact.desc')}</p>
                  <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
                    <p className="font-medium mb-2">{t('privacyPolicy.sections.contact.info')}</p>
                    <p>Email: <a href="mailto:privacy@24toolkit.com" className="text-accent hover:underline">privacy@24toolkit.com</a></p>
                    <p className="mt-4">
                      {t('privacyPolicy.sections.contact.orVisit')} <Link to="/contact" className="text-accent hover:underline">{t('header.contact')}</Link>
                    </p>
                  </div>
                </div>
              </section>

              <div className="pt-8 mt-8 border-t border-border/30">
                <p className="text-sm text-muted-foreground text-center">
                  {t('privacyPolicy.sections.thanks')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {t('legal.returnTo24Toolkit')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

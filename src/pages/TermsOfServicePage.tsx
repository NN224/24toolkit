import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TermsOfServicePage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  // Set SEO metadata for terms of service page
  const termsMetadata = getPageMetadata('termsOfService')
  useSEO(termsMetadata)

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
                {t('termsOfService.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('legal.lastUpdated')}: {new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.acceptance.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.acceptance.p1')}</p>
                  <p>{t('termsOfService.sections.acceptance.p2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.description.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.description.desc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.description.items.text')}</li>
                    <li>{t('termsOfService.sections.description.items.image')}</li>
                    <li>{t('termsOfService.sections.description.items.code')}</li>
                    <li>{t('termsOfService.sections.description.items.calculator')}</li>
                    <li>{t('termsOfService.sections.description.items.ai')}</li>
                    <li>{t('termsOfService.sections.description.items.security')}</li>
                    <li>{t('termsOfService.sections.description.items.productivity')}</li>
                  </ul>
                  <p className="mt-4">{t('termsOfService.sections.description.note')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.permitted.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.permitted.desc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.permitted.items.violateLaw')}</li>
                    <li>{t('termsOfService.sections.permitted.items.unauthorized')}</li>
                    <li>{t('termsOfService.sections.permitted.items.malware')}</li>
                    <li>{t('termsOfService.sections.permitted.items.disrupt')}</li>
                    <li>{t('termsOfService.sections.permitted.items.bots')}</li>
                    <li>{t('termsOfService.sections.permitted.items.impersonate')}</li>
                    <li>{t('termsOfService.sections.permitted.items.harass')}</li>
                    <li>{t('termsOfService.sections.permitted.items.reproduce')}</li>
                  </ul>
                  <p className="mt-4">{t('termsOfService.sections.permitted.reserve')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.ip.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.ip.p1')}</p>
                  <p>
                    <strong>{t('termsOfService.sections.ip.openSource')}</strong> {t('termsOfService.sections.ip.openSourceDesc')}
                  </p>
                  <p>{t('termsOfService.sections.ip.mayNot')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.ip.items.useBrand')}</li>
                    <li>{t('termsOfService.sections.ip.items.derivative')}</li>
                    <li>{t('termsOfService.sections.ip.items.remove')}</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.ugc.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.ugc.p1')}</p>
                  <p>{t('termsOfService.sections.ugc.confirm')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.ugc.items.own')}</li>
                    <li>{t('termsOfService.sections.ugc.items.noViolate')}</li>
                    <li>{t('termsOfService.sections.ugc.items.notIllegal')}</li>
                  </ul>
                  <p className="mt-4">{t('termsOfService.sections.ugc.noOwnership')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.liability.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p className="font-medium text-foreground">{t('termsOfService.sections.liability.important')}</p>
                  <p>{t('termsOfService.sections.liability.asIs')}</p>
                  <p><strong>{t('termsOfService.sections.liability.noWarranty')}</strong> {t('termsOfService.sections.liability.noWarrantyDesc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.liability.warrantyItems.uninterrupted')}</li>
                    <li>{t('termsOfService.sections.liability.warrantyItems.accurate')}</li>
                    <li>{t('termsOfService.sections.liability.warrantyItems.quality')}</li>
                    <li>{t('termsOfService.sections.liability.warrantyItems.errors')}</li>
                  </ul>
                  <p className="mt-4"><strong>{t('termsOfService.sections.liability.limitation')}</strong> {t('termsOfService.sections.liability.limitationDesc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.liability.limitationItems.loss')}</li>
                    <li>{t('termsOfService.sections.liability.limitationItems.interruption')}</li>
                    <li>{t('termsOfService.sections.liability.limitationItems.errors')}</li>
                    <li>{t('termsOfService.sections.liability.limitationItems.unauthorized')}</li>
                    <li>{t('termsOfService.sections.liability.limitationItems.other')}</li>
                  </ul>
                  <p className="mt-4">{t('termsOfService.sections.liability.acknowledge')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.thirdParty.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.thirdParty.p1')}</p>
                  <p>{t('termsOfService.sections.thirdParty.p2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.indemnification.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.indemnification.desc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('termsOfService.sections.indemnification.items.use')}</li>
                    <li>{t('termsOfService.sections.indemnification.items.violation')}</li>
                    <li>{t('termsOfService.sections.indemnification.items.thirdParty')}</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.modifications.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.modifications.p1')}</p>
                  <p>{t('termsOfService.sections.modifications.p2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.changes.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.changes.p1')}</p>
                  <p>{t('termsOfService.sections.changes.p2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.governing.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.governing.desc')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">{t('termsOfService.sections.contact.title')}</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>{t('termsOfService.sections.contact.desc')}</p>
                  <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
                    <p className="font-medium mb-2">{t('termsOfService.sections.contact.info')}</p>
                    <p>Email: <a href="mailto:legal@24toolkit.com" className="text-accent hover:underline">legal@24toolkit.com</a></p>
                    <p className="mt-4">
                      {t('termsOfService.sections.contact.orVisit')} <Link to="/contact" className="text-accent hover:underline">{t('header.contact')}</Link>
                    </p>
                  </div>
                </div>
              </section>

              <div className="pt-8 mt-8 border-t border-border/30">
                <p className="text-sm text-muted-foreground text-center">
                  {t('termsOfService.sections.acknowledgment')}
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

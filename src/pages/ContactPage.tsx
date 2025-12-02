import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, PaperPlaneTilt, GithubLogo, TwitterLogo, YoutubeLogo, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { t } = useTranslation()
  
  // Set SEO metadata for contact page
  const contactMetadata = getPageMetadata('contact')
  useSEO({ ...contactMetadata, canonicalPath: '/contact' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('contact.fillAllFields'))
      return
    }

    if (!formData.email.includes('@')) {
      toast.error(t('contact.validEmail'))
      return
    }

    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)
    toast.success(t('contact.messageSentSuccess'))

    setTimeout(() => {
      setShowSuccess(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

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

          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            >
              {t('contact.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg"
            >
              {t('contact.subtitle')}
            </motion.p>
          </div>

          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-sky-500/20 to-purple-600/20 blur-3xl" />
            <div className="relative h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-8 border border-border/50"
            >
              <h2 className="text-2xl font-semibold text-accent mb-6">{t('contact.sendMessage')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-foreground mb-2">{t('contact.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('contact.namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-muted/20 border-border/50 focus:border-accent transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground mb-2">{t('contact.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-muted/20 border-border/50 focus:border-accent transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground mb-2">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="bg-muted/20 border-border/50 focus:border-accent transition-colors resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span
                        key="submitting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {t('contact.sending')}
                      </motion.span>
                    ) : showSuccess ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle size={20} weight="fill" />
                        {t('contact.messageSent')}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <PaperPlaneTilt size={20} weight="fill" />
                        {t('contact.sendMessageBtn')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-2xl p-8 border border-border/50">
                <h2 className="text-2xl font-semibold text-accent mb-6">{t('contact.connectWithUs')}</h2>
                
                <div className="space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    {t('contact.followUs')}
                  </p>

                  <div className="flex flex-col gap-3 pt-4">
                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-accent/50 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-sky-500/20 group-hover:from-purple-600/30 group-hover:to-sky-500/30 transition-colors">
                        <GithubLogo size={24} weight="fill" className="text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t('contact.github')}</p>
                        <p className="text-sm text-muted-foreground">{t('contact.githubDesc')}</p>
                      </div>
                    </motion.a>

                    <motion.a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-accent/50 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-sky-500/20 group-hover:from-purple-600/30 group-hover:to-sky-500/30 transition-colors">
                        <TwitterLogo size={24} weight="fill" className="text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t('contact.twitter')}</p>
                        <p className="text-sm text-muted-foreground">{t('contact.twitterDesc')}</p>
                      </div>
                    </motion.a>

                    <motion.a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-accent/50 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-sky-500/20 group-hover:from-purple-600/30 group-hover:to-sky-500/30 transition-colors">
                        <YoutubeLogo size={24} weight="fill" className="text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t('contact.youtube')}</p>
                        <p className="text-sm text-muted-foreground">{t('contact.youtubeDesc')}</p>
                      </div>
                    </motion.a>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8 border border-border/50">
                <h3 className="text-xl font-semibold text-accent mb-4">{t('contact.emailUs')}</h3>
                <div className="space-y-3 text-foreground/80">
                  <p>
                    <strong className="text-foreground">{t('contact.generalInquiries')}</strong><br />
                    <a href="mailto:hello@24toolkit.com" className="text-accent hover:underline">
                      hello@24toolkit.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.support')}</strong><br />
                    <a href="mailto:support@24toolkit.com" className="text-accent hover:underline">
                      support@24toolkit.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">{t('contact.business')}</strong><br />
                    <a href="mailto:business@24toolkit.com" className="text-accent hover:underline">
                      business@24toolkit.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-8 border border-border/50 text-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('contact.quickResponse')}</h3>
            <p className="text-muted-foreground">
              {t('contact.quickResponseDesc')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

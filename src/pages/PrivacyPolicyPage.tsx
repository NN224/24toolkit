import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function PrivacyPolicyPage() {
  // Set SEO metadata for privacy policy page
  const privacyMetadata = getPageMetadata('privacyPolicy')
  useSEO(privacyMetadata)

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
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <div className="glass-card rounded-2xl p-8 md:p-12 border border-border/50">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">1. Introduction</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Welcome to 24Toolkit. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This policy outlines our practices regarding the collection, use, and disclosure of your information when you use our service.
                  </p>
                  <p>
                    24Toolkit provides over 80 free online tools designed to enhance your productivity. We believe in transparency and your right to privacy, which is why we've designed our tools to work entirely in your browser whenever possible.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">2. Data Collection</h2>
                <div className="space-y-4 leading-relaxed">
                  <p className="font-medium text-foreground">We prioritize your privacy above all else.</p>
                  <p>
                    <strong>Client-Side Processing:</strong> The vast majority of our tools operate entirely within your web browser. This means your data never leaves your device. Files you upload, text you enter, and calculations you perform are processed locally on your machine.
                  </p>
                  <p>
                    <strong>No Personal Data Storage:</strong> We do not store, collect, or retain any personal information, files, or content that you process through our tools. Each session is independent, and once you close your browser or navigate away, your data is gone.
                  </p>
                  <p>
                    <strong>AI-Powered Tools:</strong> Some of our AI features (such as the AI Translator, AI Email Writer, and AI Hashtag Generator) require server-side processing. For these tools, your input is temporarily transmitted to our secure servers and immediately processed. We do not log, store, or use this data for any purpose beyond providing you with the requested result.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">3. Cookies and Analytics</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    <strong>Google Analytics:</strong> We use Google Analytics 4 to understand how visitors use our site. This helps us improve the user experience and identify which tools are most valuable. The data collected is anonymized and includes information such as page views, session duration, and general geographic location (country/region level only). Google Analytics may use cookies to collect this information.
                  </p>
                  <p>
                    <strong>Essential Cookies:</strong> We use minimal cookies to remember your theme preferences (Dark, Cyber, or Minimal mode) and improve your browsing experience. These cookies do not track you across the web.
                  </p>
                  <p>
                    <strong>Opt-Out:</strong> You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Analytics Opt-out Browser Add-on</a> or by disabling cookies in your browser settings.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">4. Third-Party Services</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    To maintain our free service and continue developing new tools, we display advertisements through Google AdSense. Google AdSense uses cookies and web beacons to display personalized ads based on your browsing habits across the web. These ads help us keep our tools 100% free for all users.
                  </p>
                  <p>
                    <strong>Third-Party Advertising:</strong> We use Google AdSense to serve ads on our website. Google may use the DART cookie and other technologies to serve ads based on your visits to this site and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Ads Settings</a> or <a href="http://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">aboutads.info</a>.
                  </p>
                  <p>
                    We carefully vet all third-party services to ensure they meet high privacy standards. We recommend reviewing their privacy policies:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Privacy Policy</a></li>
                    <li><a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">How Google Uses Advertising</a></li>
                    <li><a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Analytics Privacy</a></li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">5. Your Rights</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>Since we don't collect or store personal data, there's no personal information to access, modify, or delete. However, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Disable cookies in your browser settings</li>
                    <li>Opt out of personalized advertising</li>
                    <li>Contact us with any privacy concerns or questions</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">6. Children's Privacy</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">7. Changes to This Policy</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any significant changes by updating the "Last Updated" date at the top of this policy.
                  </p>
                  <p>
                    We encourage you to review this policy periodically to stay informed about how we're protecting your information.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">8. Contact Us</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    If you have any questions, concerns, or feedback about this Privacy Policy or our privacy practices, please don't hesitate to reach out:
                  </p>
                  <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
                    <p className="font-medium mb-2">Contact Information:</p>
                    <p>Email: <a href="mailto:privacy@24toolkit.com" className="text-accent hover:underline">privacy@24toolkit.com</a></p>
                    <p className="mt-4">
                      Or visit our <Link to="/contact" className="text-accent hover:underline">Contact Page</Link> to send us a message directly.
                    </p>
                  </div>
                </div>
              </section>

              <div className="pt-8 mt-8 border-t border-border/30">
                <p className="text-sm text-muted-foreground text-center">
                  Thank you for trusting 24Toolkit. Your privacy is our priority.
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
                Return to 24Toolkit
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

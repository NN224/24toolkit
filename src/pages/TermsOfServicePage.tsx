import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function TermsOfServicePage() {
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
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <div className="glass-card rounded-2xl p-8 md:p-12 border border-border/50">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">1. Acceptance of Terms</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    By accessing and using 24Toolkit ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                  </p>
                  <p>
                    These terms apply to all visitors, users, and others who access or use the Service. We reserve the right to update, change, or replace any part of these Terms of Service by posting updates on this page. It is your responsibility to check this page periodically for changes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">2. Description of Service</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    24Toolkit provides a collection of over 80 free online tools designed to help users with various tasks including, but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Text processing and formatting utilities</li>
                    <li>Image editing and manipulation tools</li>
                    <li>Code formatting and development tools</li>
                    <li>Calculator and conversion utilities</li>
                    <li>AI-powered content generation tools</li>
                    <li>Security and encryption utilities</li>
                    <li>Productivity and organizational tools</li>
                  </ul>
                  <p className="mt-4">
                    Most tools operate entirely within your browser, while some AI-powered features require server-side processing. We strive to provide accurate, reliable, and secure tools, but we make no guarantees regarding the accuracy or suitability of results for any particular purpose.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">3. Permitted Usage</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>You agree to use 24Toolkit only for lawful purposes. You are prohibited from:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Using the Service to violate any local, state, national, or international law</li>
                    <li>Attempting to gain unauthorized access to any part of the Service or related systems</li>
                    <li>Introducing viruses, malware, or any other malicious code</li>
                    <li>Attempting to interfere with, disrupt, or overload the Service</li>
                    <li>Using automated systems (bots, scrapers) to access the Service without permission</li>
                    <li>Impersonating any person or entity, or falsely claiming an affiliation</li>
                    <li>Using the Service to harass, abuse, or harm another person</li>
                    <li>Reproducing, duplicating, or copying any part of the Service for commercial purposes without express written permission</li>
                  </ul>
                  <p className="mt-4">
                    We reserve the right to terminate or restrict your access to the Service if we believe you have violated these terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">4. Intellectual Property & Brand Usage</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    The Service and its original content, features, functionality, design, code, and branding (including but not limited to the "24Toolkit" name, logo, and visual identity) are and will remain the exclusive property of 24Toolkit and its licensors.
                  </p>
                  <p>
                    <strong>Open Source:</strong> While certain components of the Service may be based on open-source libraries and tools (which are governed by their respective licenses), the 24Toolkit platform as a whole, including its unique design, branding, and proprietary features, is protected by copyright and trademark laws.
                  </p>
                  <p>
                    You may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the "24Toolkit" name, logo, or branding without written permission</li>
                    <li>Create derivative works or competing services based on 24Toolkit</li>
                    <li>Remove or alter any copyright, trademark, or proprietary notices</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">5. User-Generated Content</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    While most tools process data locally in your browser, you may occasionally upload or submit content (such as images, text, or files) to our servers for processing by AI-powered tools.
                  </p>
                  <p>
                    By submitting content, you confirm that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You own the content or have the necessary rights and permissions to use it</li>
                    <li>The content does not violate any third-party rights (copyright, trademark, privacy, etc.)</li>
                    <li>The content is not illegal, harmful, threatening, abusive, or otherwise objectionable</li>
                  </ul>
                  <p className="mt-4">
                    We do not claim ownership of your content. However, by using the Service, you grant us a temporary, non-exclusive license to process your content solely for the purpose of providing the requested service. As stated in our Privacy Policy, we do not store or retain user content beyond the immediate processing period.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">6. Limitation of Liability</h2>
                <div className="space-y-4 leading-relaxed">
                  <p className="font-medium text-foreground">
                    IMPORTANT: PLEASE READ THIS SECTION CAREFULLY.
                  </p>
                  <p>
                    The Service is provided on an "AS IS" and "AS AVAILABLE" basis. 24Toolkit makes no warranties, expressed or implied, regarding the Service's operation, availability, accuracy, reliability, or suitability for any particular purpose.
                  </p>
                  <p>
                    <strong>No Warranty:</strong> We do not guarantee that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                    <li>Results obtained from the Service will be accurate or reliable</li>
                    <li>The quality of any tools or output will meet your expectations</li>
                    <li>Any errors in the Service will be corrected</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Limitation of Liability:</strong> To the fullest extent permitted by law, 24Toolkit, its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Loss of profits, data, or goodwill</li>
                    <li>Service interruption or unavailability</li>
                    <li>Errors or inaccuracies in results</li>
                    <li>Unauthorized access to your data</li>
                    <li>Any other damages arising from your use of the Service</li>
                  </ul>
                  <p className="mt-4">
                    You acknowledge that you use the Service at your own risk. Always verify critical results independently, and do not rely solely on our tools for decisions that could result in financial loss, legal liability, or harm.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">7. Third-Party Links and Services</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Our Service may contain links to third-party websites or services that are not owned or controlled by 24Toolkit. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.
                  </p>
                  <p>
                    We strongly advise you to review the terms and privacy policies of any third-party sites you visit.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">8. Indemnification</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    You agree to defend, indemnify, and hold harmless 24Toolkit, its owners, employees, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney's fees) arising from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your use of the Service</li>
                    <li>Your violation of these Terms of Service</li>
                    <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">9. Service Modifications and Termination</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
                  </p>
                  <p>
                    We may also impose limits on certain features or restrict your access to parts or all of the Service without notice or liability.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">10. Changes to Terms</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    We reserve the right to update or modify these Terms of Service at any time. When we do, we will revise the "Last Updated" date at the top of this page. Continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
                  </p>
                  <p>
                    We encourage you to review these terms periodically to stay informed of any updates.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">11. Governing Law</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions. Your use of the Service may also be subject to other local, state, national, or international laws.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-accent mb-4">12. Contact Information</h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
                    <p className="font-medium mb-2">Contact Information:</p>
                    <p>Email: <a href="mailto:legal@24toolkit.com" className="text-accent hover:underline">legal@24toolkit.com</a></p>
                    <p className="mt-4">
                      Or visit our <Link to="/contact" className="text-accent hover:underline">Contact Page</Link> to send us a message.
                    </p>
                  </div>
                </div>
              </section>

              <div className="pt-8 mt-8 border-t border-border/30">
                <p className="text-sm text-muted-foreground text-center">
                  By using 24Toolkit, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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

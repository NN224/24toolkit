import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkle, Code, Lightning, Globe } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function AboutPage() {
  // Set SEO metadata for about page
  const aboutMetadata = getPageMetadata('about')
  useSEO(aboutMetadata)
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">
            About 24Toolkit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one free online toolkit powered by AI and open web technology
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkle size={24} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                24Toolkit was created to provide everyone with free, powerful, and easy-to-use online tools. 
                Whether you're a student, professional, developer, or creative, we believe essential utilities 
                should be accessible to all without barriers, subscriptions, or complicated interfaces.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                  <Lightning size={20} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-lg">Fast & Efficient</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All tools run directly in your browser with instant results. No waiting, no uploads to servers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                  <Globe size={20} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-lg">Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your data never leaves your device. Everything processes locally for maximum privacy and security.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <Code size={20} weight="fill" className="text-white" />
                </div>
                <CardTitle className="text-lg">Open Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built with modern web standards and open-source technologies that work across all devices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">What Makes Us Different</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">No Sign-Up Required</p>
                    <p className="text-sm text-muted-foreground">
                      Jump straight into any tool without creating an account or providing personal information.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">AI-Powered Innovation</p>
                    <p className="text-sm text-muted-foreground">
                      Leverage cutting-edge AI technology for text summarization, code explanation, image captions, and more.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Always Free</p>
                    <p className="text-sm text-muted-foreground">
                      All tools are completely free with no hidden costs, premium tiers, or feature limitations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Cross-Platform</p>
                    <p className="text-sm text-muted-foreground">
                      Works seamlessly on desktop, tablet, and mobile devices with responsive design.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Our Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground mb-2">✨ AI-Powered Tools</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Text Summarizer, Paragraph Rewriter, Code Formatter & Explainer, Image Caption Generator, and AI Chat Assistant.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">🛠️ Essential Utilities</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Word Counter, Password Generator, QR Code Generator, JSON/CSV Converter, Image Compressor, 
                    Text to Speech, PDF to Word, Color Picker, OCR, and Unit Converter.
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
              Explore All Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

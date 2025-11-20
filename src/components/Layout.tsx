import { Outlet, Link } from 'react-router-dom'
import { GithubLogo, TwitterLogo, YoutubeLogo } from '@phosphor-icons/react'
import FuturisticSidebar from './FuturisticSidebar'
import FuturisticHeader from './FuturisticHeader'
import FloatingChatAssistant from './ai/ChatAssistant'
import { ThemeProvider } from './ThemeProvider'
import AdSense from './AdSense'

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
            }}
          />
        </div>
        
        <FuturisticSidebar />
        <FuturisticHeader />
        
        <main className="relative lg:ml-20 pt-20 min-h-screen">
          {/* Top Ad Unit */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AdSense slot="1234567890" format="horizontal" className="mb-6" />
          </div>
          
          <Outlet />
          
          {/* Bottom Ad Unit */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AdSense slot="0987654321" format="horizontal" className="mt-6" />
          </div>
        </main>

        <footer className="relative lg:ml-20 border-t border-border/50 bg-card/30 backdrop-blur-xl mt-20 opacity-70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground font-medium">
                  © 2025 24Toolkit. All rights reserved.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Free tools for everyone, forever.
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="GitHub"
                >
                  <GithubLogo size={22} weight="fill" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="X (Twitter)"
                >
                  <TwitterLogo size={22} weight="fill" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeLogo size={22} weight="fill" />
                </a>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/70 border-t border-border/30 pt-6">
              <Link to="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-accent transition-colors">
                Contact
              </Link>
              <span>•</span>
              <Link to="/about" className="hover:text-accent transition-colors">
                About
              </Link>
              <span>•</span>
              <Link to="/sitemap" className="hover:text-accent transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </footer>

        <FloatingChatAssistant />
      </div>
    </ThemeProvider>
  )
}

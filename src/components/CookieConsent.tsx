import { useState, useEffect } from 'react';
import { X, Cookie } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_EXPIRY = 365; // days

interface ConsentState {
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    
    if (savedConsent) {
      try {
        const consent: ConsentState = JSON.parse(savedConsent);
        const daysSinceConsent = (Date.now() - consent.timestamp) / (1000 * 60 * 60 * 24);
        
        // Show banner again after expiry period
        if (daysSinceConsent > CONSENT_EXPIRY) {
          setIsVisible(true);
        }
      } catch (error) {
        // Invalid data, show banner
        setIsVisible(true);
      }
    } else {
      // No consent saved, show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (analytics: boolean, advertising: boolean) => {
    const consent: ConsentState = {
      analytics,
      advertising,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    
    // Dispatch event for Analytics component to listen
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { 
      detail: consent 
    }));
    
    setIsVisible(false);
  };

  const acceptAll = () => {
    saveConsent(true, true);
  };

  const acceptNecessary = () => {
    saveConsent(false, false);
  };

  const acceptCustom = () => {
    // For now, same as accept all. Can be extended with checkboxes
    saveConsent(true, true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Cookie size={24} weight="bold" className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    🍪 Cookie Settings
                  </p>
                </div>
              </div>
              <button
                onClick={acceptNecessary}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-foreground/90 leading-relaxed mb-3">
                We use cookies to enhance your browsing experience, serve personalized ads or content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
              
              {showDetails && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/30 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      🔒 Essential Cookies (Always Active)
                    </p>
                    <p className="text-muted-foreground">
                      Required for basic site functionality like theme preferences and security.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      📊 Analytics Cookies
                    </p>
                    <p className="text-muted-foreground">
                      Help us understand how visitors use our site to improve user experience.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      💰 Advertising Cookies
                    </p>
                    <p className="text-muted-foreground">
                      Used to display relevant ads and measure ad campaign effectiveness.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={acceptAll}
                className="flex-1 bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:opacity-90 transition-opacity font-semibold"
                size="lg"
              >
                Accept All
              </Button>
              <Button
                onClick={acceptNecessary}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Necessary Only
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                className="flex-1"
                size="lg"
              >
                {showDetails ? 'Hide Details' : 'Customize'}
              </Button>
            </div>

            {/* Footer Links */}
            <div className="mt-4 pt-4 border-t border-border/30 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <a 
                href="https://policies.google.com/technologies/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                About Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function to check if user has given consent
export function hasConsent(type: 'analytics' | 'advertising'): boolean {
  try {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) return false;
    
    const consent: ConsentState = JSON.parse(savedConsent);
    return consent[type] === true;
  } catch {
    return false;
  }
}

// Helper function to get consent state
export function getConsentState(): ConsentState | null {
  try {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) return null;
    return JSON.parse(savedConsent);
  } catch {
    return null;
  }
}

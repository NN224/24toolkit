import { useEffect } from 'react';
import { getConsentState } from './CookieConsent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-14LLZYGXTN';

/**
 * Google Analytics 4 with Consent Mode v2
 * 
 * This component manages Google Consent Mode v2 for GA4.
 * GA4 gtag.js is loaded in index.html, this component handles consent only.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    // gtag is already initialized in index.html, just ensure it exists
    if (!window.gtag) {
      console.warn('Google Analytics: gtag not found, script may not be loaded');
      return;
    }

    // Get current consent state
    const consentState = getConsentState();
    
    // Set default consent state for GA4
    // This configures consent AFTER gtag.js loads
    window.gtag('consent', 'default', {
      'ad_storage': consentState?.advertising ? 'granted' : 'denied',
      'ad_user_data': consentState?.advertising ? 'granted' : 'denied',
      'ad_personalization': consentState?.advertising ? 'granted' : 'denied',
      'analytics_storage': consentState?.analytics ? 'granted' : 'denied'
    });

    // Enable URL passthrough for better tracking without cookies
    window.gtag('set', 'url_passthrough', true);
    
    // Redact ads data when ad_storage is denied
    window.gtag('set', 'ads_data_redaction', true);

    // Consent Mode v2 initialized

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      const consent = event.detail;
      
      // Update consent using Google Consent Mode v2 API
      window.gtag!('consent', 'update', {
        'ad_storage': consent.advertising ? 'granted' : 'denied',
        'ad_user_data': consent.advertising ? 'granted' : 'denied',
        'ad_personalization': consent.advertising ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied'
      });
      
      // Consent updated
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);

    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
    };
  }, []);

  return null;
}

// Track page views
export function trackPageView(url: string) {
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Track custom events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track tool usage
export function trackToolUsage(toolName: string, action: string = 'use') {
  trackEvent(action, 'Tool', toolName);
}

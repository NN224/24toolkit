import { useEffect } from 'react';
import { getConsentState } from './CookieConsent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Google Tag Manager Consent Mode Integration
 * 
 * This component manages Google Consent Mode v2 for GTM.
 * GTM script is loaded in index.html, this component only handles consent.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    // Initialize dataLayer if not already initialized by GTM
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    };

    // Get current consent state
    const consentState = getConsentState();
    
    // Set default consent state for GTM
    // This must be set BEFORE GTM loads (done in index.html)
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

    console.log('Google Tag Manager: Consent Mode v2 initialized');

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
      
      console.log('Google Consent Mode: Updated via GTM', consent);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);

    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
    };
  }, []);

  return null;
}

// Track page views via GTM
export function trackPageView(url: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  }
}

// Track custom events via GTM
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

// Track tool usage via GTM
export function trackToolUsage(toolName: string, action: string = 'use') {
  trackEvent(action, 'Tool', toolName);
}

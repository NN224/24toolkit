import { useEffect } from 'react';
import { getConsentState } from './CookieConsent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  useEffect(() => {
    // Only initialize if ID is configured
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      console.log('Google Analytics: Not configured');
      return;
    }

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    };

    // Get current consent state
    const consentState = getConsentState();
    
    // Set default consent state BEFORE loading Google tag
    // This is critical for Consent Mode v2
    window.gtag('consent', 'default', {
      'ad_storage': consentState?.advertising ? 'granted' : 'denied',
      'ad_user_data': consentState?.advertising ? 'granted' : 'denied',
      'ad_personalization': consentState?.advertising ? 'granted' : 'denied',
      'analytics_storage': consentState?.analytics ? 'granted' : 'denied'
    });

    // Optional: Enable URL passthrough for better tracking when cookies denied
    window.gtag('set', 'url_passthrough', true);
    
    // Optional: Redact ads data when ad_storage is denied
    window.gtag('set', 'ads_data_redaction', true);

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Google tag after script loads
      window.gtag!('js', new Date());
      window.gtag!('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
      });
      console.log('Google Analytics: Loaded with Consent Mode v2');
    };

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
      
      console.log('Google Consent Mode: Updated', consent);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);

    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
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

// Track events
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

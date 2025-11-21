import { useEffect, useRef, useState } from 'react';
import { hasConsent } from './CookieConsent';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const ADSENSE_PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

interface GoogleAdSenseProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function GoogleAdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check initial consent
    const initialConsent = hasConsent('advertising');
    setConsentGiven(initialConsent);

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      const consent = event.detail;
      setConsentGiven(consent.advertising);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);

    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    // Only load if consent is given and publisher ID is configured
    if (!consentGiven || !ADSENSE_PUBLISHER_ID || ADSENSE_PUBLISHER_ID === 'ca-pub-xxxxxxxxxxxxxxxx') {
      if (!ADSENSE_PUBLISHER_ID || ADSENSE_PUBLISHER_ID === 'ca-pub-xxxxxxxxxxxxxxxx') {
        console.log('AdSense: Not configured');
      } else if (!consentGiven) {
        console.log('AdSense: Waiting for consent');
      }
      return;
    }

    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      console.log('AdSense: Script loaded');
    }

    // Push ad to AdSense
    try {
      if (!isAdLoaded.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
        console.log('AdSense: Ad pushed');
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't render if not configured
  if (!ADSENSE_PUBLISHER_ID || ADSENSE_PUBLISHER_ID === 'ca-pub-xxxxxxxxxxxxxxxx') {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Predefined ad components for common placements
export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <GoogleAdSense
      format="horizontal"
      responsive={true}
      className={className}
      style={{ minHeight: '90px' }}
    />
  );
}

export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <GoogleAdSense
      format="vertical"
      responsive={true}
      className={className}
      style={{ minHeight: '250px', minWidth: '160px' }}
    />
  );
}

export function AdSquare({ className = '' }: { className?: string }) {
  return (
    <GoogleAdSense
      format="rectangle"
      responsive={true}
      className={className}
      style={{ minHeight: '250px', minWidth: '250px' }}
    />
  );
}

export function AdInFeed({ className = '' }: { className?: string }) {
  return (
    <GoogleAdSense
      format="fluid"
      responsive={true}
      className={className}
      style={{ minHeight: '100px' }}
    />
  );
}

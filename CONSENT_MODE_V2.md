# Google Consent Mode v2 Implementation

This document describes how 24Toolkit implements Google Consent Mode v2 for GDPR compliance.

## Overview

We use **Google Consent Mode v2** to properly manage user consent for cookies and data collection in compliance with:
- 🇪🇺 **GDPR** (General Data Protection Regulation)
- 🇨🇦 **CCPA** (California Consumer Privacy Act)
- **Google's EU User Consent Policy**

## Implementation Details

### Architecture

```
User visits site
  ↓
CookieConsent Banner appears
  ↓
gtag('consent', 'default', {...}) - Sets default to 'denied'
  ↓
Google Analytics loads (with Consent Mode)
  ↓
User interacts with banner
  ↓
gtag('consent', 'update', {...}) - Updates based on choice
  ↓
Google tags adjust behavior automatically
```

### Consent Parameters (v2)

We implement all 4 required Consent Mode v2 parameters:

| Parameter | Description | Default | User Controls |
|-----------|-------------|---------|---------------|
| `ad_storage` | Enables storage for advertising purposes | `denied` | "Accept All" / "Advertising" |
| `ad_user_data` | Sending user data to Google for advertising | `denied` | "Accept All" / "Advertising" |
| `ad_personalization` | Personalized advertising | `denied` | "Accept All" / "Advertising" |
| `analytics_storage` | Enables storage for analytics purposes | `denied` | "Accept All" / "Analytics" |

### Code Implementation

#### 1. GoogleAnalytics.tsx

```typescript
// Set default consent BEFORE loading Google tag
window.gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});

// Enable URL passthrough for better tracking without cookies
window.gtag('set', 'url_passthrough', true);

// Redact ads data when ad_storage is denied
window.gtag('set', 'ads_data_redaction', true);

// Load Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=G-14LLZYGXTN">

// Update consent when user makes choice
window.gtag('consent', 'update', {
  'ad_storage': 'granted',  // or 'denied'
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted'
});
```

#### 2. CookieConsent.tsx

Manages consent UI and stores user preferences:
- Shows banner after 1 second
- 3 options: Accept All / Necessary Only / Customize
- Saves to localStorage (expires after 365 days)
- Emits events for Analytics/AdSense to listen

#### 3. GoogleAdSense.tsx

- Loads after Consent Mode is set
- Automatically respects consent settings
- No additional consent logic needed

## Advanced Features

### 1. URL Passthrough

**Enabled:** Yes (`url_passthrough: true`)

**Purpose:** Passes ad click, client ID, and session ID information through URL parameters when cookies are denied.

**Query Parameters Used:**
- `gclid` - Google Click Identifier
- `dclid` - DoubleClick Click Identifier  
- `gclsrc` - Google Click Source
- `_gl` - Google Linker parameter
- `wbraid` - Web conversion identifier

**Benefits:**
- Better conversion tracking without cookies
- Improved measurement accuracy in cookieless mode
- Works across page navigations

### 2. Ads Data Redaction

**Enabled:** Yes (`ads_data_redaction: true`)

**Purpose:** When `ad_storage` is denied, ad click identifiers are redacted and requests go through cookieless domains.

**How it works:**
- Removes sensitive data from ad network requests
- Uses cookieless domains for ad serving
- Only affects requests when ad_storage = denied
- Does not impact when consent is granted

### 3. Region-Specific Behavior

**Current:** Applied globally (all regions)

**Can be customized:**
```typescript
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'region': ['ES', 'US-CA']  // Spain and California only
});
```

## Consent Storage

### LocalStorage Structure

```json
{
  "cookie-consent": {
    "analytics": true,
    "advertising": true,
    "timestamp": 1700000000000
  }
}
```

- **Expiry:** 365 days
- **Scope:** Per domain
- **Renewal:** Banner shows again after expiry

## User Journey

### First Visit (No Consent)

1. User lands on site
2. Banner appears after 1 second
3. Google tags load with consent = 'denied'
4. **Analytics:** Collects minimal data (no cookies)
5. **AdSense:** Shows non-personalized ads only

### After "Accept All"

1. User clicks "Accept All"
2. Consent updated: all = 'granted'
3. **Analytics:** Full tracking enabled (with cookies)
4. **AdSense:** Personalized ads enabled
5. Choice saved for 365 days

### After "Necessary Only"

1. User clicks "Necessary Only"
2. Consent remains: all = 'denied'
3. **Analytics:** Minimal tracking (no cookies)
4. **AdSense:** Non-personalized ads only
5. Choice saved for 365 days

## Compliance

### ✅ GDPR Requirements

- [x] Opt-in required for non-essential cookies
- [x] Clear information about data usage
- [x] Easy opt-out mechanism
- [x] Consent can be withdrawn anytime
- [x] Consent is freely given (no forced acceptance)
- [x] Privacy Policy linked
- [x] Data minimization when consent denied

### ✅ Google's EU User Consent Policy

- [x] Consent obtained before loading Google tags
- [x] Consent Mode v2 implemented
- [x] All 4 parameters supported
- [x] Proper consent update mechanism
- [x] Regional compliance possible

### ✅ Transparency

- Cookie types explained:
  - 🔒 Essential (always active)
  - 📊 Analytics (optional)
  - 💰 Advertising (optional)
- Links to:
  - Privacy Policy
  - Terms of Service
  - Google Cookie Policy

## Testing

### Manual Testing

1. **Clear consent:**
   ```javascript
   localStorage.removeItem('cookie-consent');
   ```

2. **Check Console:**
   ```
   Google Analytics: Loaded with Consent Mode v2
   Google Consent Mode: Updated {analytics: true, advertising: true}
   ```

3. **Verify with Google Tag Assistant:**
   - Install browser extension
   - Check consent signals are sent
   - Verify Consent Mode v2 parameters

### Automated Testing

```bash
# Open DevTools Console
# Check consent state
localStorage.getItem('cookie-consent');

# Should see:
# '{"analytics":true,"advertising":true,"timestamp":...}'
```

## Debugging

### Check Consent Mode Status

```javascript
// In browser console
dataLayer
// Should include consent commands

// Check gtag function
window.gtag
// Should be defined

// Check consent parameters
// Look for entries like:
// ['consent', 'default', {...}]
// ['consent', 'update', {...}]
```

### Verify Network Requests

1. Open DevTools → Network tab
2. Filter: `google-analytics.com` or `doubleclick.net`
3. Check request parameters include:
   - `gcs` (Google Consent State)
   - Consent signals in request headers

## Migration from v1

If you were using Consent Mode v1, you MUST upgrade to v2 by adding:

```diff
  gtag('consent', 'update', {
    'ad_storage': 'granted',
+   'ad_user_data': 'granted',
+   'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
```

**Deadline:** Required for EEA traffic (already implemented)

## Resources

### Official Documentation
- [Consent Mode Overview](https://developers.google.com/tag-platform/devguides/privacy#consent_mode_overview)
- [Consent Mode v2 Guide](https://developers.google.com/tag-platform/security/guides/consent)
- [EU User Consent Policy](https://www.google.com/about/company/user-consent-policy/)

### Implementation Files
- `src/components/GoogleAnalytics.tsx` - Consent Mode implementation
- `src/components/CookieConsent.tsx` - UI and consent management
- `src/components/GoogleAdSense.tsx` - AdSense integration
- `src/pages/PrivacyPolicyPage.tsx` - Privacy disclosures

## Support

For questions about consent implementation:
1. Check Google Tag Assistant
2. Review browser console logs
3. Verify localStorage state
4. Test with different consent choices

---

**Last Updated:** November 2024  
**Consent Mode Version:** v2  
**Implementation Status:** ✅ Complete  
**GDPR Compliant:** ✅ Yes  
**EEA Ready:** ✅ Yes

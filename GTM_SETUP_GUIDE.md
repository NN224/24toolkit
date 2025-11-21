# Google Tag Manager (GTM) Setup Guide

Complete guide for setting up Google Tag Manager with Consent Mode v2 for 24Toolkit.

## 🎯 Why Google Tag Manager?

### **Before GTM:**
```
Website Code → GA4 Script → AdSense Script → FB Pixel → etc.
❌ Every new tag needs code changes
❌ Hard to manage and debug
❌ Requires deployment for each change
```

### **After GTM:**
```
Website Code → GTM Container → All Tags Managed Here
✅ Add/remove tags without code changes
✅ Easy management and debugging
✅ Version control for tag changes
✅ Built-in consent mode support
```

---

## ✅ What's Already Done

```
✅ GTM script added to index.html (GTM-PMS4DDHH)
✅ Consent Mode v2 integrated
✅ Cookie consent banner ready
✅ Code pushed to production
```

---

## 📋 What You Need to Do in GTM Dashboard

### **1. Configure Google Analytics 4 in GTM**

#### Step 1: Create GA4 Configuration Tag
```
1. Go to: https://tagmanager.google.com/
2. Select container: GTM-PMS4DDHH
3. Click: Tags → New
4. Name: "GA4 - Configuration"
5. Tag Configuration:
   - Choose: Google Analytics: GA4 Configuration
   - Measurement ID: G-14LLZYGXTN
6. Triggering:
   - Choose: Consent Initialization - All Pages
7. Consent Settings:
   - Require consent for: Analytics Storage
   - Built-In Variables: Consent Initialization
8. Save
```

#### Step 2: Enable Consent Mode
```
1. In the same tag → Advanced Settings
2. Consent Settings:
   ✅ Require additional consent for tag to fire
   Analytics Storage: Required
3. Save
```

### **2. Configure Google AdSense in GTM**

#### Option A: Using Custom HTML Tag
```
1. Tags → New
2. Name: "AdSense - Script"
3. Tag Type: Custom HTML
4. HTML:
   <script async 
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2446710277775155"
     crossorigin="anonymous">
   </script>
5. Triggering: Consent Initialization - All Pages
6. Consent Settings:
   Ad Storage: Required
   Ad User Data: Required
   Ad Personalization: Required
7. Save
```

#### Option B: Using Community Template
```
1. Templates → Search Gallery
2. Search: "Google AdSense"
3. Add template to workspace
4. Create tag using template
5. Publisher ID: ca-pub-2446710277775155
```

### **3. Set Up Consent Mode Variables**

Already handled by your code! But verify in GTM:

```
Variables → Built-In Variables → Configure
✅ Enable all Consent variables:
   - Consent State - Ad Storage
   - Consent State - Analytics Storage
   - Consent State - Ad User Data
   - Consent State - Ad Personalization
```

### **4. Test Your Setup**

```
1. GTM → Preview Mode
2. Connect to: https://24toolkit.com
3. Check:
   ✅ GTM loads correctly
   ✅ Cookie banner appears
   ✅ Default consent = denied
   ✅ After "Accept All" → consent = granted
   ✅ GA4 tag fires only after consent
   ✅ AdSense loads only after consent
```

---

## 🔍 Debugging Tools

### **GTM Preview Mode**
```
1. GTM Dashboard → Preview
2. Enter: https://24toolkit.com
3. See all tags, triggers, variables in real-time
```

### **Google Tag Assistant**
```
1. Install: Tag Assistant browser extension
2. Enable on your site
3. See all Google tags and their status
```

### **Browser Console**
```javascript
// Check dataLayer
console.log(window.dataLayer);

// Check consent state
console.log(window.gtag);

// Should see:
// "Google Tag Manager: Consent Mode v2 initialized"
// "Google Consent Mode: Updated via GTM"
```

---

## 📊 GTM Dashboard Structure

### **Recommended Folder Organization**

```
📁 Tags
  📁 Analytics
    - GA4 - Configuration
    - GA4 - Page View
    - GA4 - Tool Usage
  📁 Advertising
    - AdSense - Script
    - AdSense - Auto Ads
  📁 Consent
    - Consent Mode - Default
    - Consent Mode - Update

📁 Triggers
  - Consent Initialization - All Pages
  - After Consent - Analytics
  - After Consent - Advertising
  - Tool Usage Event

📁 Variables
  - GA4 Measurement ID
  - AdSense Publisher ID
  - Cookie Consent State
```

---

## 🎯 Recommended Tags to Add

### **1. Enhanced Measurement (GA4)**
```
Tag: GA4 Configuration
✅ Page views: Automatic
✅ Scrolls: Enable (90%)
✅ Outbound clicks: Enable
✅ Site search: Enable
✅ Video engagement: Enable
✅ File downloads: Enable
```

### **2. Custom Events**

#### Tool Usage Event
```
Tag Type: GA4 Event
Event Name: tool_usage
Parameters:
  - tool_name: {{Tool Name}}
  - action: use
Trigger: Custom Event → tool_used
```

#### Page View Event (Enhanced)
```
Tag Type: GA4 Event
Event Name: page_view
Parameters:
  - page_path: {{Page Path}}
  - page_title: {{Page Title}}
  - tool_category: {{Tool Category}}
```

### **3. Conversion Tracking**
```
Tag: GA4 Event - Conversion
Event Name: generate_lead
Parameters:
  - method: tool_usage
  - value: 1
Trigger: After 3 tools used
```

---

## ⚙️ Advanced Configuration

### **Consent Mode Settings**

```javascript
// Already handled in your code, but for reference:
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});

// After user accepts:
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted'
});
```

### **Region-Specific Consent**
```javascript
// For EEA users only:
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE']
});

// Rest of world: granted by default
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted'
});
```

---

## 🚀 Next Steps

### **Immediate Actions:**

1. **Configure GA4 Tag in GTM** (5 minutes)
   ```
   → Add GA4 Configuration tag
   → Set Measurement ID: G-14LLZYGXTN
   → Enable consent requirements
   → Test in Preview mode
   ```

2. **Configure AdSense Tag in GTM** (5 minutes)
   ```
   → Add AdSense Custom HTML tag
   → Set Publisher ID: ca-pub-2446710277775155
   → Enable consent requirements
   → Test in Preview mode
   ```

3. **Publish Container** (1 minute)
   ```
   → Submit changes
   → Add version name: "Initial Setup with Consent Mode v2"
   → Publish
   ```

4. **Verify on Live Site** (5 minutes)
   ```
   → Visit https://24toolkit.com
   → Open DevTools → Console
   → Look for: "Google Tag Manager: Consent Mode v2 initialized"
   → Test cookie banner
   → Verify tags fire after consent
   ```

### **Optional Enhancements:**

- [ ] Set up custom events for each tool
- [ ] Add e-commerce tracking (if applicable)
- [ ] Set up conversion goals
- [ ] Add remarketing tags
- [ ] Configure Facebook Pixel via GTM
- [ ] Add Hotjar/heatmap tools
- [ ] Set up A/B testing tags

---

## 📈 Expected Results

### **After 24 Hours:**
```
✅ GA4 showing real-time users
✅ Consent data in GTM reports
✅ AdSense showing impressions
✅ All events tracked properly
```

### **After 1 Week:**
```
📊 User behavior patterns visible
📊 Tool usage statistics
📊 Conversion tracking data
📊 A/B test results (if set up)
```

---

## 🔧 Troubleshooting

### **GTM not loading?**
```
1. Check browser console for errors
2. Verify GTM-PMS4DDHH in index.html
3. Check network tab for gtm.js request
4. Disable ad blockers for testing
```

### **Tags not firing?**
```
1. Use GTM Preview mode
2. Check trigger conditions
3. Verify consent state
4. Check tag firing order
```

### **Consent not working?**
```
1. Clear localStorage
2. Reload page
3. Check console for consent logs
4. Verify cookie banner appears
```

### **GA4 not receiving data?**
```
1. Wait 24-48 hours for data
2. Check GTM Preview → Tags
3. Verify Measurement ID correct
4. Check GA4 Realtime report
```

---

## 📚 Resources

### **Official Documentation**
- [GTM Quick Start](https://support.google.com/tagmanager/answer/6103696)
- [Consent Mode Setup](https://developers.google.com/tag-platform/security/guides/consent)
- [GA4 in GTM](https://support.google.com/tagmanager/answer/9442095)
- [GTM Best Practices](https://www.simoahava.com/gtm-tips/)

### **Video Tutorials**
- [GTM for Beginners](https://www.youtube.com/watch?v=FnaGhjItmLw)
- [Consent Mode v2](https://www.youtube.com/watch?v=ZPsnFMiPjFA)
- [GA4 Setup in GTM](https://www.youtube.com/watch?v=PNJHSXPjT_s)

### **Community**
- [GTM Community](https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager)
- [Stack Overflow GTM Tag](https://stackoverflow.com/questions/tagged/google-tag-manager)
- [r/GoogleTagManager](https://www.reddit.com/r/GoogleTagManager/)

---

## ✅ Checklist

```
Website Setup:
✅ GTM script in <head>
✅ GTM noscript in <body>
✅ Consent Mode v2 code
✅ Cookie consent banner
✅ Environment variables set
✅ Code pushed to production

GTM Dashboard Setup:
□ GA4 Configuration tag created
□ GA4 consent requirements set
□ AdSense tag created
□ AdSense consent requirements set
□ Triggers configured
□ Variables set up
□ Container published
□ Preview mode tested
□ Live site verified

Vercel Setup:
□ VITE_GTM_ID environment variable added
□ VITE_GA_MEASUREMENT_ID verified
□ VITE_ADSENSE_PUBLISHER_ID verified
□ Redeployed after adding env vars
```

---

## 🎊 Final Notes

**Your site now has:**
- ✅ Professional tag management via GTM
- ✅ GDPR-compliant consent mode
- ✅ Easy tag configuration (no code needed)
- ✅ Better analytics and tracking
- ✅ Future-proof architecture

**Time to complete GTM setup:** ~20 minutes  
**Benefits:** Unlimited! 🚀

**Good luck! 🎉**

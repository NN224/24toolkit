# 24Toolkit - Deployment Guide

🚀 **Production Site:** [https://24toolkit.com](https://24toolkit.com)

Complete deployment guide for 24Toolkit - a comprehensive web application with 80+ free online tools including AI-powered features.

## 🌐 Domain Configuration

The project is configured for the domain: **24toolkit.com**

### DNS Configuration

To deploy to your custom domain, configure the following DNS records:

```
Type    Name    Value                   TTL
A       @       76.76.21.21            Auto
A       www     76.76.21.21            Auto
CNAME   www     cname.vercel-dns.com   Auto
```

*(Replace with your Vercel's provided DNS values)*

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env` file with the following required variables:

```bash
# Required: GitHub Personal Access Token for AI features
GITHUB_TOKEN=your_github_token_here

# Optional: Domain configuration
VITE_DOMAIN=https://24toolkit.com
```

**Get GitHub Token:**
1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "24toolkit-ai-features"
4. No specific scopes required (basic read access is enough)
5. Click "Generate token" and copy the value

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

### 2. Build Test

Before deploying, test the production build locally:

```bash
npm install
npm run build
npm run preview
```

Visit `http://localhost:4173` to verify everything works.

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Build Settings** (should be auto-detected)
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `GITHUB_TOKEN` with your token value
   - Select "Production", "Preview", and "Development"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheDXBNightsTeam/24toolkit)

*Note: You'll still need to add environment variables after deployment.*

## 🔧 Post-Deployment Configuration

### 1. Add Custom Domain

1. Go to Project Settings → Domains
2. Add your domain: `24toolkit.com`
3. Add www subdomain: `www.24toolkit.com`
4. Update your DNS records as instructed by Vercel
5. Wait for SSL certificate to provision (5-10 minutes)

### 2. Verify SEO Configuration

Check the following URLs:
- ✅ `https://24toolkit.com/robots.txt`
- ✅ `https://24toolkit.com/sitemap.xml`
- ✅ `https://24toolkit.com` (verify meta tags in source)

### 3. Test AI Features

Visit any AI tool and verify it works:
- [Text Summarizer](https://24toolkit.com/tools/text-summarizer)
- [AI Translator](https://24toolkit.com/tools/ai-translator)
- [Chat Assistant](https://24toolkit.com/tools/chat-assistant)

If AI tools show fallback messages, check that `GITHUB_TOKEN` is set correctly in Vercel environment variables.

## 🔍 Troubleshooting

### AI Tools Not Working

**Symptom:** AI tools show "AI service unavailable" message

**Solution:**
1. Verify `GITHUB_TOKEN` is set in Vercel → Project Settings → Environment Variables
2. Check token is valid at [github.com/settings/tokens](https://github.com/settings/tokens)
3. Redeploy after adding/updating environment variables

### Build Failures

**Symptom:** Deployment fails during build

**Common fixes:**
1. Check TypeScript errors: `npm run lint`
2. Verify all dependencies: `npm install`
3. Test build locally: `npm run build`
4. Check Vercel build logs for specific errors

### 404 on Tool Pages

**Symptom:** Direct URLs to tools return 404

**Solution:**
- Vercel's `vercel.json` should handle SPA routing
- Verify `vercel.json` has: `{ "source": "/(.*)", "destination": "/" }`
- Redeploy if configuration changed

### Domain Not Working

**Symptom:** Custom domain shows error

**Solution:**
1. Verify DNS records are correct in your domain provider
2. Wait up to 48 hours for DNS propagation
3. Check SSL certificate status in Vercel
4. Try forcing HTTPS redirect in Vercel settings

## 📊 Performance Optimization

### Recommended Vercel Settings

1. **Function Region:** Choose closest to your users
2. **Edge Caching:** Enable for static assets
3. **Image Optimization:** Enable automatic image optimization
4. **Analytics:** Enable Vercel Analytics for insights

### Build Optimization

The project is already optimized with:
- ✅ Code splitting via Vite
- ✅ Tree shaking for unused code
- ✅ Minification and compression
- ✅ Lazy loading for tool pages
- ✅ Image compression for assets

## 🔒 Security Headers

Security headers are configured in `vercel.json`:
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`

## 📈 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to Project → Analytics tab
2. Enable "Web Analytics"
3. View real-time traffic and performance metrics

### Enable Speed Insights

1. Install package:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Add to `main.tsx`:
   ```tsx
   import { SpeedInsights } from '@vercel/speed-insights/react'
   // ... in render
   <SpeedInsights />
   ```

## � Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches

### Disable Auto-Deploy (Optional)

Go to Project Settings → Git → Disable "Automatic Deployments from Git"

## 📝 Deployment Checklist

Before going live:

- [ ] Environment variables configured (`GITHUB_TOKEN`)
- [ ] Custom domain added and SSL active
- [ ] Test all AI tools work correctly
- [ ] Verify `/robots.txt` and `/sitemap.xml` accessible
- [ ] Check meta tags in source (Open Graph, Twitter Cards)
- [ ] Test responsive design on mobile/tablet
- [ ] Verify analytics/monitoring enabled
- [ ] Test all static pages load correctly
- [ ] Check console for errors in production

## 🆘 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [GitHub Issues](https://github.com/TheDXBNightsTeam/24toolkit/issues)
3. Contact via [24toolkit.com/contact](https://24toolkit.com/contact)

---

**Last Updated:** November 12, 2025
**Production URL:** [https://24toolkit.com](https://24toolkit.com)
**Repository:** [github.com/TheDXBNightsTeam/24toolkit](https://github.com/TheDXBNightsTeam/24toolkit)

# Production Deployment Guide

This guide covers everything you need to deploy 24Toolkit to production safely and securely.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Security Considerations](#security-considerations)
- [Monitoring & Logging](#monitoring--logging)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### Required Steps

- [ ] **Environment Variables**: All required environment variables are set
- [ ] **API Keys**: Valid API keys for AI providers are configured
- [ ] **Security Headers**: CSP and security headers are properly configured in `vercel.json`
- [ ] **Rate Limiting**: Understand current rate limits and adjust if needed
- [ ] **Dependencies**: Update dependencies and fix security vulnerabilities
- [ ] **Build Test**: Run `npm run build` successfully
- [ ] **Lint Check**: Run `npm run lint` and fix any critical issues

### Recommended Steps

- [ ] **Performance Testing**: Test with production-like load
- [ ] **Error Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)
- [ ] **Analytics**: Configure analytics if needed
- [ ] **Custom Domain**: Configure custom domain and SSL certificate
- [ ] **Backup Strategy**: Plan for KV store data backup (if using persistent storage)

## Environment Configuration

### Required Environment Variables

```bash
# At least ONE of these AI providers must be configured:

# Option 1: Anthropic Claude (Recommended for quality)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Option 2: Groq (Fast inference)
GROQ_API_KEY=gsk_your_key_here

# Option 3: GitHub Models (Alternative)
GITHUB_TOKEN=your_github_token_here
```

### Optional Environment Variables

```bash
# Domain configuration
VITE_DOMAIN=https://yourdomain.com

# Node environment (automatically set by Vercel)
NODE_ENV=production
```

### Vercel Configuration

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Add your environment variables for all environments (Production, Preview, Development)
4. Redeploy for changes to take effect

## Security Considerations

### Built-in Security Features

#### 1. Rate Limiting

All API endpoints have rate limiting enabled:

- **AI Endpoints** (`/api/ai`, `/_spark/llm`): 10 requests per minute per client
- **KV Store** (`/_spark/kv/*`): 100 requests per minute per client
- **General Endpoints**: 60 requests per minute per client

Rate limit information is returned in response headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2025-01-15T10:30:00.000Z
```

#### 2. Input Validation

All endpoints validate:
- Request body structure and types
- String length limits (prompts: 10,000 chars, messages: 50,000 chars)
- Array sizes (max 50 messages)
- KV key formats (no path traversal)
- KV value sizes (max 1MB)

#### 3. Error Sanitization

In production mode (`NODE_ENV=production`):
- Error messages are sanitized to prevent information leakage
- Stack traces are not exposed to clients
- Detailed errors are logged server-side only

#### 4. Request Timeouts

External API calls have 30-second timeouts:
- Anthropic API
- Groq API
- GitHub Models API

#### 5. Security Headers

Configured in `vercel.json`:
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Additional Security Recommendations

#### 1. API Key Protection

- **Never commit API keys to git**
- Use Vercel's encrypted environment variables
- Rotate keys regularly
- Use different keys for development/production

#### 2. CORS Configuration

Current CORS policy allows all origins (`*`). For production, consider:

```javascript
// More restrictive CORS (if needed)
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

#### 3. Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# For breaking changes (review carefully)
npm audit fix --force
```

Current known vulnerabilities (as of deployment):
- `@vercel/node` - 4 vulnerabilities (2 moderate, 2 high)
  - These are in dev dependencies and don't affect runtime security
  - Monitor for updates from Vercel

#### 4. KV Store Considerations

⚠️ **Important**: The current KV store implementation is **in-memory** and will:
- Reset on serverless cold starts
- Not persist across multiple instances
- Be limited to single-instance memory

For production with persistent storage needs:

**Option 1: Vercel KV** (Recommended)
```bash
npm install @vercel/kv
```

**Option 2: Upstash Redis**
```bash
npm install @upstash/redis
```

Update `api/_spark/kv/` endpoints to use your chosen solution.

## Monitoring & Logging

### Structured Logging

The application uses structured logging:

**Development Mode:**
```
[2025-01-15T10:30:00.000Z] INFO: POST /_spark/llm { messagesCount: 2, model: 'gpt-4o-mini' }
```

**Production Mode (JSON):**
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "message": "POST /_spark/llm - 200",
  "context": {
    "type": "response",
    "statusCode": 200,
    "duration": "1234ms",
    "provider": "anthropic"
  }
}
```

### Viewing Logs

**Vercel Dashboard:**
1. Go to your project
2. Click on **Logs** tab
3. Filter by environment and severity

**Vercel CLI:**
```bash
vercel logs [deployment-url]
```

### Log Levels

- `debug`: Detailed information (only in development)
- `info`: General information, request/response logs
- `warn`: Warning conditions (rate limits, invalid requests)
- `error`: Error conditions (API failures, exceptions)

### Recommended Monitoring

1. **Error Tracking**: Integrate Sentry or similar
   ```bash
   npm install @sentry/node
   ```

2. **Performance Monitoring**: Vercel Analytics (built-in)
   - Go to **Analytics** tab in Vercel Dashboard

3. **Uptime Monitoring**: External service like:
   - UptimeRobot
   - Pingdom
   - StatusCake

## Performance Optimization

### Current Implementation

✅ **Optimized:**
- Client-side processing for most tools (no server load)
- Streaming AI responses (lower TTFB)
- Static asset caching
- Code splitting with Vite
- Image optimization with compression tools

⚠️ **Areas for Improvement:**

1. **Large Bundle Size** (1.69 MB main chunk)
   - Consider lazy loading for AI tools
   - Split vendor bundles further
   - Remove unused dependencies

2. **Rate Limiting Storage**
   - Current: In-memory (resets on cold starts)
   - Recommended: Redis-based for distributed systems

3. **KV Store**
   - Current: In-memory
   - Recommended: Persistent storage (Vercel KV, Upstash)

### Bundle Size Optimization

To implement code splitting:

```typescript
// Example: Lazy load AI tools
const AITranslator = lazy(() => import('./pages/tools/AITranslator'));
const AIEmailWriter = lazy(() => import('./pages/tools/AIEmailWriter'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AITranslator />
</Suspense>
```

### CDN & Caching

Vercel automatically:
- Serves static assets via global CDN
- Caches at edge locations
- Implements smart cache invalidation

Custom cache headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

#### 1. AI Responses Not Working

**Symptoms:**
- Error: "AI service not configured"
- Error: "Server configuration error"

**Solution:**
1. Verify environment variables are set in Vercel
2. Check API key validity
3. Review logs for specific errors:
   ```bash
   vercel logs --follow
   ```

#### 2. Rate Limit Errors

**Symptoms:**
- HTTP 429 responses
- Error: "Too many requests"

**Solution:**
1. Check rate limit headers in response
2. Wait for reset time specified in `X-RateLimit-Reset`
3. For legitimate high traffic, consider:
   - Increasing rate limits in `api/_utils/rateLimit.ts`
   - Implementing user authentication
   - Using Redis-based rate limiting

#### 3. Slow AI Responses

**Symptoms:**
- Requests timing out
- Long response times

**Solution:**
1. Check AI provider status pages:
   - Anthropic: https://status.anthropic.com/
   - GitHub: https://www.githubstatus.com/
2. Increase timeout if needed (currently 30s)
3. Consider switching AI providers temporarily

#### 4. KV Store Data Loss

**Symptoms:**
- Data disappearing between requests
- Inconsistent state

**Solution:**
- This is expected with in-memory storage
- Implement persistent storage (see [KV Store Considerations](#4-kv-store-considerations))

#### 5. Build Failures

**Symptoms:**
- TypeScript errors
- Build fails in CI/CD

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Getting Help

1. **Check Logs**: Vercel Dashboard → Logs
2. **Review Documentation**: This file and README.md
3. **GitHub Issues**: https://github.com/NN224/24toolkit/issues
4. **Vercel Support**: https://vercel.com/support

### Health Check

The application includes basic health monitoring:

```bash
# Health check endpoint (if using server.js locally)
curl http://localhost:3000/health
```

For production, implement a dedicated health check endpoint:

```typescript
// api/health.ts
export default function handler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      ai: !!process.env.ANTHROPIC_API_KEY || !!process.env.GITHUB_TOKEN,
    }
  };
  res.status(200).json(health);
}
```

## Post-Deployment

### Monitoring Checklist

After deployment, verify:

- [ ] Application loads correctly
- [ ] AI tools respond properly
- [ ] No console errors in browser
- [ ] Rate limiting works
- [ ] Logs are being collected
- [ ] Error tracking is active (if configured)
- [ ] Performance metrics are acceptable

### Maintenance

Regular maintenance tasks:

1. **Weekly**
   - Review error logs
   - Check rate limit patterns
   - Monitor API usage

2. **Monthly**
   - Update dependencies
   - Review and fix security vulnerabilities
   - Analyze performance metrics
   - Review and optimize costs

3. **Quarterly**
   - Full security audit
   - Performance optimization review
   - Backup and disaster recovery test

## Support

For production issues or questions:

1. Check this documentation
2. Review application logs
3. Search existing GitHub issues
4. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Relevant logs (sanitized)
   - Environment details

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0

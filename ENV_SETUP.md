# Environment Setup for 24toolkit

This guide explains how to set up the required environment variables for AI features.

## Required Environment Variables

### Option 1: Anthropic Claude API (Recommended) ⭐

**Best for:** High-quality AI responses, reliable service

1. **Get API Key:**
   - Visit: https://console.anthropic.com
   - Sign up or log in
   - Go to "API Keys"
   - Click "Create Key"
   - Copy your key (starts with `sk-ant-`)

2. **Add to Environment:**
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your_key_here
   ```

3. **Supported Models:**
   - Claude 3.5 Sonnet (most capable)
   - Claude 3.5 Haiku (fast and efficient)
   - Claude 3 Opus (highest intelligence)

**Pricing:** Pay-as-you-go, ~$3 per million tokens

### Option 2: GitHub Models API (Alternative)

**Best for:** Testing, development (requires GitHub approval)

**How to get it**:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "24toolkit-ai-features"
4. Select scopes: `repo` (for full control of private repositories if needed)
5. Click "Generate token"
6. Copy the token immediately (you won't see it again)

**How to add in Vercel**:
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add new variable:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Your GitHub personal access token
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"

**AI Tools that require this**:
- ✨ AI Chat Assistant
- ✨ AI Text Summarizer
- ✨ AI Paragraph Rewriter
- ✨ AI Code Formatter & Explainer
- ✨ AI Image Caption Generator
- ✨ AI Grammar Corrector
- ✨ AI Translator
- ✨ AI Email Writer
- ✨ AI Hashtag Generator

## Vercel Deployment Configuration

### Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### API Routes
The `vercel.json` file configures the following API routes:
- `/_spark/llm` → `/api/_spark/llm` (LLM proxy for AI features)

## Testing After Deployment

1. Deploy your application to Vercel
2. Add the `GITHUB_TOKEN` environment variable
3. Redeploy to apply the environment variables
4. Visit your deployed site
5. Test any AI-powered tool (e.g., `/tools/chat-assistant` or `/tools/text-summarizer`)
6. If working correctly, you should get AI responses instead of fallback messages

## Troubleshooting

### "temporarily unable to provide creative perspective" message
This means the GITHUB_TOKEN is not configured or is invalid:
1. Check that `GITHUB_TOKEN` is set in Vercel environment variables
2. Verify the token has correct permissions
3. Check that the token hasn't expired
4. Redeploy after adding/updating the token

### "Server configuration error: GITHUB_TOKEN not configured"
The environment variable is not set in Vercel:
1. Add `GITHUB_TOKEN` in Vercel project settings
2. Select all environments (Production, Preview, Development)
3. Redeploy the application

### API errors or rate limits
GitHub Models API has rate limits. If you hit them:
1. Wait for the rate limit to reset
2. Consider implementing caching or rate limiting on your end
3. Check your GitHub token's quota

## Security Notes

- **Never commit your GITHUB_TOKEN to the repository**
- The token is only used server-side in Vercel Functions
- Client-side code never sees the actual token
- All AI requests are proxied through your Vercel functions

## Local Development

For local development, create a `.env` file in the project root:

```bash
GITHUB_TOKEN=your_github_token_here
```

Then run:
```bash
npm run dev
```

The Spark Vite plugin will automatically use the token for development.

---

Last updated: 2025-11-12

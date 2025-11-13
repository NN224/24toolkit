# API Functions

This directory contains Vercel serverless functions that enable AI features in production.

## Functions

### `/_spark/llm` - AI Language Model Proxy

**Location**: `api/_spark/llm.ts`

**Purpose**: Proxies requests from the frontend to GitHub Models API, adding authentication.

**How it works**:
1. Frontend calls `window.spark.llm()` which sends a POST request to `/_spark/llm`
2. Vercel routes this to the serverless function via `vercel.json` rewrites
3. The function forwards the request to `https://models.github.ai/inference/chat/completions`
4. It adds the `GITHUB_TOKEN` from environment variables as an Authorization header
5. The response is returned to the frontend

**Environment Variables**:
- `GITHUB_TOKEN` - Required GitHub Personal Access Token

**Used by**:
- AI Chat Assistant
- AI Text Summarizer
- AI Paragraph Rewriter
- AI Code Formatter
- AI Image Caption Generator
- AI Grammar Corrector
- AI Translator
- AI Email Writer
- AI Hashtag Generator

### `/_spark/kv` - Key-Value Storage

**Location**: `api/_spark/kv/index.ts` and `api/_spark/kv/[key].ts`

**Purpose**: Provides simple key-value storage for persisting data like chat messages.

**How it works**:
- `GET /_spark/kv` - Returns list of all keys
- `GET /_spark/kv/{key}` - Returns value for specific key
- `POST /_spark/kv/{key}` - Sets value for specific key
- `DELETE /_spark/kv/{key}` - Deletes specific key

**Storage**: Currently uses in-memory storage (not persistent across function restarts)

**Used by**:
- AI Chat Assistant (stores chat history)

**Note**: For production persistence, consider upgrading to:
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Upstash Redis](https://upstash.com/)

### `/_spark/user` - User Information

**Location**: `api/_spark/user.ts`

**Purpose**: Stub endpoint for user information (returns null for anonymous users)

### `/_spark/loaded` - Analytics/Telemetry

**Location**: `api/_spark/loaded.ts`

**Purpose**: Stub endpoint for runtime load analytics

## Development vs Production

### Development (Vite Dev Server)
In development, the Spark Vite plugin creates a proxy that handles `/_spark/llm` requests. The proxy:
- Uses `process.env.GITHUB_TOKEN` from your `.env` file
- Forwards to GitHub Models API
- Runs as part of the Vite dev server

### Production (Vercel)
In production, Vercel serverless functions handle the requests:
- The function in `api/_spark/llm.ts` is deployed as a serverless function
- `vercel.json` rewrites `/_spark/llm` to `/api/_spark/llm`
- The function uses `GITHUB_TOKEN` from Vercel environment variables

## Security

- API keys/tokens are never exposed to the client
- All authentication happens server-side
- Tokens are stored in environment variables, never in code
- Frontend never directly calls external APIs with credentials

## Testing

To test the API function locally:
1. Install Vercel CLI: `npm install -g vercel`
2. Create a `.env` file with `GITHUB_TOKEN=your_token`
3. Run: `vercel dev`
4. The function will be available at `http://localhost:3000/_spark/llm`

## Troubleshooting

If AI features aren't working:
1. Check that `GITHUB_TOKEN` is set in Vercel environment variables
2. Verify the token has correct permissions
3. Check Vercel function logs for errors
4. Ensure `vercel.json` rewrites are configured correctly

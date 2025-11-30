# 24Toolkit AI Coding Conventions

This document provides AI-native instructions for contributing to the 24Toolkit codebase.

## Big Picture Architecture

24Toolkit is a web-based toolkit built with **React (Vite)** and **TypeScript**. It provides a collection of 80+ free, fast, and AI-powered tools. The application is designed as a client-side SPA with serverless functions for AI features.

### Key Architectural Decisions

- **Frontend**: React 19 + TypeScript + Vite. UI components from **shadcn/ui** (Radix UI primitives) + **Tailwind CSS v4**
- **AI Services**: Dual-provider architecture supporting **Anthropic Claude** (primary) and **Groq** (fallback). Serverless functions in `api/` handle AI requests with streaming support
- **Authentication**: Firebase Auth with Google, GitHub, Facebook, and Apple OAuth providers
- **Deployment**: Vercel with serverless functions. Vite proxy handles local dev API routing
- **Code Splitting**: Heavy tools (image processing, AI) use `React.lazy()` for bundle optimization. See `App.tsx` for patterns
- **Privacy-First**: Most tools run client-side only (no data sent to servers except AI features)

### Data Flow for AI Tools

```
User Input → AI Tool Component → callAI() → /api/ai serverless function → Anthropic/Groq API → Streaming response → UI update
```

The `callAI()` function in `src/lib/ai.ts` handles streaming with callback-based updates. AI tools use `useAI()` hook or call `callAI()` directly.

## Developer Workflow

### Setup and Development

```bash
npm install
# Create .env with ANTHROPIC_API_KEY or GROQ_API_KEY
npm run dev  # Runs on http://localhost:5000
```

**Environment Variables** (see `.env.example`):
- `ANTHROPIC_API_KEY` - Primary AI provider (Claude)
- `GROQ_API_KEY` - Fallback AI provider
- `VITE_FIREBASE_*` - Firebase auth credentials

### Key Commands

```bash
npm run dev          # Dev server (Vite only)
npm run dev:full     # Dev server + API server (for testing serverless locally)
npm run build        # Production build (TypeScript check disabled for speed)
npm run preview      # Preview production build
npm run kill         # Kill processes on ports 5000 and 3000
```

### API Development

Serverless functions in `api/` are deployed on Vercel. Local development uses Vite proxy (see `vite.config.ts`). All API functions include:
- **Rate limiting** (in-memory, see `api/_utils/rateLimit.ts`)
- **Request validation** (see `api/_utils/validation.ts`)
- **Structured logging** (see `api/_utils/logger.ts`)
- **CORS headers** (configured in `vercel.json`)

Rate limits: AI endpoints = 10 req/min, KV = 100 req/min, General = 60 req/min

## Project Conventions

### Directory Structure

```
src/pages/tools/          # Individual tool components (80+ files)
src/components/ui/        # shadcn/ui primitives (button, card, etc.)
src/components/ai/        # AI-specific components (badges, provider selector)
src/hooks/                # Custom hooks (use-ai.ts, use-copy-to-clipboard.ts)
src/lib/                  # Core utilities, AI prompts, tools registry
src/contexts/             # React contexts (AuthContext for Firebase)
api/                      # Vercel serverless functions
api/_spark/               # GitHub Spark protocol endpoints (llm, kv, user)
api/_utils/               # Shared utilities (rate limiting, validation, logging)
```

### Adding a New Tool

1. **Create component** in `src/pages/tools/NewTool.tsx`:
   ```tsx
   import { Card, CardHeader, CardTitle } from '@/components/ui/card'
   import { useSEO } from '@/hooks/useSEO'
   import { getPageMetadata } from '@/lib/seo-metadata'
   
   export default function NewTool() {
     const metadata = getPageMetadata('tool-id')
     useSEO(metadata)
     // Tool implementation
   }
   ```

2. **Register in `src/lib/tools-data.ts`**:
   ```tsx
   {
     id: 'tool-id',
     title: 'Tool Name',
     description: 'Brief description',
     icon: PhosphorIcon,  // From @phosphor-icons/react
     path: '/tools/tool-name',
     color: 'from-blue-500 to-purple-500',
     category: 'text|image|ai|security|etc',
     isAI: true  // If it uses AI
   }
   ```

3. **Add route in `src/App.tsx`**:
   ```tsx
   // Use React.lazy() for heavy components (image/AI tools)
   const NewTool = React.lazy(() => import('@/pages/tools/NewTool'))
   // Then add route
   <Route path="/tools/tool-name" element={<Suspense fallback={<div>Loading...</div>}><NewTool /></Suspense>} />
   ```

### AI Tool Patterns

**Standard AI Tool Template** (see `AITranslator.tsx`, `TextSummarizer.tsx`):
```tsx
import { useState } from 'react'
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector'
import { callAI } from '@/lib/ai'
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts'
import { toast } from 'sonner'

export default function AITool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('anthropic')
  
  const handleProcess = async () => {
    try {
      validatePromptInput(input, 1, 10000)
      setLoading(true)
      setOutput('')
      
      const prompt = AI_PROMPTS.TOOL_NAME(input, options)
      await callAI(prompt, provider, (text) => setOutput(text))
      
      toast.success('Complete!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }
}
```

**AI Prompts**: Define in `src/lib/ai-prompts.ts` with input validation. Use factory functions that return prompt strings.

### Component Styling

- Use **Tailwind CSS v4** with custom design tokens from `tailwind.config.js`
- UI components use `class-variance-authority` for variants (see `src/components/ui/button.tsx`)
- Gradient patterns: `from-{color}-500 to-{color}-500` for tool icons
- Icons: Use `@phosphor-icons/react` (e.g., `<Sparkle size={24} weight="bold" />`)

### Authentication Patterns

Use `useAuth()` hook from `src/contexts/AuthContext.tsx`:
```tsx
const { user, signInWithGoogle, signOut } = useAuth()
```

Protected routes use `<ProtectedRoute>` wrapper (see `src/components/auth/ProtectedRoute.tsx`).

## Vite Build Configuration

**Important optimizations** in `vite.config.ts`:
- **Manual chunks**: Vendor splitting by library type (react, ui, image-tools, charts, three, ai-clients)
- **Proxy**: `/api` routes to `localhost:3000` in dev
- **Alias**: `@` maps to `src/`
- **Spark plugins**: `createIconImportProxy()` and `sparkPlugin()` are required

**Do not remove** Spark plugins - they enable GitHub Spark integration.

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/tools-data.ts` | Tool registry (add all new tools here) |
| `src/lib/ai-prompts.ts` | AI prompt templates and validation |
| `src/lib/ai.ts` | Core AI client with streaming support |
| `api/ai.js` | Main AI endpoint (Anthropic + Groq) |
| `api/_spark/llm.ts` | GitHub Spark LLM endpoint (OpenAI format → Claude) |
| `vercel.json` | Deployment config (rewrites, headers, CORS) |
| `vite.config.ts` | Build optimization and dev proxy |

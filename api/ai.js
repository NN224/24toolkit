/**
 * Multi-Provider AI Gateway
 * "Unstoppable" Handler with Waterfall Fallback Strategy
 * 
 * Fallback Order:
 * 1. Primary Provider (user's choice, default: Anthropic)
 * 2. Groq (fast fallback)
 * 3. Google Gemini (free fallback)
 * 4. OpenRouter (aggregator fallback with free models)
 */

import { 
  streamAnthropic, 
  streamGroq, 
  streamGemini, 
  streamOpenRouter,
  isRecoverableError,
  PROVIDERS 
} from './_utils/providers.js';
import { verifyIdToken, checkAIUsageAllowed, decrementUserCredits } from './_utils/firebaseAdmin.js';
import { logger } from './_utils/logger.js';
import { initSentryBackend, captureBackendError, flushSentry } from './_utils/sentry.js';

// =============================================================================
// Waterfall Fallback Configuration
// =============================================================================

const FALLBACK_ORDER = ['anthropic', 'groq', 'gemini', 'openrouter'];

/**
 * Get fallback chain starting from a specific provider
 * @param {string} startProvider - The starting provider
 * @returns {string[]} - Ordered list of providers to try
 */
function getFallbackChain(startProvider) {
  const startIndex = FALLBACK_ORDER.indexOf(startProvider);
  
  if (startIndex === -1) {
    // Unknown provider, use full chain
    return FALLBACK_ORDER;
  }
  
  // Start from the requested provider, then continue with the rest
  return [
    ...FALLBACK_ORDER.slice(startIndex),
    ...FALLBACK_ORDER.slice(0, startIndex),
  ];
}

/**
 * Get stream generator for a provider
 * @param {string} providerName - Provider name
 * @param {string} prompt - User prompt
 * @returns {AsyncGenerator} - Stream generator
 */
function getProviderStream(providerName, prompt) {
  const provider = PROVIDERS[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider.stream(prompt, provider.defaultModel);
}

// =============================================================================
// Main Handler
// =============================================================================

export default async function handler(req, res) {
  // Initialize Sentry for error tracking
  initSentryBackend();
  // Set headers for SSE streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed');
    return;
  }
  
  const { prompt, provider = 'anthropic' } = req.body || {};
  
  if (!prompt) {
    res.status(400).json({ error: 'MISSING_PROMPT', message: 'Prompt is required' });
    return;
  }
  
  // ==========================================================================
  // Authentication & Credit Check
  // ==========================================================================
  
  const authHeader = req.headers.authorization;
  let userId = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await verifyIdToken(idToken);
      userId = decodedToken.uid;
      
      // Check if user has credits available
      const { allowed, reason, remainingCredits } = await checkAIUsageAllowed(userId);
      if (!allowed) {
        res.status(402).json({ 
          error: 'NO_CREDITS',
          message: reason,
          remainingCredits 
        });
        return;
      }
      
      logger.info('AI request authorized', { userId, remainingCredits });
    } catch (authError) {
      logger.error('Auth verification failed', { error: authError.message });
      res.status(401).json({ error: 'AUTH_FAILED', message: authError.message });
      return;
    }
  }
  // Allow unauthenticated requests for backward compatibility (no credits deducted)
  
  // ==========================================================================
  // Waterfall Fallback Strategy
  // ==========================================================================
  
  const fallbackChain = getFallbackChain(provider);
  let lastError = null;
  let successProvider = null;
  let creditsDeducted = false;
  
  for (const currentProvider of fallbackChain) {
    try {
      logger.info('Trying provider', { 
        provider: currentProvider, 
        attempt: fallbackChain.indexOf(currentProvider) + 1,
        totalProviders: fallbackChain.length 
      });
      
      const stream = getProviderStream(currentProvider, prompt);
      let hasContent = false;
      
      for await (const chunk of stream) {
        if (chunk) {
          // Deduct credit on first successful content (only once)
          if (!creditsDeducted && userId) {
            try {
              await decrementUserCredits(userId);
              creditsDeducted = true;
              logger.info('Credit deducted', { userId, provider: currentProvider });
            } catch (creditError) {
              logger.error('Failed to deduct credit', { 
                userId, 
                provider: currentProvider,
                error: creditError.message 
              });
            }
          }
          
          hasContent = true;
          
          // Send SSE formatted response
          // Format: data: {"text": "chunk"}\n\n
          const sseData = JSON.stringify({ text: chunk });
          res.write(`data: ${sseData}\n\n`);
        }
      }
      
      if (hasContent) {
        successProvider = currentProvider;
        logger.info('Provider succeeded', { 
          provider: currentProvider,
          wasFallback: currentProvider !== provider 
        });
        break; // Success! Exit the fallback loop
      } else {
        throw new Error('NO_CONTENT');
      }
      
    } catch (error) {
      lastError = error;
      
      logger.warn('Provider failed', { 
        provider: currentProvider,
        error: error.message,
        status: error.status || error.statusCode,
        isRecoverable: isRecoverableError(error)
      });
      
      // If error is not recoverable, don't try other providers
      if (!isRecoverableError(error)) {
        // Unless it's a NO_*_KEY error (just means key not configured)
        if (!error.message?.includes('NO_') || !error.message?.includes('_KEY')) {
          break;
        }
      }
      
      // Continue to next provider in the fallback chain
      continue;
    }
  }
  
  // ==========================================================================
  // Final Response
  // ==========================================================================
  
  if (successProvider) {
    // Send end event
    res.write(`data: ${JSON.stringify({ done: true, provider: successProvider })}\n\n`);
    res.end();
  } else {
    // All providers failed
    logger.error('All providers failed', { 
      lastError: lastError?.message,
      attemptedProviders: fallbackChain 
    });
    
    // Report to Sentry
    captureBackendError(lastError, {
      endpoint: '/api/ai',
      userId,
      extra: { attemptedProviders: fallbackChain }
    });
    
    if (!res.headersSent) {
      res.status(503).json({ 
        error: 'ALL_PROVIDERS_FAILED',
        message: 'All AI providers are currently unavailable. Please try again later.',
        lastError: lastError?.message 
      });
    } else {
      // If we've already started streaming, send error event
      res.write(`data: ${JSON.stringify({ 
        error: true, 
        message: 'Connection lost. Please try again.' 
      })}\n\n`);
      res.end();
    }
    
    // Flush Sentry events before function ends
    await flushSentry();
  }
}

import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { validateAIRequest, sanitizeErrorMessage } from './_utils/validation.js';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from './_utils/rateLimit.js';
import { logger } from './_utils/logger.js';
import { verifyIdToken, checkAIUsageAllowed, decrementUserCredits } from './_utils/firebaseAdmin.js';

export default async function handler(req, res) {
  const startTime = Date.now();
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, RATE_LIMITS.ai);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMITS.ai.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { clientId, endpoint: '/api/ai' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
  }

  // ============================================
  // AI Credit System - Authentication & Usage Check
  // ============================================
  
  let userId = null;
  let isPremiumUser = false;
  let creditsRemaining = 0;
  
  // Check for Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.substring(7);
    
    try {
      // Verify the Firebase ID token
      const userData = await verifyIdToken(idToken);
      userId = userData.uid;
      
      // Check if user can use AI (has credits or is premium)
      const usageCheck = await checkAIUsageAllowed(userId);
      
      if (!usageCheck.allowed) {
        logger.warn('AI usage denied - no credits', { userId, endpoint: '/api/ai' });
        return res.status(403).json({
          error: usageCheck.reason,
          creditsRemaining: 0,
          isPremium: false,
          code: 'CREDITS_EXHAUSTED'
        });
      }
      
      isPremiumUser = usageCheck.isPremium;
      creditsRemaining = usageCheck.creditsRemaining;
      
      logger.info('AI usage allowed', { userId, isPremium: isPremiumUser, creditsRemaining });
      
    } catch (authError) {
      logger.warn('Authentication failed', { error: authError.message, endpoint: '/api/ai' });
      return res.status(401).json({
        error: `Authentication failed: ${authError.message}`,
        code: 'AUTH_FAILED'
      });
    }
  } else {
    // No auth header - guest user, require sign in for AI features
    logger.warn('Unauthenticated AI request', { clientId, endpoint: '/api/ai' });
    return res.status(401).json({
      error: 'Please sign in to use AI features. Free users get 5 AI requests per day.',
      code: 'AUTH_REQUIRED'
    });
  }

  // Validate request body
  const validation = validateAIRequest(req.body);
  if (!validation.isValid) {
    logger.warn('Invalid request', { error: validation.error, clientId });
    return res.status(400).json({ error: validation.error });
  }

  const { prompt, provider, model } = req.body;
  
  logger.logRequest(req.method, '/api/ai', { provider, model, promptLength: prompt.length, userId });

  // Flag to track if credits were decremented (only once per request)
  let creditsDeducted = false;
  
  // Helper function to decrement credits on first successful response
  const deductCreditsOnce = async () => {
    if (!creditsDeducted && !isPremiumUser && userId) {
      creditsDeducted = true;
      creditsRemaining = await decrementUserCredits(userId);
      logger.info('Credits decremented after successful start', { userId, creditsRemaining });
    }
  };

  try {
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        logger.error('ANTHROPIC_API_KEY not configured');
        return res.status(500).json({ 
          error: 'AI service not configured. Please contact support.' 
        });
      }

      const anthropic = new Anthropic({ apiKey });

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Add timeout for API call
      const timeoutMs = 30000; // 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });

      const streamPromise = anthropic.messages.stream({
        model: model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      logger.info('Starting Anthropic stream', { model, promptLength: prompt.length });
      
      const stream = await Promise.race([streamPromise, timeoutPromise]);

      let hasReceivedText = false;
      
      stream.on('text', async (text) => {
        hasReceivedText = true;
        // Deduct credit on first successful text chunk
        await deductCreditsOnce();
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      stream.on('end', () => {
        logger.info('Anthropic stream ended', { hasReceivedText });
        res.write('data: [DONE]\n\n');
        res.end();
        logger.logResponse(req.method, '/api/ai', 200, Date.now() - startTime, { provider });
      });

      stream.on('error', (error) => {
        logger.error('Anthropic streaming error', error, { provider, model, errorMessage: error.message });
        res.write(`data: ${JSON.stringify({ error: sanitizeErrorMessage(error) })}\n\n`);
        res.end();
      });

    } else if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY;
      
      if (!apiKey) {
        logger.error('GROQ_API_KEY not configured');
        return res.status(500).json({ 
          error: 'AI service not configured. Please contact support.' 
        });
      }

      const groq = new Groq({ apiKey });

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Add timeout for API call
      const timeoutMs = 30000; // 30 seconds
      const streamPromise = groq.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 2048,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });

      const stream = await Promise.race([streamPromise, timeoutPromise]);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          // Deduct credit on first successful text chunk
          await deductCreditsOnce();
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      logger.logResponse(req.method, '/api/ai', 200, Date.now() - startTime, { provider });

    } else {
      logger.warn('Invalid provider requested', { provider });
      return res.status(400).json({ 
        error: `Invalid provider: ${provider}. Must be 'anthropic' or 'groq'` 
      });
    }
  } catch (error) {
    logger.error('API error', error, { provider, model });
    
    // If headers already sent (streaming started), we can't send JSON
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: sanitizeErrorMessage(error) })}\n\n`);
      res.end();
    } else {
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/api/ai', 500, duration, { provider, error: error.message });
      return res.status(500).json({ 
        error: sanitizeErrorMessage(error, false)
      });
    }
  }
}

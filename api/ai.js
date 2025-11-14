import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { validateAIRequest, sanitizeErrorMessage } from './_utils/validation.js';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from './_utils/rateLimit.js';
import { logger } from './_utils/logger.js';

export default async function handler(req, res) {
  const startTime = Date.now();
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  // Validate request body
  const validation = validateAIRequest(req.body);
  if (!validation.isValid) {
    logger.warn('Invalid request', { error: validation.error, clientId });
    return res.status(400).json({ error: validation.error });
  }

  const { prompt, provider, model } = req.body;
  
  logger.logRequest(req.method, '/api/ai', { provider, model, promptLength: prompt.length });

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

      const stream = await Promise.race([streamPromise, timeoutPromise]);

      stream.on('text', (text) => {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      stream.on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end();
        logger.logResponse(req.method, '/api/ai', 200, Date.now() - startTime, { provider });
      });

      stream.on('error', (error) => {
        logger.error('Anthropic streaming error', error, { provider, model });
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

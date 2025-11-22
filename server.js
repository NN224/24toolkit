import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Simple logger for dev server
const logger = {
  info: (msg, data = {}) => console.log(`[INFO] ${msg}`, data),
  error: (msg, error, data = {}) => console.error(`[ERROR] ${msg}`, error?.message || error, data),
  warn: (msg, data = {}) => console.warn(`[WARN] ${msg}`, data),
};

// Simple rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = { windowMs: 60000, maxRequests: 10 };

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
  }
  
  if (record.count < RATE_LIMIT.maxRequests) {
    record.count++;
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
  }
  
  return { allowed: false, remaining: 0, resetTime: record.resetTime };
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', reason);
});

// AI endpoint
app.post('/api/ai', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  
  // Rate limiting
  const rateLimit = checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  
  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { ip: clientIp });
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
  }
  
  const { prompt, provider, model } = req.body;

  // Validation
  if (!prompt || !provider || !model) {
    logger.warn('Invalid request', { provider, hasPrompt: !!prompt });
    return res.status(400).json({
      error: 'Missing required fields: prompt, provider, and model are required'
    });
  }
  
  if (typeof prompt !== 'string' || prompt.length > 10000) {
    return res.status(400).json({
      error: 'Invalid prompt: must be a string with max 10000 characters'
    });
  }
  
  if (!['anthropic', 'groq'].includes(provider)) {
    return res.status(400).json({
      error: 'Invalid provider: must be anthropic or groq'
    });
  }
  
  logger.info('AI request received', { provider, model, promptLength: prompt.length });

  try {
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        return res.status(500).json({
          error: 'ANTHROPIC_API_KEY not configured on server'
        });
      }

      const anthropic = new Anthropic({ apiKey });

      // Set headers for streaming BEFORE any writes
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      try {
        // Add timeout
        const timeoutMs = 30000;
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
        });

        stream.on('error', (error) => {
          logger.error('Anthropic streaming error', error);
          res.write(`data: ${JSON.stringify({ error: 'AI service error' })}\n\n`);
          res.end();
        });
      } catch (streamError) {
        logger.error('Stream creation error', streamError);
        if (streamError.message === 'Request timeout') {
          res.write(`data: ${JSON.stringify({ error: 'Request timeout' })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ error: 'Failed to create stream' })}\n\n`);
        }
        res.end();
      }

    } else if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY;

      if (!apiKey) {
        return res.status(500).json({
          error: 'GROQ_API_KEY not configured on server'
        });
      }

      const groq = new Groq({ apiKey });

      // Set headers for streaming BEFORE any writes
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      try {
        // Add timeout
        const timeoutMs = 30000;
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
      } catch (streamError) {
        logger.error('Groq stream error', streamError);
        if (streamError.message === 'Request timeout') {
          res.write(`data: ${JSON.stringify({ error: 'Request timeout' })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ error: 'Failed to process stream' })}\n\n`);
        }
        res.end();
      }

    } else {
      return res.status(400).json({
        error: `Invalid provider: ${provider}. Must be 'anthropic' or 'groq'`
      });
    }
  } catch (error) {
    logger.error('API error', error);

    // If headers already sent (streaming started), we can't send JSON
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
      res.end();
    } else {
      return res.status(500).json({
        error: 'Failed to process AI request'
      });
    }
  }
});

// Health check with details
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
    }
  };
  res.json(health);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Express error', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`API Server running on http://localhost:${PORT}`);
  logger.info(`Streaming AI endpoint: POST http://localhost:${PORT}/api/ai`);
  logger.info('Environment:', {
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
  });
});

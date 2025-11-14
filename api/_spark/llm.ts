import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateLLMRequest, sanitizeErrorMessage } from '../_utils/validation';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '../_utils/rateLimit';
import { logger } from '../_utils/logger';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
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
    logger.warn('Rate limit exceeded', { clientId, endpoint: '/_spark/llm' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
  }

  // Validate request body
  const validation = validateLLMRequest(req.body);
  if (!validation.isValid) {
    logger.warn('Invalid LLM request', { error: validation.error, clientId });
    return res.status(400).json({ error: validation.error });
  }

  // Get API keys from environment
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!anthropicKey && !githubToken) {
    logger.error('No API key configured');
    return res.status(500).json({ 
      error: 'Server configuration error: AI service not configured' 
    });
  }

  // Log request for debugging
  logger.logRequest(req.method, '/_spark/llm', { 
    messagesCount: req.body.messages?.length,
    model: req.body.model 
  });

  try {
    // Use Anthropic Claude if key is available
    if (anthropicKey) {
      logger.debug('Using Anthropic Claude API');
      
      // Map model names to Claude models
      const modelMap: Record<string, string> = {
        'gpt-4o': 'claude-3-5-sonnet-20241022',
        'gpt-4o-mini': 'claude-3-5-haiku-20241022',
        'claude-3-opus': 'claude-3-opus-20240229',
        'claude-3-sonnet': 'claude-3-sonnet-20240229',
        'claude-3-haiku': 'claude-3-haiku-20240307',
      };
      
      const requestedModel = req.body.model || 'gpt-4o-mini';
      const claudeModel = modelMap[requestedModel] || 'claude-3-5-haiku-20241022';
      
      // Convert OpenAI format to Claude format
      const messages = req.body.messages || [];
      const systemMessage = messages.find((m: any) => m.role === 'system');
      const userMessages = messages.filter((m: any) => m.role !== 'system');
      
      const claudeBody = {
        model: claudeModel,
        max_tokens: req.body.max_tokens || 1024,
        messages: userMessages.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        ...(systemMessage && { system: systemMessage.content })
      };
      
      // Add timeout for external API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(claudeBody),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Claude API error', new Error(errorText), { 
            status: response.status,
            statusText: response.statusText 
          });
          throw new Error(`Claude API error: ${response.statusText}`);
        }
        
        const claudeData = await response.json();
        
        // Convert Claude format back to OpenAI format
        const openAIFormat = {
          id: claudeData.id,
          object: 'chat.completion',
          created: Date.now(),
          model: claudeModel,
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: claudeData.content[0].text
            },
            finish_reason: claudeData.stop_reason === 'end_turn' ? 'stop' : claudeData.stop_reason
          }],
          usage: claudeData.usage
        };
        
        const duration = Date.now() - startTime;
        logger.logResponse(req.method, '/_spark/llm', 200, duration, { 
          provider: 'anthropic',
          model: claudeModel 
        });
        return res.status(200).json(openAIFormat);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          logger.error('Claude API timeout', fetchError);
          throw new Error('Request timeout - the AI service took too long to respond');
        }
        throw fetchError;
      }
    }
    
    // Fallback to GitHub Models if no Anthropic key
    const apiUrl = 'https://models.github.ai/chat/completions';
    logger.debug('Using GitHub Models API');
    
    // Add timeout for external API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('GitHub Models API error', new Error(errorText), { 
        status: response.status,
        statusText: response.statusText 
      });
      
      // Return user-friendly error
      return res.status(200).json({
        choices: [{
          message: {
            role: 'assistant',
            content: `🔧 AI Service Configuration Needed\n\nThe GitHub Models API returned an error. This usually means:\n\n1. **GitHub Models needs to be enabled** for your account\n   - Visit: https://github.com/marketplace/models\n   - Request access to GitHub Models\n\n2. **Token needs proper scopes**\n   - Your token may need additional permissions\n   - Regenerate with "Models" scope if available\n\n3. **Alternative**: You can use OpenAI API instead\n   - Add OPENAI_API_KEY to environment variables\n\nError details: ${response.statusText}`
          },
          finish_reason: 'stop',
          index: 0
        }]
      });
    }

    const data = await response.json();
    const duration = Date.now() - startTime;
    logger.logResponse(req.method, '/_spark/llm', 200, duration, { provider: 'github' });
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('GitHub Models API timeout', error);
      const duration = Date.now() - startTime;
      logger.logResponse(req.method, '/_spark/llm', 408, duration);
      return res.status(408).json({ 
        error: 'Request timeout - the AI service took too long to respond'
      });
    }

    logger.error('Error calling AI service', error instanceof Error ? error : new Error(String(error)));
    const duration = Date.now() - startTime;
    logger.logResponse(req.method, '/_spark/llm', 500, duration);
    return res.status(500).json({ 
      error: sanitizeErrorMessage(error, false)
    });
  }
}

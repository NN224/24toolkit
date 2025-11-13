import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';

export default async function handler(req, res) {
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

  const { prompt, provider, model } = req.body;

  if (!prompt || !provider || !model) {
    return res.status(400).json({ 
      error: 'Missing required fields: prompt, provider, and model are required' 
    });
  }

  try {
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'ANTHROPIC_API_KEY not configured on server' 
        });
      }

      const anthropic = new Anthropic({ apiKey });

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await anthropic.messages.stream({
        model: model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      stream.on('text', (text) => {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      stream.on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end();
      });

      stream.on('error', (error) => {
        console.error('Anthropic streaming error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      });

    } else if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'GROQ_API_KEY not configured on server' 
        });
      }

      const groq = new Groq({ apiKey });

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await groq.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 2048,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();

    } else {
      return res.status(400).json({ 
        error: `Invalid provider: ${provider}. Must be 'anthropic' or 'groq'` 
      });
    }
  } catch (error) {
    console.error('API error:', error);
    
    // If headers already sent (streaming started), we can't send JSON
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      return res.status(500).json({ 
        error: 'Failed to process AI request',
        message: error.message 
      });
    }
  }
}

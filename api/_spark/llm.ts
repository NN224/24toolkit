import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
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

  // Get API keys from environment
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!anthropicKey && !githubToken) {
    console.error('No API key configured');
    return res.status(500).json({ 
      error: 'Server configuration error: ANTHROPIC_API_KEY or GITHUB_TOKEN not configured' 
    });
  }

  // Log request for debugging
  console.log('[LLM] Request body:', JSON.stringify(req.body).substring(0, 200));

  try {
    // Use Anthropic Claude if key is available
    if (anthropicKey) {
      console.log('[LLM] Using Anthropic Claude API');
      
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
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claudeBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', response.status, errorText);
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
      
      return res.status(200).json(openAIFormat);
    }
    
    // Fallback to GitHub Models if no Anthropic key
    const apiUrl = 'https://models.github.ai/chat/completions';
    console.log('[LLM] Using GitHub Models API');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub Models API error:', response.status, errorText);
      
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
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error calling GitHub Models API:', error);
    return res.status(500).json({ 
      error: 'Failed to process AI request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRateLimiter } from './_utils/rateLimit.js';
import { validateRequest } from './_utils/validation.js';
import { logRequest, logError } from './_utils/logger.js';

// Rate limiting: 10 requests per minute per IP
const rateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000,
});

/**
 * Generate image caption using Google Gemini Vision API
 * 
 * @param {Request} req - The request object
 * @returns {Response} - The response with generated caption
 */
export default async function handler(req) {
  const startTime = Date.now();
  
  // Log request
  logRequest(req, 'generate-caption');

  // Rate limiting
  const rateLimitResult = await rateLimiter(req);
  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitResult.retryAfter 
      }),
      { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    
    // Validate request
    const validation = validateRequest(body, {
      image: { type: 'string', required: true, minLength: 100 },
      mimeType: { type: 'string', required: false, default: 'image/jpeg' }
    });

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.errors.join(', ') }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { image, mimeType } = validation.data;

    // Check if API key is configured
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      logError('GOOGLE_AI_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Google AI API key not configured. Please set GOOGLE_AI_API_KEY environment variable.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate caption
    const result = await model.generateContent([
      {
        text: "Generate a descriptive, engaging, and creative caption for this image. Be specific about what you see in the image. The caption should be 1-2 sentences long and capture the essence of the image."
      },
      {
        inlineData: {
          data: image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const caption = response.text();

    if (!caption || caption.trim().length === 0) {
      throw new Error('Empty caption received from API');
    }

    const duration = Date.now() - startTime;
    console.log(`Caption generated successfully in ${duration}ms`);

    return new Response(
      JSON.stringify({ 
        success: true,
        caption: caption.trim(),
        duration 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    logError('Caption generation error:', error);
    
    // Handle specific errors
    let errorMessage = 'Failed to generate caption';
    let statusCode = 500;

    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key';
      statusCode = 401;
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('image')) {
      errorMessage = 'Invalid image format';
      statusCode = 400;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}


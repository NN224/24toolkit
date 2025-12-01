/**
 * Multi-Provider AI Gateway
 * Supports: Anthropic, Groq, Google Gemini, OpenRouter
 * Features: Key rotation, streaming, unified response format
 */

import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { logger } from './logger.js';

// =============================================================================
// Key Rotation Helper
// =============================================================================

/**
 * Get a random API key from comma-separated environment variable
 * @param {string} envVarName - Name of the environment variable
 * @returns {string|null} - Random key or null if not configured
 */
export function getRandomKey(envVarName) {
  const keysString = process.env[envVarName];
  if (!keysString) return null;
  
  const keys = keysString.split(',').map(k => k.trim()).filter(k => k);
  if (keys.length === 0) return null;
  
  const selectedKey = keys[Math.floor(Math.random() * keys.length)];
  logger.debug('Key rotation', { 
    provider: envVarName, 
    totalKeys: keys.length,
    keyIndex: keys.indexOf(selectedKey) + 1 
  });
  
  return selectedKey;
}

/**
 * Get API key with fallback to single-key env var
 */
export function getAnthropicKey() {
  return getRandomKey('ANTHROPIC_API_KEYS') || process.env.ANTHROPIC_API_KEY;
}

export function getGroqKey() {
  return getRandomKey('GROQ_API_KEYS') || process.env.GROQ_API_KEY;
}

export function getGeminiKey() {
  return getRandomKey('GOOGLE_GEMINI_API_KEYS') || process.env.GOOGLE_GEMINI_API_KEY;
}

export function getOpenRouterKey() {
  return getRandomKey('OPENROUTER_API_KEYS') || process.env.OPENROUTER_API_KEY;
}

// =============================================================================
// Provider: Anthropic Claude
// =============================================================================

/**
 * Stream response from Anthropic Claude
 * @param {string} prompt - User prompt
 * @param {string} model - Model to use (default: claude-sonnet-4-20250514)
 * @yields {string} - Text chunks
 */
export async function* streamAnthropic(prompt, model = 'claude-sonnet-4-20250514') {
  const apiKey = getAnthropicKey();
  
  if (!apiKey) {
    throw new Error('NO_ANTHROPIC_KEY');
  }
  
  const anthropic = new Anthropic({ apiKey });
  
  logger.info('Starting Anthropic stream', { model });
  
  const stream = await anthropic.messages.stream({
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.text) {
      yield event.delta.text;
    }
  }
}

// =============================================================================
// Provider: Groq (Fast Inference)
// =============================================================================

/**
 * Stream response from Groq
 * @param {string} prompt - User prompt
 * @param {string} model - Model to use (default: llama-3.3-70b-versatile)
 * @yields {string} - Text chunks
 */
export async function* streamGroq(prompt, model = 'llama-3.3-70b-versatile') {
  const apiKey = getGroqKey();
  
  if (!apiKey) {
    throw new Error('NO_GROQ_KEY');
  }
  
  const groq = new Groq({ apiKey });
  
  logger.info('Starting Groq stream', { model });
  
  const stream = await groq.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 4096,
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

// =============================================================================
// Provider: Google Gemini (Free Tier)
// =============================================================================

/**
 * Stream response from Google Gemini
 * @param {string} prompt - User prompt
 * @param {string} model - Model to use (default: gemini-1.5-flash)
 * @yields {string} - Text chunks
 */
export async function* streamGemini(prompt, model = 'gemini-1.5-flash') {
  const apiKey = getGeminiKey();
  
  if (!apiKey) {
    throw new Error('NO_GEMINI_KEY');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model });
  
  logger.info('Starting Gemini stream', { model });
  
  const result = await geminiModel.generateContentStream(prompt);
  
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}

// =============================================================================
// Provider: OpenRouter (Multi-Model Aggregator)
// =============================================================================

/**
 * Stream response from OpenRouter
 * @param {string} prompt - User prompt
 * @param {string} model - Model to use (default: meta-llama/llama-3-8b-instruct:free)
 * @yields {string} - Text chunks
 */
export async function* streamOpenRouter(prompt, model = 'meta-llama/llama-3-8b-instruct:free') {
  const apiKey = getOpenRouterKey();
  
  if (!apiKey) {
    throw new Error('NO_OPENROUTER_KEY');
  }
  
  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.VITE_DOMAIN || 'https://24toolkit.com',
      'X-Title': '24Toolkit',
    },
  });
  
  logger.info('Starting OpenRouter stream', { model });
  
  const stream = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 4096,
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

// =============================================================================
// Provider Information
// =============================================================================

export const PROVIDERS = {
  anthropic: {
    name: 'Anthropic Claude',
    stream: streamAnthropic,
    defaultModel: 'claude-sonnet-4-20250514',
    priority: 1,
  },
  groq: {
    name: 'Groq',
    stream: streamGroq,
    defaultModel: 'llama-3.3-70b-versatile',
    priority: 2,
  },
  gemini: {
    name: 'Google Gemini',
    stream: streamGemini,
    defaultModel: 'gemini-1.5-flash',
    priority: 3,
  },
  openrouter: {
    name: 'OpenRouter',
    stream: streamOpenRouter,
    defaultModel: 'meta-llama/llama-3-8b-instruct:free',
    priority: 4,
  },
};

/**
 * Check if an error is recoverable (should trigger fallback)
 * @param {Error} error - The error to check
 * @returns {boolean} - True if fallback should be attempted
 */
export function isRecoverableError(error) {
  const status = error.status || error.statusCode;
  
  // Rate limit, payment required, overloaded, server errors
  if ([429, 402, 503, 529, 500, 502, 504].includes(status)) {
    return true;
  }
  
  // No API key configured
  if (error.message?.includes('NO_') && error.message?.includes('_KEY')) {
    return true;
  }
  
  // Overloaded messages
  if (error.message?.toLowerCase().includes('overloaded')) {
    return true;
  }
  
  // Quota exceeded
  if (error.message?.toLowerCase().includes('quota')) {
    return true;
  }
  
  return false;
}

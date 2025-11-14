/**
 * Input validation utilities for API endpoints
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate AI request body
 */
export function validateAIRequest(body: any): ValidationResult {
  if (!body) {
    return { isValid: false, error: 'Request body is required' };
  }

  if (!body.prompt || typeof body.prompt !== 'string') {
    return { isValid: false, error: 'Valid prompt string is required' };
  }

  if (body.prompt.length > 10000) {
    return { isValid: false, error: 'Prompt exceeds maximum length of 10000 characters' };
  }

  if (!body.provider || typeof body.provider !== 'string') {
    return { isValid: false, error: 'Valid provider string is required' };
  }

  const validProviders = ['anthropic', 'groq'];
  if (!validProviders.includes(body.provider)) {
    return { isValid: false, error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` };
  }

  if (!body.model || typeof body.model !== 'string') {
    return { isValid: false, error: 'Valid model string is required' };
  }

  return { isValid: true };
}

/**
 * Validate LLM request body
 */
export function validateLLMRequest(body: any): ValidationResult {
  if (!body) {
    return { isValid: false, error: 'Request body is required' };
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return { isValid: false, error: 'Messages array is required' };
  }

  if (body.messages.length === 0) {
    return { isValid: false, error: 'At least one message is required' };
  }

  if (body.messages.length > 50) {
    return { isValid: false, error: 'Too many messages (maximum 50)' };
  }

  // Validate each message
  for (const message of body.messages) {
    if (!message.role || !message.content) {
      return { isValid: false, error: 'Each message must have role and content' };
    }

    if (typeof message.content !== 'string') {
      return { isValid: false, error: 'Message content must be a string' };
    }

    if (message.content.length > 50000) {
      return { isValid: false, error: 'Message content exceeds maximum length' };
    }

    const validRoles = ['system', 'user', 'assistant'];
    if (!validRoles.includes(message.role)) {
      return { isValid: false, error: `Invalid message role. Must be one of: ${validRoles.join(', ')}` };
    }
  }

  return { isValid: true };
}

/**
 * Validate KV store key
 */
export function validateKVKey(key: any): ValidationResult {
  if (!key || typeof key !== 'string') {
    return { isValid: false, error: 'Valid key string is required' };
  }

  if (key.length > 1000) {
    return { isValid: false, error: 'Key exceeds maximum length of 1000 characters' };
  }

  // Prevent path traversal
  if (key.includes('..') || key.includes('/') || key.includes('\\')) {
    return { isValid: false, error: 'Invalid characters in key' };
  }

  return { isValid: true };
}

/**
 * Sanitize error messages for production
 */
export function sanitizeErrorMessage(error: any, includeDetails: boolean = false): string {
  if (process.env.NODE_ENV === 'production' && !includeDetails) {
    return 'An error occurred while processing your request';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

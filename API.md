# API Documentation

Complete API reference for 24Toolkit backend endpoints.

## Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [AI Endpoints](#ai-endpoints)
- [Spark Runtime Endpoints](#spark-runtime-endpoints)
- [Response Formats](#response-formats)

## Authentication

Currently, the API does not require authentication for client requests. AI provider authentication is handled server-side using environment variables.

### Required Server Configuration

At least one AI provider must be configured:

```bash
ANTHROPIC_API_KEY=sk-ant-xxx    # For Anthropic Claude
GROQ_API_KEY=gsk_xxx            # For Groq
GITHUB_TOKEN=ghp_xxx            # For GitHub Models
```

## Rate Limiting

All endpoints implement rate limiting to prevent abuse.

### Rate Limit Tiers

| Endpoint Type | Requests/Minute | Window |
|--------------|-----------------|--------|
| AI Endpoints | 10 | 60 seconds |
| KV Store | 100 | 60 seconds |
| General | 60 | 60 seconds |

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2025-01-15T10:30:00.000Z
```

### Rate Limit Response

When rate limit is exceeded:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 405 | Method Not Allowed | HTTP method not supported |
| 408 | Request Timeout | External API timeout |
| 413 | Payload Too Large | Request body exceeds size limit |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Production Error Messages

In production (`NODE_ENV=production`), error messages are sanitized:
- No stack traces exposed
- Generic error messages for security
- Detailed errors logged server-side

## AI Endpoints

### POST /api/ai

Stream AI responses using Anthropic or Groq.

#### Request

```http
POST /api/ai HTTP/1.1
Content-Type: application/json

{
  "prompt": "Translate 'Hello' to Spanish",
  "provider": "anthropic",
  "model": "claude-3-haiku-20240307"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| prompt | string | Yes | The prompt to send to AI (max 10,000 chars) |
| provider | string | Yes | AI provider: "anthropic" or "groq" |
| model | string | Yes | Model name to use |

#### Supported Models

**Anthropic:**
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku-20241022`

**Groq:**
- `llama-3.1-70b-versatile`
- `llama-3.1-8b-instant`
- `mixtral-8x7b-32768`

#### Response

Server-Sent Events (SSE) stream:

```
Content-Type: text/event-stream

data: {"text":"Hola"}

data: {"text":" mundo"}

data: [DONE]
```

#### Error Response

```
data: {"error":"Error message"}
```

#### Example (cURL)

```bash
curl -X POST https://24toolkit.com/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a haiku about coding",
    "provider": "anthropic",
    "model": "claude-3-haiku-20240307"
  }'
```

#### Example (JavaScript)

```javascript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Explain quantum computing',
    provider: 'anthropic',
    model: 'claude-3-haiku-20240307'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;
      
      const json = JSON.parse(data);
      console.log(json.text);
    }
  }
}
```

### POST /_spark/llm

OpenAI-compatible chat completions endpoint.

#### Request

```http
POST /_spark/llm HTTP/1.1
Content-Type: application/json

{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "What is TypeScript?"
    }
  ],
  "max_tokens": 1024
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | No | Model name (defaults to gpt-4o-mini) |
| messages | array | Yes | Array of message objects (max 50) |
| max_tokens | number | No | Maximum tokens (default: 1024) |

#### Message Object

```json
{
  "role": "user|assistant|system",
  "content": "Message text (max 50,000 chars)"
}
```

#### Model Mapping

Requests are automatically mapped to available providers:

| Requested Model | Actual Provider | Actual Model |
|----------------|-----------------|--------------|
| gpt-4o | Anthropic | claude-3-5-sonnet-20241022 |
| gpt-4o-mini | Anthropic | claude-3-5-haiku-20241022 |
| claude-3-opus | Anthropic | claude-3-opus-20240229 |

If Anthropic is not configured, falls back to GitHub Models.

#### Response

OpenAI-compatible format:

```json
{
  "id": "msg_01abc123",
  "object": "chat.completion",
  "created": 1705315200,
  "model": "claude-3-5-haiku-20241022",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "TypeScript is a programming language..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 50,
    "total_tokens": 65
  }
}
```

#### Example (JavaScript)

```javascript
const response = await fetch('/_spark/llm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Hello!' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

## Spark Runtime Endpoints

### GET/POST /_spark/user

Returns user information (currently returns anonymous user).

#### Request

```http
GET /_spark/user HTTP/1.1
```

#### Response

```json
{
  "user": null
}
```

### GET/POST /_spark/loaded

Telemetry endpoint for tracking app loads.

#### Request

```http
POST /_spark/loaded HTTP/1.1
```

#### Response

```json
{
  "success": true
}
```

## KV Store Endpoints

Simple key-value storage (currently in-memory, resets on cold starts).

⚠️ **Warning**: Data is not persistent. For production, use Vercel KV or Upstash Redis.

### GET /_spark/kv

List all keys in the store.

#### Request

```http
GET /_spark/kv HTTP/1.1
```

#### Response

```json
{
  "keys": ["user-preferences", "session-data"]
}
```

### POST /_spark/kv

Set a key-value pair.

#### Request

```http
POST /_spark/kv HTTP/1.1
Content-Type: application/json

{
  "key": "user-preferences",
  "value": {
    "theme": "dark",
    "language": "en"
  }
}
```

#### Response

```json
{
  "ok": true,
  "key": "user-preferences"
}
```

### DELETE /_spark/kv

Clear all keys.

#### Request

```http
DELETE /_spark/kv HTTP/1.1
```

#### Response

```json
{
  "ok": true,
  "cleared": true
}
```

### GET /_spark/kv/:key

Get value for a specific key.

#### Request

```http
GET /_spark/kv/user-preferences HTTP/1.1
```

#### Response

```json
{
  "value": {
    "theme": "dark",
    "language": "en"
  }
}
```

Returns `null` for non-existent keys, empty array `[]` for array-like keys.

### POST /_spark/kv/:key

Set value for a specific key.

#### Request

```http
POST /_spark/kv/user-preferences HTTP/1.1
Content-Type: application/json

{
  "theme": "light",
  "language": "es"
}
```

#### Request Limits

- Key length: max 1000 characters
- Value size: max 1MB
- No path traversal characters (`..`, `/`, `\`)

#### Response

```json
{
  "ok": true,
  "key": "user-preferences"
}
```

### DELETE /_spark/kv/:key

Delete a specific key.

#### Request

```http
DELETE /_spark/kv/user-preferences HTTP/1.1
```

#### Response

```json
{
  "ok": true,
  "deleted": "user-preferences"
}
```

## Response Formats

### Success Response

```json
{
  "data": "Response data varies by endpoint"
}
```

### Error Response

```json
{
  "error": "Human-readable error message"
}
```

### Validation Error

```json
{
  "error": "Valid prompt string is required"
}
```

### Rate Limit Error

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

## Best Practices

### 1. Handle Rate Limits

```javascript
async function makeRequest(url, options) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const data = await response.json();
    const retryAfter = data.retryAfter || 60;
    
    console.log(`Rate limited. Retry after ${retryAfter}s`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    
    return makeRequest(url, options);
  }
  
  return response;
}
```

### 2. Handle Timeouts

All external API calls have 30-second timeouts:

```javascript
try {
  const response = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(35000) // Slightly longer than server timeout
  });
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.error('Request timed out');
  }
}
```

### 3. Validate Input Client-Side

```javascript
function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }
  if (prompt.length > 10000) {
    throw new Error('Prompt exceeds maximum length of 10,000 characters');
  }
  return true;
}
```

### 4. Handle Streaming Properly

```javascript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, provider, model })
});

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;
      
      try {
        const json = JSON.parse(data);
        if (json.error) {
          console.error('Stream error:', json.error);
        } else if (json.text) {
          // Process text chunk
          processChunk(json.text);
        }
      } catch (e) {
        console.error('Failed to parse chunk:', e);
      }
    }
  }
}
```

## Changelog

### v1.0.0 (2025-01-15)

- Initial API documentation
- Added rate limiting to all endpoints
- Added input validation
- Added timeout handling
- Improved error responses
- Added structured logging

---

**For support or questions**, please open an issue on GitHub.

/**
 * Strict AI Prompts Library
 * Centralized, well-defined prompts for all AI tools
 */

export const AI_PROMPTS = {
  /**
   * AI Hashtag Generator
   */
  HASHTAG_GENERATOR: (content: string) => {
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(content)
    const langInstruction = isArabic 
      ? 'IMPORTANT: The content is in Arabic. Include Arabic hashtags where appropriate.'
      : ''
    
    return `You are a professional social media strategist and hashtag expert.

TASK: Generate exactly 15-20 relevant, trending hashtags for the following content.

${langInstruction}

RULES:
1. Return ONLY hashtags, one per line
2. Start each hashtag with # symbol
3. Use a mix of:
   - Popular hashtags (high engagement)
   - Niche-specific hashtags (targeted reach)
   - Branded hashtags (unique to content)
4. No explanations, no numbering, no extra text
5. Maximum 2-3 words per hashtag
6. Use CamelCase for multi-word hashtags
7. Avoid banned or spam hashtags
8. Ensure hashtags are relevant to the content
9. If content is in Arabic, include Arabic hashtags

CONTENT:
${content}

OUTPUT FORMAT:
#ExactlyLikeThis
#OnePerLine
#NoExtraText`
  },

  /**
   * AI Translator
   */
  TRANSLATOR: (text: string, targetLanguage: string) => `You are a professional translator with native-level fluency in ${targetLanguage}.

TASK: Translate the following text to ${targetLanguage}.

RULES:
1. Return ONLY the translation, nothing else
2. No explanations, no notes, no metadata
3. Preserve the original tone and style
4. Maintain formatting (line breaks, punctuation)
5. Use natural, context-aware language
6. Handle idioms and cultural expressions appropriately
7. If text contains code or technical terms, keep them unchanged
8. Do NOT translate:
   - URLs
   - Email addresses
   - Programming code
   - Product names (unless commonly translated)

TEXT TO TRANSLATE:
${text}

OUTPUT: [Translation only, no prefix like "Translation:" or "Here is:"]`,

  /**
   * AI Email Writer
   */
  EMAIL_WRITER: (topic: string, tone: string) => {
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(topic)
    const langInstruction = isArabic 
      ? 'IMPORTANT: The topic is in Arabic. Write the entire email in Arabic with proper Arabic formatting.'
      : ''
    
    return `You are a professional email copywriter.

TASK: Write a complete, professional email about: "${topic}"

REQUIRED TONE: ${tone}

${langInstruction}

RULES:
1. Include proper email structure:
   - Subject line (start with "Subject: " or "الموضوع: " for Arabic)
   - Greeting
   - Body (2-3 paragraphs)
   - Closing
   - Signature placeholder
2. Use ${tone} tone throughout
3. Be clear, concise, and actionable
4. No placeholder text like [Your Name]
5. Subject line must be compelling (under 60 characters)
6. Body paragraphs should be focused and purposeful
7. Include a clear call-to-action if appropriate
8. RESPOND IN THE SAME LANGUAGE as the topic

OUTPUT FORMAT:
Subject: [Your subject line]

[Greeting],

[Body paragraph 1]

[Body paragraph 2]

[Closing],
[Signature]`
  },

  /**
   * AI Task Builder
   */
  TASK_BUILDER: (project: string, duration: string) => {
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(project)
    const langInstruction = isArabic 
      ? 'IMPORTANT: The project description is in Arabic. Write all task descriptions in Arabic.'
      : ''
    
    return `You are an expert project manager and task breakdown specialist.

PROJECT: ${project}
DURATION: ${duration}

TASK: Break down this project into actionable tasks.

${langInstruction}

RULES:
1. Return a JSON array ONLY, no other text
2. Each task must be a simple string
3. Create 5-10 tasks depending on project scope
4. Tasks should be:
   - Specific and actionable
   - Ordered logically (start to finish)
   - Realistic for the given duration
   - One clear action per task
5. Use imperative verbs (Create, Design, Implement, Test, etc. or Arabic equivalents)
6. No subtasks or nested lists
7. WRITE TASKS IN THE SAME LANGUAGE as the project description

OUTPUT FORMAT (JSON only):
["Task 1 description", "Task 2 description", "Task 3 description"]

IMPORTANT: Return ONLY the JSON array, no markdown, no explanation.`
  },

  /**
   * Idea Analyzer
   */
  IDEA_ANALYZER: (idea: string) => {
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(idea)
    const lang = isArabic ? 'Arabic' : 'English'
    
    return `You are an expert business analyst and startup consultant with 15+ years of experience.

IDEA TO ANALYZE: "${idea}"

TASK: Provide a comprehensive, honest analysis.

RULES:
1. Write in plain text format (NOT JSON)
2. Be brutally honest - include real risks
3. Provide actionable, specific advice
4. Use data-driven insights when possible
5. WRITE EVERYTHING IN ${lang.toUpperCase()}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## ${isArabic ? 'الإمكانيات' : 'POTENTIAL'}
[Write 2-3 paragraphs about the potential, target audience, key strengths, and market opportunity]

## ${isArabic ? 'المخاطر' : 'RISKS'}
• [Risk 1 with explanation]
• [Risk 2 with explanation]
• [Risk 3 with explanation]

## ${isArabic ? 'الاقتراحات' : 'SUGGESTIONS'}
• [Actionable suggestion 1 with specific steps]
• [Actionable suggestion 2 with specific steps]
• [Actionable suggestion 3 with specific steps]

IMPORTANT:
- Be specific, not generic
- Include numbers/estimates when relevant
- Focus on actionability
- Write in ${lang} only`
  },

  /**
   * Text Summarizer
   */
  TEXT_SUMMARIZER: (text: string, length: 'short' | 'medium' | 'long') => {
    const lengths = {
      short: '2-3 sentences (50-75 words)',
      medium: '1 paragraph (100-150 words)',
      long: '2-3 paragraphs (200-300 words)'
    }
    
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(text)
    const langInstruction = isArabic 
      ? 'IMPORTANT: The input is in Arabic. Respond in Arabic with RTL-friendly formatting.'
      : ''
    
    return `You are a professional content summarizer.

TASK: Summarize the following text in ${lengths[length]}.

${langInstruction}

RULES:
1. Return ONLY the summary, no prefix like "Summary:" or "Here is:" or "ملخص:"
2. Capture the main ideas and key points
3. Maintain the original meaning and context
4. Use clear, concise language
5. Do NOT add your own opinions or interpretations
6. Preserve important facts, names, and numbers
7. Target length: ${lengths[length]}
8. No bullet points unless the original used them
9. RESPOND IN THE SAME LANGUAGE as the input text

TEXT TO SUMMARIZE:
${text}

OUTPUT: [Summary only, in same language as input]`
  },

  /**
   * Paragraph Rewriter
   */
  PARAGRAPH_REWRITER: (text: string, style: string) => {
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(text)
    const langInstruction = isArabic 
      ? 'IMPORTANT: The input is in Arabic. Respond in Arabic.'
      : ''
    
    return `You are an expert copywriter and content editor.

TASK: Rewrite the following paragraph in ${style} style.

${langInstruction}

RULES:
1. Return ONLY the rewritten paragraph, no explanations
2. Maintain the core message and key information
3. Apply ${style} style characteristics:
   ${style === 'professional' ? '- Formal tone, industry-standard language, polished' : ''}
   ${style === 'casual' ? '- Friendly, conversational, approachable' : ''}
   ${style === 'creative' ? '- Engaging, vivid, imaginative language' : ''}
   ${style === 'concise' ? '- Short sentences, direct, no fluff' : ''}
4. Preserve any important facts, numbers, or names
5. Keep approximately the same length (unless style is "concise")
6. No meta-commentary or introductions
7. RESPOND IN THE SAME LANGUAGE as the input text

ORIGINAL TEXT:
${text}

OUTPUT: [Rewritten paragraph only, in same language as input]`
  },

  /**
   * Grammar Corrector
   */
  GRAMMAR_CORRECTOR: (text: string) => {
    // Detect if input is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(text)
    const langInstruction = isArabic 
      ? 'IMPORTANT: The input is in Arabic. Correct Arabic grammar and respond in Arabic.'
      : ''
    
    return `You are a professional editor and grammar expert.

TASK: Correct all grammar, spelling, and punctuation errors in the following text.

${langInstruction}

RULES:
1. Return ONLY the corrected text, no explanations or prefixes
2. Fix:
   - Grammar mistakes
   - Spelling errors
   - Punctuation issues
   - Capitalization
   - Verb tense consistency
3. Preserve:
   - Original meaning and intent
   - Author's voice and style
   - Line breaks and formatting
   - Intentional stylistic choices
4. Do NOT:
   - Rewrite or rephrase unnecessarily
   - Add or remove content
   - Change sentence structure unless grammatically required
5. If text is already perfect, return it unchanged
6. RESPOND IN THE SAME LANGUAGE as the input text

TEXT TO CORRECT:
${text}

OUTPUT: [Corrected text only]`
  },

  /**
   * Code Formatter
   */
  CODE_FORMATTER: (code: string, language: string) => `You are an expert programmer and code formatter.

TASK: Format and beautify the following ${language} code.

RULES:
1. Return ONLY the formatted code, no explanations
2. Apply proper indentation (2 or 4 spaces, language-standard)
3. Add consistent spacing
4. Follow ${language} style guidelines and best practices
5. Preserve all functionality - do NOT modify logic
6. Do NOT add comments unless improving existing ones
7. Do NOT change variable/function names
8. If code has syntax errors, fix them if obvious

CODE TO FORMAT:
\`\`\`${language}
${code}
\`\`\`

OUTPUT: [Formatted code only, no markdown wrapper]`
}

/**
 * Prompt validation helper
 */
export function validatePromptInput(input: string, minLength: number = 3, maxLength: number = 10000): void {
  if (!input || input.trim().length < minLength) {
    throw new Error(`Input must be at least ${minLength} characters long`)
  }
  if (input.length > maxLength) {
    throw new Error(`Input must not exceed ${maxLength} characters`)
  }
}

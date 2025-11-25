import Groq from "groq-sdk"

let groqClient: Groq | null = null

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Please add it to your environment variables.",
    )
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: apiKey,
    })
  }

  return groqClient
}

export interface ComparisonResult {
  product1: {
    name: string
    brand: string
    image: string
  }
  product2: {
    name: string
    brand: string
    image: string
  }
  category: string
  summary: string
  comparison_sections: Array<{
    title: string
    product1_points: string[]
    product2_points: string[]
    winner: "product1" | "product2" | "tie"
  }>
  pros_cons: {
    product1: {
      pros: string[]
      cons: string[]
    }
    product2: {
      pros: string[]
      cons: string[]
    }
  }
  verdict: {
    overall: string
    best_for_product1: string[]
    best_for_product2: string[]
  }
  faqs: Array<{
    question: string
    answer: string
  }>
}

export async function generateComparison(
  product1: string,
  product2: string,
  category: string | null = null,
  language = "en",
): Promise<ComparisonResult> {
  // Validate inputs
  if (!product1?.trim() || !product2?.trim()) {
    throw new Error("Both products are required")
  }

  // Auto-detect category if not provided
  const detectedCategory = category || detectCategory(product1, product2)

  const prompt = `You are an expert product comparison analyst.

Compare these two products in comprehensive detail:
- Product 1: ${product1}
- Product 2: ${product2}
- Category: ${detectedCategory}

Provide a detailed, objective comparison including:

1. SUMMARY (2-3 sentences overview)

2. KEY SPECIFICATIONS TABLE
   Compare main specs side-by-side

3. DETAILED COMPARISON SECTIONS:
   - Design & Build Quality
   - Performance & Features  
   - User Experience
   - Value for Money

4. PROS AND CONS
   List 5 pros and 5 cons for each product

5. FINAL VERDICT
   - Overall recommendation
   - Best for Product 1: (3 use cases)
   - Best for Product 2: (3 use cases)

6. FAQs (10 questions with detailed answers)

IMPORTANT:
- Be objective and balanced
- Use real specs and features
- Be detailed and helpful
- Format response as clean JSON

JSON STRUCTURE:
{
  "product1": { "name": "${product1}", "brand": "", "image": "" },
  "product2": { "name": "${product2}", "brand": "", "image": "" },
  "category": "${detectedCategory}",
  "summary": "",
  "comparison_sections": [
    {
      "title": "",
      "product1_points": [],
      "product2_points": [],
      "winner": "product1" | "product2" | "tie"
    }
  ],
  "pros_cons": {
    "product1": { "pros": [], "cons": [] },
    "product2": { "pros": [], "cons": [] }
  },
  "verdict": {
    "overall": "",
    "best_for_product1": [],
    "best_for_product2": []
  },
  "faqs": [
    { "question": "", "answer": "" }
  ]
}`

  const groq = getGroqClient()

  // Retry logic with exponential backoff
  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert product comparison analyst. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from AI")
      }

      // Parse and validate response
      const result = JSON.parse(content) as ComparisonResult

      // Validate structure
      if (!validateComparisonResult(result)) {
        throw new Error("Invalid response structure from AI")
      }

      return result
    } catch (error) {
      console.error(`[v0] Groq API attempt ${attempt} failed:`, error)
      lastError = error as Error

      // Wait before retry (exponential backoff)
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  // All retries failed
  throw new Error(`Failed to generate comparison after 3 attempts: ${lastError?.message}`)
}

function detectCategory(product1: string, product2: string): string {
  const combined = `${product1} ${product2}`.toLowerCase()

  const categories = {
    Technology: ["phone", "laptop", "computer", "tablet", "watch", "iphone", "samsung", "mac", "pc", "android", "ios"],
    Streaming: ["netflix", "disney", "hbo", "hulu", "prime", "spotify", "apple music", "youtube"],
    Automotive: ["car", "suv", "sedan", "electric", "gas", "tesla", "toyota", "honda"],
    "E-commerce": ["amazon", "walmart", "ebay", "shopify", "wix", "target"],
    "Social Media": ["facebook", "instagram", "tiktok", "twitter", "snapchat"],
    Travel: ["airbnb", "hotel", "uber", "lyft", "booking", "expedia"],
    "Health & Fitness": ["gym", "workout", "diet", "keto", "paleo", "vegan"],
    "Food & Beverage": ["coffee", "tea", "matcha", "energy drink"],
    Finance: ["bitcoin", "ethereum", "crypto", "stock", "gold"],
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => combined.includes(keyword))) {
      return category
    }
  }

  return "General"
}

function validateComparisonResult(result: any): result is ComparisonResult {
  return (
    result &&
    typeof result === "object" &&
    result.product1 &&
    result.product2 &&
    result.summary &&
    Array.isArray(result.comparison_sections) &&
    result.pros_cons &&
    result.verdict &&
    Array.isArray(result.faqs)
  )
}

export function generateSEO(product1: string, product2: string, category: string) {
  return {
    title: `${product1} vs ${product2}: Complete Comparison Guide 2024`,
    description: `Detailed comparison of ${product1} and ${product2}. Find out which ${category.toLowerCase()} product is better for your needs with our comprehensive analysis.`,
    keywords: [product1, product2, "comparison", "vs", category, "review", "which is better"],
  }
}

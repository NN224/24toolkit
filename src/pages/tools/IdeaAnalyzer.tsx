import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkle, Lightbulb } from '@phosphor-icons/react';
import { AIBadge } from '@/components/ai/AIBadge';
import { callAI } from '@/lib/ai';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

interface AnalysisResult {
  potential: string;
  risks: string;
  suggestions: string;
}

export default function IdeaAnalyzer() {
  // Set SEO metadata
  const metadata = getPageMetadata('idea-analyzer')
  useSEO(metadata)

  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      toast.error('Please enter an idea to analyze.');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    const systemPrompt = `You are an expert business analyst and startup consultant. Analyze the following idea and provide a structured analysis.

Idea: "${idea}"

Provide the analysis in three parts:
1.  **Potential**: What is the potential of this idea? Who is the target audience? What are its key strengths?
2.  **Risks**: What are the primary risks and challenges? What are the potential market or execution hurdles?
3.  **Suggestions**: What are 3-5 actionable suggestions to improve or execute this idea?

Format your response as a JSON object with three keys: "potential", "risks", and "suggestions". Do not include any other text or markdown formatting.`;

    try {
      const result = await callAI(systemPrompt, 'anthropic');
      
      // Try to parse JSON response
      let parsedResult: AnalysisResult;
      try {
        parsedResult = JSON.parse(result);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // If JSON parsing fails, try to extract sections manually
        const sections = result.split(/\n\n+/);
        parsedResult = {
          potential: sections[0] || result,
          risks: sections[1] || 'Please review the complete analysis above.',
          suggestions: sections[2] || 'Please review the complete analysis above.'
        };
      }
      
      // Validate that we have the required fields and format them properly
      const formatValue = (value: any): string => {
        if (typeof value === 'string') return value;
        
        // Handle arrays - convert to bullet points
        if (Array.isArray(value)) {
          return value.map(item => `• ${String(item)}`).join('\n');
        }
        
        // Handle objects - convert to readable format
        if (typeof value === 'object' && value !== null) {
          return Object.entries(value)
            .map(([key, val]) => {
              const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              if (Array.isArray(val)) {
                const items = val.map(item => `  • ${String(item)}`).join('\n');
                return `${formattedKey}:\n${items}`;
              }
              return `${formattedKey}: ${String(val)}`;
            })
            .join('\n\n');
        }
        
        return String(value || '');
      };
      
      parsedResult = {
        potential: formatValue(parsedResult.potential) || result,
        risks: formatValue(parsedResult.risks) || 'Analysis pending',
        suggestions: formatValue(parsedResult.suggestions) || 'Analysis pending'
      };
      
      setAnalysis(parsedResult);
      toast.success('Idea analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze the idea. The AI might be busy, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">AI Idea Analyzer</h1>
          <p className="text-lg text-muted-foreground mt-3">Get instant feedback on your next big idea from an AI expert.</p>
          <AIBadge className="mt-2 inline-block" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={24} />
              Describe Your Idea
            </CardTitle>
            <CardDescription>
              Be as detailed as you can. What problem does it solve? Who is it for?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="For example: 'A mobile app that uses AI to create personalized workout plans based on user's available equipment and fitness level...'"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={6}
              disabled={isLoading}
            />
            <Button onClick={handleAnalyze} disabled={isLoading || !idea.trim()} className="w-full gap-2">
              <Sparkle size={18} weight="fill" />
              {isLoading ? 'Analyzing...' : 'Analyze Idea'}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-8">
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-muted-foreground">AI is analyzing your idea...</p>
          </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Potential</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{String(analysis.potential)}</p>
                </div>
                <hr />
                <div>
                  <h3 className="font-semibold text-lg">Risks</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{String(analysis.risks)}</p>
                </div>
                <hr />
                <div>
                  <h3 className="font-semibold text-lg">Suggestions</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{String(analysis.suggestions)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

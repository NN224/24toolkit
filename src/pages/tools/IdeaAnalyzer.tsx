import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkle, Lightbulb, CheckCircle, Warning, ArrowRight } from '@phosphor-icons/react';
import { AIBadge } from '@/components/ai/AIBadge';
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner';
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector';
import { callAI } from '@/lib/ai';
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts';
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
  const [provider, setProvider] = useState<AIProvider>('anthropic');
  const [isArabic, setIsArabic] = useState(false);

  // Detect if input is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(idea));
  }, [idea]);

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      toast.error(isArabic ? 'الرجاء إدخال فكرة للتحليل' : 'Please enter an idea to analyze.');
      return;
    }

    try {
      validatePromptInput(idea, 10, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    const systemPrompt = AI_PROMPTS.IDEA_ANALYZER(idea);

    try {
      const result = await callAI(systemPrompt, provider);
      
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
          risks: sections[1] || (isArabic ? 'يرجى مراجعة التحليل الكامل أعلاه.' : 'Please review the complete analysis above.'),
          suggestions: sections[2] || (isArabic ? 'يرجى مراجعة التحليل الكامل أعلاه.' : 'Please review the complete analysis above.')
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
        risks: formatValue(parsedResult.risks) || (isArabic ? 'التحليل قيد المعالجة' : 'Analysis pending'),
        suggestions: formatValue(parsedResult.suggestions) || (isArabic ? 'التحليل قيد المعالجة' : 'Analysis pending')
      };
      
      setAnalysis(parsedResult);
      toast.success(isArabic ? 'تم تحليل الفكرة بنجاح!' : 'Idea analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(isArabic ? 'فشل تحليل الفكرة. يرجى المحاولة مرة أخرى.' : 'Failed to analyze the idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">
            {isArabic ? 'محلل الأفكار الذكي' : 'AI Idea Analyzer'}
          </h1>
          <p className="text-lg text-muted-foreground mt-3">
            {isArabic ? 'احصل على تحليل فوري لفكرتك من خبير AI' : 'Get instant feedback on your next big idea from an AI expert.'}
          </p>
          <AIBadge className="mt-2 inline-block" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={24} />
              {isArabic ? 'اوصف فكرتك' : 'Describe Your Idea'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'كن مفصلاً قدر الإمكان. ما المشكلة التي تحلها؟ لمن هي؟' : 'Be as detailed as you can. What problem does it solve? Who is it for?'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={isArabic 
                ? 'مثال: تطبيق جوال يستخدم AI لإنشاء خطط تمارين شخصية...'
                : "For example: 'A mobile app that uses AI to create personalized workout plans...'"
              }
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={6}
              disabled={isLoading}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={isArabic ? 'text-right' : ''}
            />
            
            <AIProviderSelector value={provider} onValueChange={setProvider} />
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !idea.trim()} 
              className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkle size={18} weight="fill" />
              {isLoading 
                ? (isArabic ? 'جاري التحليل...' : 'Analyzing...') 
                : (isArabic ? 'حلل الفكرة' : 'Analyze Idea')
              }
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-8">
            <AILoadingSpinner />
            <p className="mt-4 text-muted-foreground">
              {isArabic ? 'AI يحلل فكرتك...' : 'AI is analyzing your idea...'}
            </p>
          </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Potential Card */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle size={24} weight="fill" />
                  {isArabic ? 'الإمكانيات' : 'Potential'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{String(analysis.potential)}</p>
              </CardContent>
            </Card>

            {/* Risks Card */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Warning size={24} weight="fill" />
                  {isArabic ? 'المخاطر' : 'Risks'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{String(analysis.risks)}</p>
              </CardContent>
            </Card>

            {/* Suggestions Card */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <ArrowRight size={24} weight="bold" />
                  {isArabic ? 'الاقتراحات' : 'Suggestions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{String(analysis.suggestions)}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

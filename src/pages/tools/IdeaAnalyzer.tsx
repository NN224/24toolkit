import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkle, Lightbulb, Copy, Check, ShareNetwork } from '@phosphor-icons/react';
import { AIBadge } from '@/components/ai/AIBadge';
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner';
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector';
import { callAI } from '@/lib/ai';
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

export default function IdeaAnalyzer() {
  // Set SEO metadata
  const metadata = getPageMetadata('idea-analyzer')
  useSEO(metadata)

  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [provider, setProvider] = useState<AIProvider>('anthropic');
  const [isArabic, setIsArabic] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect if input is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(idea));
  }, [idea]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareText = `My idea analysis from 24Toolkit:\n\n${analysis.slice(0, 500)}...`;
    
    if (navigator.share) {
      navigator.share({
        title: '24Toolkit - Idea Analysis',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Link copied!');
    }
  };

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      toast.error('Please enter an idea to analyze.');
      return;
    }

    try {
      validatePromptInput(idea, 10, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input');
      return;
    }

    setIsLoading(true);
    setAnalysis('');

    const systemPrompt = AI_PROMPTS.IDEA_ANALYZER(idea);

    try {
      await callAI(systemPrompt, provider, (text) => {
        setAnalysis(text);
      });
      
      toast.success('Idea analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze the idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">
            AI Idea Analyzer
          </h1>
          <p className="text-lg text-muted-foreground mt-3">
            Get instant feedback on your next big idea from an AI expert.
          </p>
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
              placeholder="For example: 'A mobile app that uses AI to create personalized workout plans...'"
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
              {isLoading ? 'Analyzing...' : 'Analyze Idea'}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-8">
            <AILoadingSpinner />
            <p className="mt-4 text-muted-foreground">
              AI is analyzing your idea...
            </p>
          </div>
        )}

        {analysis && (
          <Card className="mt-8" dir={isArabic ? 'rtl' : 'ltr'}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={24} className="text-yellow-500" />
                Analysis Result
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <ShareNetwork size={16} />
                  Share
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {analysis}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

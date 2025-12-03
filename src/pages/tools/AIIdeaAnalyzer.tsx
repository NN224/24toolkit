import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkle, Lightbulb, Copy, Check, ShareNetwork } from '@phosphor-icons/react';
import { AIBadge } from '@/components/ai/AIBadge';
import { AILoadingSpinner } from '@/components/ai/AILoadingSpinner';
import { AIProviderSelector, type AIProvider } from '@/components/ai/AIProviderSelector';
import { useAIWithCredits } from '@/hooks/use-ai-with-credits';
import { AI_PROMPTS, validatePromptInput } from '@/lib/ai-prompts';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'

export default function IdeaAnalyzer() {
  const { t } = useTranslation();
  
  // Set SEO metadata
  const metadata = getPageMetadata('idea-analyzer')
  useSEO({ ...metadata, canonicalPath: '/tools/ai-idea-analyzer' })

  const [idea, setIdea] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  const [provider, setProvider] = useState<AIProvider>('anthropic');
  const [isArabic, setIsArabic] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { execute: analyzeIdea, isLoading, ConfettiEffect } = useAIWithCredits({
    successMessage: t('tools.ideaAnalyzer.successMessage'),
    celebrateOnSuccess: true,
  });

  // Detect if input is Arabic
  useEffect(() => {
    setIsArabic(/[\u0600-\u06FF]/.test(idea));
  }, [idea]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    toast.success(t('common.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareText = `${t('tools.ideaAnalyzer.resultTitle')} - 24Toolkit:\n\n${analysis.slice(0, 500)}...`;
    
    if (navigator.share) {
      navigator.share({
        title: `24Toolkit - ${t('tools.ideaAnalyzer.resultTitle')}`,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success(t('tools.ideaAnalyzer.linkCopied'));
    }
  };

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      toast.error(t('tools.ideaAnalyzer.emptyError'));
      return;
    }

    try {
      validatePromptInput(idea, 10, 1000);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'TOO_SHORT') {
        const validationError = error as { code: string; min?: number }
        toast.error(t('tools.common.inputTooShort', { min: validationError.min || 10 }))
      } else if (error instanceof Error && 'code' in error && error.code === 'TOO_LONG') {
        const validationError = error as { code: string; max?: number }
        toast.error(t('tools.common.inputTooLong', { max: validationError.max || 1000 }))
      } else {
        toast.error(error instanceof Error ? error.message : t('tools.common.invalidInput'))
      }
      return;
    }

    setAnalysis('');
    const systemPrompt = AI_PROMPTS.IDEA_ANALYZER(idea);
    
    await analyzeIdea(systemPrompt, provider, (text) => {
      setAnalysis(text);
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* Confetti celebration on success */}
      <ConfettiEffect />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">
            {t('tools.ideaAnalyzer.title')}
          </h1>
          <p className="text-lg text-muted-foreground mt-3">
            {t('tools.ideaAnalyzer.subtitle')}
          </p>
          <AIBadge className="mt-2 inline-block" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={24} />
              {t('tools.ideaAnalyzer.cardTitle')}
            </CardTitle>
            <CardDescription>
              {t('tools.ideaAnalyzer.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('tools.ideaAnalyzer.placeholder')}
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
              {isLoading ? t('tools.ideaAnalyzer.analyzing') : t('tools.ideaAnalyzer.analyzeButton')}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-8">
            <AILoadingSpinner />
            <p className="mt-4 text-muted-foreground">
              {t('tools.ideaAnalyzer.analyzingMessage')}
            </p>
          </div>
        )}

        {analysis && (
          <Card className="mt-8" dir={isArabic ? 'rtl' : 'ltr'}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={24} className="text-yellow-500" />
                {t('tools.ideaAnalyzer.resultTitle')}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <ShareNetwork size={16} />
                  {t('common.share')}
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

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="ai-idea-analyzer" category="ai" />
    </div>
  );
}

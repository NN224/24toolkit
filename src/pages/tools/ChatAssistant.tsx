/**
 * ChatAssistant Tool Page
 * This redirects to the floating chat assistant component
 * The main chat functionality is in src/components/ai/ChatAssistant.tsx
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatCircleDots, ArrowRight } from '@phosphor-icons/react';
import { AIBadge } from '@/components/ai/AIBadge';

export default function ChatAssistantPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Dispatch event to open the floating chat assistant
    window.dispatchEvent(new CustomEvent('open-chat-assistant'));
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">{t('tools.chatAssistant.title')}</h1>
          <p className="text-lg text-muted-foreground mt-3">{t('tools.chatAssistant.subtitle')}</p>
          <AIBadge className="mt-2 inline-block" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChatCircleDots size={24} weight="fill" className="text-purple-500" />
              {t('tools.chatAssistant.cardTitle')}
            </CardTitle>
            <CardDescription>
              {t('tools.chatAssistant.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-sky-500/10 rounded-lg p-6 text-center">
              <ChatCircleDots size={48} weight="fill" className="text-purple-500 mx-auto mb-4" />
              <p className="text-foreground mb-4">
                {t('tools.chatAssistant.lookForChat')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('tools.chatAssistant.assistantHelp')}
              </p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('tools.chatAssistant.browseAllTools')}
              <ArrowRight size={18} weight="bold" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

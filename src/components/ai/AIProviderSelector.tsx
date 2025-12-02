import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Sparkle, Lightning, GoogleLogo, Globe } from '@phosphor-icons/react'
import type { AIProvider } from '@/lib/ai'
import { useTranslation } from 'react-i18next'

// Re-export for convenience
export type { AIProvider }

interface AIProviderSelectorProps {
  value: AIProvider
  onValueChange: (value: AIProvider) => void
  label?: string
  className?: string
  showAll?: boolean // Show all providers or just primary ones
}

const PROVIDERS = {
  anthropic: { name: 'Claude', icon: Sparkle, descKey: 'aiProvider.highQuality' },
  groq: { name: 'Groq', icon: Lightning, descKey: 'aiProvider.fast' },
  gemini: { name: 'Gemini', icon: GoogleLogo, descKey: 'aiProvider.freeTier' },
  openrouter: { name: 'OpenRouter', icon: Globe, descKey: 'aiProvider.multiModel' },
}

/**
 * Reusable component for selecting AI provider
 * Supports: Anthropic Claude, Groq, Google Gemini, OpenRouter
 * Note: The backend has automatic fallback - selecting a provider is just a preference
 */
export function AIProviderSelector({ 
  value, 
  onValueChange, 
  label,
  className,
  showAll = false 
}: AIProviderSelectorProps) {
  const { t } = useTranslation()
  const providersToShow = showAll 
    ? (['anthropic', 'groq', 'gemini', 'openrouter'] as AIProvider[])
    : (['anthropic', 'groq'] as AIProvider[])

  return (
    <div className={className}>
      <Label className="text-sm text-muted-foreground">{label || t('aiProvider.label')}</Label>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onValueChange(val as AIProvider)}
        className="w-full justify-start mt-2 flex-wrap"
        variant="outline"
      >
        {providersToShow.map((providerId) => {
          const provider = PROVIDERS[providerId]
          const Icon = provider.icon
          return (
            <ToggleGroupItem 
              key={providerId}
              value={providerId} 
              className="flex-1 min-w-[100px] gap-1.5"
              title={t(provider.descKey)}
            >
              <Icon size={16} weight="bold" />
              {provider.name}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
      <p className="text-xs text-muted-foreground mt-1">
        {t('aiProvider.autoFallback')}
      </p>
    </div>
  )
}

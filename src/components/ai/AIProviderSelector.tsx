import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Sparkle, Lightning, GoogleLogo, Globe } from '@phosphor-icons/react'
import type { AIProvider } from '@/lib/ai'

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
  anthropic: { name: 'Claude', icon: Sparkle, description: 'High quality' },
  groq: { name: 'Groq', icon: Lightning, description: 'Fast' },
  gemini: { name: 'Gemini', icon: GoogleLogo, description: 'Free tier' },
  openrouter: { name: 'OpenRouter', icon: Globe, description: 'Multi-model' },
}

/**
 * Reusable component for selecting AI provider
 * Supports: Anthropic Claude, Groq, Google Gemini, OpenRouter
 * Note: The backend has automatic fallback - selecting a provider is just a preference
 */
export function AIProviderSelector({ 
  value, 
  onValueChange, 
  label = 'AI Provider',
  className,
  showAll = false 
}: AIProviderSelectorProps) {
  const providersToShow = showAll 
    ? (['anthropic', 'groq', 'gemini', 'openrouter'] as AIProvider[])
    : (['anthropic', 'groq'] as AIProvider[])

  return (
    <div className={className}>
      <Label className="text-sm text-muted-foreground">{label}</Label>
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
              title={provider.description}
            >
              <Icon size={16} weight="bold" />
              {provider.name}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
      <p className="text-xs text-muted-foreground mt-1">
        Auto-fallback enabled if provider is unavailable
      </p>
    </div>
  )
}

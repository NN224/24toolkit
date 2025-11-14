import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export type AIProvider = 'anthropic' | 'groq'

interface AIProviderSelectorProps {
  value: AIProvider
  onValueChange: (value: AIProvider) => void
  label?: string
  className?: string
}

/**
 * Reusable component for selecting AI provider (Anthropic Claude or Groq)
 */
export function AIProviderSelector({ 
  value, 
  onValueChange, 
  label = 'AI Provider',
  className 
}: AIProviderSelectorProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onValueChange(val as AIProvider)}
        className="w-full justify-start mt-2"
        variant="outline"
      >
        <ToggleGroupItem value="anthropic" className="flex-1">
          Anthropic Claude
        </ToggleGroupItem>
        <ToggleGroupItem value="groq" className="flex-1">
          Groq
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

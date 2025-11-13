import { Brain } from '@phosphor-icons/react'

export function AILoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain size={24} weight="bold" className="text-accent animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">
        AI is thinking...
      </p>
    </div>
  )
}

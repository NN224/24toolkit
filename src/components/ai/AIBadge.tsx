import { Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AIBadgeProps {
  className?: string
}

export function AIBadge({ className }: AIBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
      "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      "border border-purple-500/20",
      "text-xs font-medium text-purple-700",
      className
    )}>
      <Sparkle size={12} weight="fill" className="text-purple-500" />
      AI Powered
    </div>
  )
}

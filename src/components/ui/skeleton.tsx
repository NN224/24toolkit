import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton", className)}
      {...props}
    />
  )
}

// Card Skeleton for tools grid
function ToolCardSkeleton() {
  return (
    <div className="h-full bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      {/* Icon and Badge row */}
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
      
      {/* Title */}
      <Skeleton className="w-3/4 h-6 mb-3" />
      
      {/* Description lines */}
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-2/3 h-4" />
    </div>
  )
}

// Grid of skeleton cards
function ToolGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Text skeleton for AI output
function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
}

// Full page loading skeleton
function PageSkeleton() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="w-64 h-10 mx-auto" />
        <Skeleton className="w-96 h-6 mx-auto" />
      </div>
      
      {/* Content */}
      <ToolGridSkeleton count={6} />
    </div>
  )
}

export { Skeleton, ToolCardSkeleton, ToolGridSkeleton, TextSkeleton, PageSkeleton }

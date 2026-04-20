import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'circle' | 'button' | 'table'
  rows?: number
  animate?: boolean
}

export function LoadingSkeleton({
  className,
  variant = 'text',
  rows = 1,
  animate = true,
}: LoadingSkeletonProps) {
  const baseClass = cn(
    'bg-muted',
    animate && 'animate-pulse',
    className
  )

  if (variant === 'card') {
    return (
      <div className={cn('rounded-xl border bg-card p-6 shadow-subtle', className)}>
        <div className="space-y-3">
          <div className={cn(baseClass, 'h-4 w-3/4 rounded')} />
          <div className={cn(baseClass, 'h-4 w-full rounded')} />
          <div className={cn(baseClass, 'h-4 w-5/6 rounded')} />
        </div>
      </div>
    )
  }

  if (variant === 'circle') {
    return <div className={cn(baseClass, 'rounded-full', className)} />
  }

  if (variant === 'button') {
    return <div className={cn(baseClass, 'h-10 rounded-md', className)} />
  }

  if (variant === 'table') {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className={cn(baseClass, 'h-12 w-full rounded')} />
          </div>
        ))}
      </div>
    )
  }

  // Default text variant
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn(baseClass, 'h-4 rounded', className)} />
      ))}
    </div>
  )
}

// KPI Card Skeleton for Dashboard
export function KPICardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton variant="circle" className="h-5 w-5" />
      </div>
      <LoadingSkeleton className="h-8 w-32 mb-2" />
      <LoadingSkeleton className="h-3 w-40" />
    </div>
  )
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <LoadingSkeleton className="h-8 w-48 mb-2" />
          <LoadingSkeleton className="h-4 w-72" />
        </div>
        <LoadingSkeleton variant="button" className="w-[140px]" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <LoadingSkeleton variant="card" className="h-[300px]" />
        <LoadingSkeleton variant="card" className="h-[300px]" />
      </div>
    </div>
  )
}

// List Item Skeleton
export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <LoadingSkeleton variant="circle" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

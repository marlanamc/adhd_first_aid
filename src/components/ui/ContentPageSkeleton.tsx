import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ContentPageSkeletonProps {
  className?: string
}

export function ContentPageSkeleton({ className }: ContentPageSkeletonProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 sm:p-6',
        className
      )}
    >
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-white/20 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-3 mt-6">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from "@/_components/ui/skeleton";

/**
 * Global loading skeleton for page transitions
 * Provides visual feedback during navigation
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-1 w-24 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-12 w-48 mx-auto rounded-md" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

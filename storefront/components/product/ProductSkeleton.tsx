export function ProductSkeleton() {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 animate-skeleton" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full animate-skeleton" />
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-skeleton" />
        </div>
        
        {/* SKU */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-24 animate-skeleton" />
          <div className="h-3 bg-gray-200 rounded w-32 animate-skeleton" />
        </div>
        
        <hr className="my-2" />
        
        {/* Price */}
        <div className="h-8 bg-gray-200 rounded w-24 animate-skeleton" />
        
        {/* Stock */}
        <div className="h-4 bg-gray-200 rounded w-28 animate-skeleton" />
        
        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-12 bg-gray-200 rounded animate-skeleton" />
          <div className="w-24 h-12 bg-gray-200 rounded animate-skeleton" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:p-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}

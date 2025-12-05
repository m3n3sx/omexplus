export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-neutral-200 rounded-t-xl" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-2/3" />
        <div className="h-8 bg-neutral-200 rounded w-1/3 mt-4" />
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
      <LoadingSkeleton />
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border-2 border-neutral-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-neutral-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  )
}

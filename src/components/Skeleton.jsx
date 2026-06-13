export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-1 bg-gray-200" />
      <div className="h-36 bg-gray-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-full" />
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between mt-3">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-3 bg-gray-200 rounded w-14" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="h-4 bg-gray-200 rounded flex-1" />
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-6 bg-gray-200 rounded-full w-16" />
    </div>
  )
}

export function SkeletonMetric() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="w-9 h-9 bg-gray-200 rounded-xl mb-3" />
      <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-24 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-10 w-64" />
          <Skeleton className="mx-auto h-5 w-96" />
        </div>

        {/* Categories filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>

        {/* Products grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-5">
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="mb-3 h-6 w-full" />
                <Skeleton className="mb-4 h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

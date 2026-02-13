export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton w-full aspect-[3/4] rounded-lg" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

export function CardGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <div className="skeleton h-6 w-32 mb-6 rounded" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="skeleton w-full md:w-72 aspect-[3/4] rounded-lg shrink-0" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="skeleton h-10 w-80 rounded" />
      <div className="skeleton h-5 w-60 rounded" />
      <div className="skeleton h-12 w-40 rounded-full mt-4" />
    </div>
  );
}

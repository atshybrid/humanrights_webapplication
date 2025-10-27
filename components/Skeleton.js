export function Skeleton({ className = '' }){
  return <div className={`animate-pulse bg-gray-200/80 ${className}`} />
}

export function CardSkeleton(){
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
      <Skeleton className="w-full h-36 rounded" />
      <Skeleton className="mt-3 h-5 w-2/3 rounded" />
      <Skeleton className="mt-2 h-4 w-full rounded" />
      <Skeleton className="mt-1 h-4 w-5/6 rounded" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function PillSkeleton(){
  return <Skeleton className="h-10 w-[240px] rounded-xl border border-gray-200" />
}

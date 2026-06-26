import Skeleton from "./Skeleton";

export default function JobCardSkeleton() {
  return (
    <article className="border border-hairline-soft bg-canvas p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <Skeleton className="h-4 w-36 rounded-nike-md" />
          <div className="mt-3">
            <Skeleton className="h-6 w-[420px] max-w-full rounded-nike-md" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-56 rounded-nike-md" />
          </div>
        </div>
        <Skeleton className="h-7 w-24 rounded-pill" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-[560px] max-w-full rounded-nike-md" />
        <Skeleton className="h-4 w-[520px] max-w-full rounded-nike-md" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20 rounded-pill" />
        <Skeleton className="h-7 w-24 rounded-pill" />
        <Skeleton className="h-7 w-20 rounded-pill" />
      </div>

      <div className="mt-6 flex gap-2">
        <Skeleton className="h-12 w-28 rounded-pill" />
        <Skeleton className="h-12 w-24 rounded-pill" />
      </div>
    </article>
  );
}
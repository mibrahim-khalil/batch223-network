import Skeleton from "./Skeleton";

export default function StudentCardSkeleton() {
  return (
    <div className="bg-canvas">
      <Skeleton className="aspect-square w-full" />
      <div className="pt-3 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-3 w-32" />
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-6 w-14 rounded-pill" />
          <Skeleton className="h-6 w-16 rounded-pill" />
          <Skeleton className="h-6 w-12 rounded-pill" />
        </div>
      </div>
    </div>
  );
}

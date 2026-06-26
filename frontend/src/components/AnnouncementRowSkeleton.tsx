import Skeleton from "./Skeleton";

export default function AnnouncementRowSkeleton() {
  return (
    <div className="py-6 border-b border-hairline-soft">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-28 rounded-pill" />
            <Skeleton className="h-4 w-24 rounded-nike-md" />
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-5 w-[420px] max-w-full rounded-nike-md" />
            <Skeleton className="h-4 w-[560px] max-w-full rounded-nike-md" />
            <Skeleton className="h-4 w-[520px] max-w-full rounded-nike-md" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-12 w-28 rounded-pill" />
          <Skeleton className="h-12 w-24 rounded-pill" />
        </div>
      </div>
    </div>
  );
}
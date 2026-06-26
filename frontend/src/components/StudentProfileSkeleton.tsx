import Skeleton from "./Skeleton";
import Navbar from "./Navbar";

export default function StudentProfileSkeleton() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <Skeleton className="h-44 md:h-64 w-full rounded-nike-none border-0" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-section">
        <div className="relative -mt-14 md:-mt-16">
          <Skeleton className="h-28 w-28 md:h-36 md:w-36 border border-hairline-soft" />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="w-full">
              <Skeleton className="h-3 w-24 rounded-nike-md" />
              <div className="mt-3">
                <Skeleton className="h-10 w-[520px] max-w-full rounded-nike-md" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-5 w-[420px] max-w-full rounded-nike-md" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-56 rounded-nike-md" />
              </div>
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-12 w-40 rounded-pill" />
              <Skeleton className="h-12 w-28 rounded-pill" />
            </div>
          </div>
        </div>

        <div className="mt-section grid lg:grid-cols-12 gap-12 border-t border-hairline pt-section">
          <div className="lg:col-span-8 space-y-section">
            <div>
              <Skeleton className="h-6 w-40 rounded-nike-md" />
              <div className="mt-6 space-y-2">
                <Skeleton className="h-4 w-[640px] max-w-full rounded-nike-md" />
                <Skeleton className="h-4 w-[600px] max-w-full rounded-nike-md" />
                <Skeleton className="h-4 w-[560px] max-w-full rounded-nike-md" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <Skeleton className="h-3 w-20 rounded-nike-md" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 rounded-pill" />
                <Skeleton className="h-8 w-28 rounded-pill" />
                <Skeleton className="h-8 w-20 rounded-pill" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
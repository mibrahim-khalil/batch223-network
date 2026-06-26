import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StudentCard from "../components/StudentCard";
import StudentCardSkeleton from "../components/StudentCardSkeleton";
import usePageLoading from "../hooks/usePageLoading";
import { listStudentsApi } from "../features/directory/directoryApi";
import type { StudentCardModel } from "../features/directory/mockStudents";

export default function Directory() {
  const loading = usePageLoading(500);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [items, setItems] = useState<StudentCardModel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [name, company, city, skill]);

  // Fetch (server-side search + pagination)
  useEffect(() => {
    let alive = true;

    const t = setTimeout(() => {
      (async () => {
        try {
          setErr(null);
          setBusy(true);

          const data = await listStudentsApi({
            name,
            company,
            city,
            skill,
            page,
            pageSize,
          });

          if (!alive) return;

          setItems(data.items);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } catch (e: any) {
          if (!alive) return;
          setErr(e?.message ?? "Failed to load directory");
          setItems([]);
          setTotal(0);
          setTotalPages(1);
        } finally {
          if (alive) setBusy(false);
        }
      })();
    }, 250); // small debounce

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [name, company, city, skill, page, pageSize]);

  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-hairline pb-8">
          <div>
            <p className="label">Network</p>
            <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
              Directory
            </h1>
            <p className="mt-3 text-mute">
              Connect with Batch223 alumni using filters like name, company, location, and expertise.
            </p>

            {err ? <p className="mt-4 text-sm text-sale">{err}</p> : null}
          </div>

          <div className="text-sm text-mute">
            Showing <span className="text-ink font-medium">{total}</span> results
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            className="field"
            placeholder="Search name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="field"
            placeholder="Search company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            className="field"
            placeholder="Search city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="field"
            placeholder="Search skills (e.g. React)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>

        <div className="mt-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading || busy
            ? Array.from({ length: 12 }).map((_, i) => (
                <StudentCardSkeleton key={i} />
              ))
            : items.map((s) => <StudentCard key={s.id} student={s} />)}
        </div>

        <div className="mt-section flex items-center justify-between gap-4 border-t border-hairline pt-8">
          <button
            className="btn-secondary"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ opacity: safePage <= 1 ? 0.5 : 1 }}
          >
            Previous
          </button>

          <div className="text-sm text-mute">
            Page <span className="text-ink font-medium">{safePage}</span> of{" "}
            <span className="text-ink font-medium">{totalPages}</span>
          </div>

          <button
            className="btn-secondary"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{ opacity: safePage >= totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import usePageLoading from "../hooks/usePageLoading";
import JobCardSkeleton from "../components/JobCardSkeleton";
import { useAuth } from "../features/auth/AuthProvider";
import { createJobApi, listJobsApi, type JobDto, type JobType } from "../features/jobs/jobsApi";

function includesCI(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

function splitSkills(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "job" | "intern";
}) {
  const cls =
    tone === "job"
      ? "border border-hairline bg-canvas text-ink"
      : tone === "intern"
      ? "bg-soft-cloud text-ink"
      : "border border-hairline bg-canvas text-mute";

  return (
    <span
      className={`inline-flex items-center rounded-pill px-4 py-2 text-xs font-medium tracking-widest uppercase ${cls}`}
    >
      {children}
    </span>
  );
}

export default function Jobs() {
  const loading = usePageLoading(450);
  const { user, isAdmin } = useAuth();

  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [items, setItems] = useState<JobDto[]>([]);
  const [refresh, setRefresh] = useState(0);

  const [composerOpen, setComposerOpen] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [cityCountry, setCityCountry] = useState("");
  const [type, setType] = useState<JobType>("Job");
  const [skillsText, setSkillsText] = useState("");
  const [link, setLink] = useState("");
  const [body, setBody] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");
  const [kind, setKind] = useState<"All" | JobType>("All");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(null);
        setBusy(true);
        const data = await listJobsApi({ page: 1, pageSize: 200 });
        if (!alive) return;
        setItems(data.items ?? []);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load jobs");
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  const published = items.filter((x) => x.status === "published");
  const myPending = items.filter(
    (x) => x.status === "pending" && x.authorEmail === (user?.email ?? "")
  );

  const filtered = useMemo(() => {
    return published.filter((j) => {
      if (q.trim()) {
        const hit =
          includesCI(j.title, q) ||
          includesCI(j.company, q) ||
          includesCI(j.body, q);
        if (!hit) return false;
      }

      if (city.trim() && !includesCI(j.cityCountry, city)) return false;
      if (kind !== "All" && j.type !== kind) return false;

      if (skill.trim()) {
        const s = skill.trim().toLowerCase();
        const hit = (j.skills ?? []).some((x) => x.toLowerCase().includes(s));
        if (!hit) return false;
      }

      return true;
    });
  }, [published, q, city, skill, kind]);

  useEffect(() => setPage(1), [q, city, skill, kind]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const submit = async () => {
    try {
      if (!user?.email) return;
      if (!title.trim() || !company.trim() || !cityCountry.trim() || !body.trim()) return;

      setErr(null);

      await createJobApi({
        title: title.trim(),
        company: company.trim(),
        cityCountry: cityCountry.trim(),
        type,
        skills: splitSkills(skillsText),
        link: link.trim() || undefined,
        body: body.trim(),
        open: true,
      });

      setTitle("");
      setCompany("");
      setCityCountry("");
      setSkillsText("");
      setLink("");
      setBody("");
      setComposerOpen(false);
      setRefresh((t) => t + 1);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to submit job");
    }
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-hairline pb-8">
          <div>
            <p className="label">Opportunities</p>
            <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
              Jobs & Internships
            </h1>
            <p className="mt-3 text-mute max-w-2xl">
              Students can share opportunities, subject to admin approval before publishing.
            </p>
            {err ? <p className="mt-4 text-sm text-sale">{err}</p> : null}
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setComposerOpen((v) => !v)}>
              {composerOpen ? "Close" : "Post Opportunity"}
            </button>
          </div>
        </div>

        {/* Composer */}
        {composerOpen ? (
          <div className="mt-8 border border-hairline-soft bg-soft-cloud p-6">
            <p className="label text-ink">New Opportunity</p>

            <div className="mt-4 grid md:grid-cols-2 gap-3">
              <input className="field" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className="field" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
              <input className="field" placeholder="City, Country" value={cityCountry} onChange={(e) => setCityCountry(e.target.value)} />
              <select className="field" value={type} onChange={(e) => setType(e.target.value as JobType)}>
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>

              <input className="field md:col-span-2" placeholder="Skills (comma separated)" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
              <input className="field md:col-span-2" placeholder="Apply Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
              <textarea className="field-textarea md:col-span-2 min-h-[120px]" placeholder="Describe the opportunity..." value={body} onChange={(e) => setBody(e.target.value)} />

              <div className="md:col-span-2 flex flex-wrap gap-2 items-center">
                <button className="btn-primary" onClick={submit}>
                  Submit
                </button>
                <p className="text-xs text-mute">
                  {isAdmin ? "Admin posts publish instantly." : "Student posts go to Pending until approved."}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Your pending */}
        {myPending.length > 0 ? (
          <section className="mt-section">
            <h2 className="font-display uppercase text-2xl leading-none">Your Pending</h2>
            <p className="mt-2 text-xs text-mute">Only you can see these until approved.</p>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {myPending.map((j) => (
                <JobCard key={j.id} job={j} pending />
              ))}
            </div>
          </section>
        ) : null}

        {/* Filters */}
        <div className="mt-section grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input className="field" placeholder="Search title/company/keyword" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="field" placeholder="City (e.g. Islamabad)" value={city} onChange={(e) => setCity(e.target.value)} />
          <input className="field" placeholder="Skill (e.g. React)" value={skill} onChange={(e) => setSkill(e.target.value)} />
          <select className="field" value={kind} onChange={(e) => setKind(e.target.value as any)}>
            <option value="All">All</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Published */}
        <section className="mt-section">
          <h2 className="font-display uppercase text-2xl leading-none">Published</h2>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading || busy
              ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
              : pageItems.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </section>

        {/* Pagination */}
        <div className="mt-section flex items-center justify-between gap-4 border-t border-hairline pt-8">
          <button className="btn-secondary" disabled={safePage <= 1 || loading || busy} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ opacity: safePage <= 1 || loading || busy ? 0.5 : 1 }}>
            Previous
          </button>

          <div className="text-sm text-mute">
            Page <span className="text-ink font-medium">{safePage}</span> of{" "}
            <span className="text-ink font-medium">{totalPages}</span>
          </div>

          <button className="btn-secondary" disabled={safePage >= totalPages || loading || busy} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ opacity: safePage >= totalPages || loading || busy ? 0.5 : 1 }}>
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

function JobCard({ job, pending }: { job: JobDto; pending?: boolean }) {
  return (
    <article className="border border-hairline-soft bg-canvas p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-mute tracking-widest uppercase">
            Posted {job.postedAt}
            {pending ? " • Pending" : ""}
          </p>

          <h3 className="mt-3 text-xl font-medium text-ink">{job.title}</h3>

          <p className="mt-2 text-sm text-charcoal">
            {job.company} • {job.cityCountry}
          </p>
        </div>

        <Pill tone={job.type === "Job" ? "job" : "intern"}>{job.type}</Pill>
      </div>

      <p className="mt-4 text-charcoal leading-7">{job.body}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(job.skills ?? []).map((s) => (
          <span
            key={s}
            className="inline-flex items-center rounded-pill border border-hairline bg-canvas px-4 py-2 text-xs font-medium text-ink"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to={`/jobs/${job.id}`} className="btn-secondary">
          Details
        </Link>

        {job.link ? (
          <a className="btn-primary" href={job.link} target="_blank" rel="noreferrer">
            Apply Link
          </a>
        ) : (
          <button className="btn-primary">Request Details</button>
        )}

        <button className="btn-secondary">Share</button>
      </div>

      <p className="mt-4 text-xs text-mute">By {job.authorEmail}</p>
    </article>
  );
}
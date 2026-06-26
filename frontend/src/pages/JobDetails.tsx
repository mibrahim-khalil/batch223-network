import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";
import { useEffect, useState } from "react";
import { getJobApi, type JobDto } from "../features/jobs/jobsApi";

export default function JobDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [job, setJob] = useState<JobDto | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!id) return;
        setErr(null);
        const data = await getJobApi(id);
        if (!alive) return;
        setJob(data);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load job");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!id) return <Navigate to="/jobs" replace />;
  if (err) return <Navigate to="/jobs" replace />;
  if (!job) return null;

  const canView =
    job.status === "published" ||
    isAdmin ||
    ((job.status === "pending" || job.status === "rejected") && job.authorEmail === user?.email);

  if (!canView) return <Navigate to="/jobs" replace />;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-6 md:px-12 py-section">
        <Link to="/jobs" className="text-sm underline">
          Back to Jobs
        </Link>

        <p className="mt-6 label">
          {job.type} • {job.status} • {job.postedAt}
        </p>

        <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9] break-words">
          {job.title}
        </h1>

        <p className="mt-4 text-charcoal font-medium">
          {job.company} • {job.cityCountry}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(job.skills ?? []).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-8 border-t border-hairline pt-8">
          <p className="text-charcoal leading-7 whitespace-pre-wrap">{job.body}</p>

          <p className="mt-6 text-xs text-mute">By {job.authorEmail}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {job.link ? (
              <a className="btn-primary" href={job.link} target="_blank" rel="noreferrer">
                Apply Link
              </a>
            ) : (
              <button className="btn-primary">Request Details</button>
            )}
            <button className="btn-secondary">Share</button>
          </div>
        </div>
      </div>
    </main>
  );
}
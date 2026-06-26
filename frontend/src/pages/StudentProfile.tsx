import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getStudentApi } from "../features/directory/directoryApi";
import type { StudentPublicProfile } from "../features/directory/directoryApi";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-3 border border-hairline bg-canvas px-4 py-3 text-sm font-medium text-ink hover:opacity-80"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
    >
      <span className="h-5 w-5">{children}</span>
      <span className="sr-only">{label}</span>
      {/* If you want icon-only with no visible text, keep sr-only only.
          If you want label visible too, replace sr-only with normal span. */}
      <span>{label}</span>
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 8.5H4.5V23.5H0.5V8.5zM8 8.5H11.8V10.6H11.85C12.37 9.62 13.65 8.6 15.6 8.6C19.7 8.6 20.5 11.2 20.5 14.6V23.5H16.5V15.6C16.5 13.7 16.5 11.3 14 11.3C11.5 11.3 11.1 13.2 11.1 15.5V23.5H7.1V8.5H8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 .5C5.7.5.7 5.6.7 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.3 5.6 18.3.5 12 .5z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.9 9h-3.2a15.8 15.8 0 00-1.3-6.1A8.02 8.02 0 0119.9 11zM12 4.1c.9 1.2 1.7 3.4 2.1 6.9H9.9c.4-3.5 1.2-5.7 2.1-6.9zM4.1 13h3.2c.2 2.1.7 4.2 1.3 6.1A8.02 8.02 0 014.1 13zm3.2-2H4.1a8.02 8.02 0 014.5-6.1c-.6 1.9-1.1 4-1.3 6.1zm2.6 2h4.2c-.4 3.5-1.2 5.7-2.1 6.9-.9-1.2-1.7-3.4-2.1-6.9zm6.8 0h3.2a8.02 8.02 0 01-4.5 6.1c.6-1.9 1.1-4 1.3-6.1z" />
    </svg>
  );
}

export default function StudentProfile() {
  const { id } = useParams();

  const [student, setStudent] = useState<StudentPublicProfile | null>(null);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!id) {
        setBusy(false);
        setNotFound(true);
        return;
      }

      try {
        setBusy(true);
        setErr(null);
        setNotFound(false);

        const data = await getStudentApi(id);
        if (!alive) return;
        setStudent(data);
      } catch (e: any) {
        if (!alive) return;
        const msg = e?.message ?? "Failed to load student profile";
        if (String(msg).toLowerCase().includes("not found")) {
          setNotFound(true);
          setStudent(null);
        } else {
          setErr(msg);
        }
      } finally {
        if (alive) setBusy(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (busy) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
          <h1 className="font-display uppercase text-[64px] leading-[0.9]">Loading</h1>
          <p className="mt-4 text-mute">Fetching student profile...</p>
        </div>
      </main>
    );
  }

  if (notFound || !student) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
          <h1 className="font-display uppercase text-[64px] leading-[0.9]">Not Found</h1>
          <p className="mt-4 text-mute">Student profile not found.</p>
          <div className="mt-8">
            <Link to="/directory" className="btn-secondary">
              Back to Directory
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      {/* Cover */}
      <div className="relative h-44 md:h-64 bg-soft-cloud overflow-hidden">
        <img
          src={student.coverUrl}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          alt="Cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-section">
        {/* Header */}
        <div className="relative -mt-14 md:-mt-16">
          <div className="h-28 w-28 md:h-36 md:w-36 bg-soft-cloud border-4 border-canvas overflow-hidden">
            <img
              src={student.avatarUrl}
              className="h-full w-full object-cover"
              alt={student.fullName}
              loading="lazy"
            />
          </div>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="label">Batch 223</p>
              <h1 className="mt-2 font-display uppercase text-[52px] md:text-[72px] leading-[0.9]">
                {student.fullName}
              </h1>
              <p className="mt-3 text-base md:text-lg text-charcoal font-medium">
                {student.position} @ {student.company}
              </p>
              <p className="mt-1 text-sm text-mute tracking-widest uppercase">
                {student.cityCountry}
              </p>

              {err ? <p className="mt-4 text-sm text-sale">{err}</p> : null}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {student.openToWork ? (
                  <span className="inline-flex items-center rounded-pill bg-success/10 text-success px-4 py-2 text-xs font-medium tracking-widest uppercase">
                    Open to work
                  </span>
                ) : null}
                <span className="inline-flex items-center rounded-pill border border-hairline px-4 py-2 text-xs font-medium tracking-widest uppercase text-mute">
                  Read-only profile
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/directory" className="btn-secondary">
                Back to Directory
              </Link>
              <Link to="/profile" className="btn-primary">
                My Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-section grid lg:grid-cols-12 gap-12 border-t border-hairline pt-section">
          <div className="lg:col-span-8 space-y-section">
            {/* About */}
            <section>
              <h2 className="font-display uppercase text-2xl leading-none">About</h2>
              <p className="mt-6 text-charcoal leading-7">{student.about}</p>
            </section>

            {/* Experience */}
            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Experience</h2>

              <div className="mt-6 space-y-6">
                {(student.experiences ?? []).length === 0 ? (
                  <p className="text-sm text-mute">No experience shared.</p>
                ) : (
                  (student.experiences ?? []).map((x, i) => (
                    <div key={i} className="border-b border-hairline-soft pb-6">
                      <p className="text-lg font-medium text-ink">{x.title}</p>
                      <p className="text-sm text-charcoal">
                        {x.company} • {x.employmentType}
                      </p>
                      <p className="text-sm text-mute">
                        {x.start} - {x.end}
                        {x.location ? ` • ${x.location}` : ""}
                      </p>
                      {x.description ? (
                        <p className="mt-3 text-charcoal leading-7">{x.description}</p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Education */}
            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Education</h2>

              <div className="mt-6 space-y-6">
                {(student.education ?? []).length === 0 ? (
                  <p className="text-sm text-mute">No education shared.</p>
                ) : (
                  (student.education ?? []).map((e, i) => (
                    <div key={i} className="border-b border-hairline-soft pb-6">
                      <p className="label">{e.level}</p>
                      <p className="mt-2 font-medium text-ink">{e.institutionName}</p>
                      <p className="text-sm text-mute">
                        {e.degreeField}
                        {e.passingYear ? ` • ${e.passingYear}` : ""}
                      </p>
                      {e.description ? (
                        <p className="mt-3 text-charcoal leading-7">{e.description}</p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            {/* Skills */}
            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">Skills</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(student.skills ?? []).map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-pill border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Socials (VERTICAL + ICONS) */}
            <div className="border border-hairline-soft bg-canvas p-6">
              <p className="label text-ink">Socials</p>

              <div className="mt-4 flex flex-col gap-3">
                {student.linkedin ? (
                  <IconLink href={student.linkedin} label="LinkedIn">
                    <LinkedInIcon />
                  </IconLink>
                ) : null}

                {student.github ? (
                  <IconLink href={student.github} label="GitHub">
                    <GitHubIcon />
                  </IconLink>
                ) : null}

                {student.portfolio ? (
                  <IconLink href={student.portfolio} label="Portfolio">
                    <GlobeIcon />
                  </IconLink>
                ) : null}

                {!student.linkedin && !student.github && !student.portfolio ? (
                  <p className="text-mute text-sm">No socials shared.</p>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-mute">
              Note: This is now real data from backend (MongoDB).
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
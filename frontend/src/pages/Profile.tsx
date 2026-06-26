import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StudentCard from "../components/StudentCard";
import { loadProfile, saveProfile } from "../features/profile/profileStore";
import type { Profile as ProfileType } from "../features/profile/profileTypes";
import { getMyProfileApi } from "../features/profile/profileApi";
import { listStudentsApi } from "../features/directory/directoryApi";
import type { StudentCardModel } from "../features/directory/mockStudents";

const EDUCATION_ORDER = ["Matric", "Intermediate", "University", "Current"] as const;

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600&auto=format&fit=crop";

type Experience = {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  location: string;
  startYear: string;
  endYear: string;
  current: boolean;
  description: string;
};

export default function Profile() {
  const [p, setP] = useState<ProfileType>(() => loadProfile());
  const [err, setErr] = useState<string | null>(null);

  const [mates, setMates] = useState<StudentCardModel[]>([]);
  const [matesErr, setMatesErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr(null);
        const fresh = await getMyProfileApi();
        if (!alive) return;
        setP(fresh);
        saveProfile(fresh);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load profile");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setMatesErr(null);
        const data = await listStudentsApi({ page: 1, pageSize: 12 });
        if (!alive) return;
        setMates(data.items ?? []);
      } catch (e: any) {
        if (!alive) return;
        setMatesErr(e?.message ?? "Failed to load batchmates");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const edu = [...(p.education ?? [])].sort(
    (a, b) => EDUCATION_ORDER.indexOf(a.level) - EDUCATION_ORDER.indexOf(b.level)
  );

  const exps: Experience[] = p.experiences ?? [];
  const coverSrc = p.coverUrl?.trim() ? p.coverUrl : FALLBACK_COVER;

  return (
    <main className="min-h-screen bg-canvas text-ink overflow-x-hidden">
      <Navbar />

      {/* Cover */}
      <div className="relative h-40 sm:h-44 md:h-64 bg-soft-cloud overflow-hidden">
        <img
          src={coverSrc}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          alt="Cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-section">
        {/* Header */}
        <div className="relative -mt-12 sm:-mt-14 md:-mt-16">
          <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36 bg-soft-cloud border-4 border-canvas overflow-hidden">
            {p.avatarUrl?.trim() ? (
              <img
                src={p.avatarUrl}
                alt={p.fullName}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-display text-3xl sm:text-4xl text-mute uppercase">
                {p.fullName?.slice(0, 1) || "B"}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="label">Batch 223</p>

                {p.registrationNumber?.trim() ? (
                  <span className="rounded-pill border border-hairline bg-canvas px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-ink">
                    {p.registrationNumber}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-2 font-display uppercase text-[44px] sm:text-[56px] md:text-[72px] leading-[0.9] tracking-tight break-words">
                {p.fullName}
              </h1>

              <p className="mt-3 text-sm sm:text-base md:text-lg text-charcoal font-medium break-words">
                {p.headline}
              </p>

              <p className="mt-1 text-xs sm:text-sm text-mute tracking-widest uppercase break-words">
                {p.cityCountry}
              </p>

              {err ? <p className="mt-3 text-sm text-sale">{err}</p> : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/profile/edit" className="btn-primary">
                Edit Profile
              </Link>

              {p.resumeUrl?.trim() ? (
                <a
                  className="btn-secondary"
                  href={p.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
              ) : (
                <button className="btn-secondary" disabled style={{ opacity: 0.6 }}>
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-section grid lg:grid-cols-12 gap-12 border-t border-hairline pt-section">
          <div className="lg:col-span-8 space-y-section min-w-0">
            {/* About */}
            <section>
              <h2 className="font-display uppercase text-2xl leading-none">About</h2>
              <p className="mt-6 text-charcoal leading-7 break-words">
                {p.about?.trim() ? p.about : "Add your professional bio from Edit Profile."}
              </p>
            </section>

            {/* Experience */}
            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Experience</h2>
              <ExperienceTimeline experiences={exps} />
            </section>

            {/* Education */}
            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Education</h2>

              <div className="mt-6 space-y-6">
                {edu.length === 0 ? (
                  <p className="text-sm text-mute">No education added yet.</p>
                ) : (
                  edu.map((e) => (
                    <div key={e.id} className="border-b border-hairline-soft pb-6">
                      <p className="label">{e.level}</p>

                      <p className="mt-2 font-medium text-ink break-words">
                        {e.institutionName || "Institution Name"}
                      </p>

                      <p className="text-sm text-mute break-words">
                        {e.degreeField || "Degree / Field"}
                        {e.passingYear ? ` • ${e.passingYear}` : ""}
                      </p>

                      {e.description ? (
                        <p className="mt-3 text-charcoal leading-7 break-words">
                          {e.description}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Batchmates */}
            <section className="border-t border-hairline pt-section">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display uppercase text-2xl leading-none">
                  Batchmates
                </h2>

                <Link to="/directory" className="btn-secondary">
                  View Directory
                </Link>
              </div>

              {matesErr ? <p className="mt-4 text-sm text-sale">{matesErr}</p> : null}

              <div className="mt-6 -mx-6 md:-mx-12 px-6 md:px-12 overflow-x-auto">
                <div className="flex gap-6 min-w-max">
                  {mates.map((s) => (
                    <div key={s.id} className="w-[220px] md:w-[240px]">
                      <StudentCard student={s} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 min-w-0">
            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">Skills</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(p.skills || []).map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-hairline-soft bg-canvas p-6">
              <p className="label text-ink">Contact</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-ink font-medium break-words">{p.email}</p>
                {p.phone ? <p className="text-mute break-words">{p.phone}</p> : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) {
    return <p className="mt-6 text-sm text-mute">No experience added yet.</p>;
  }

  return (
    <div className="mt-6">
      {experiences.map((x, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === experiences.length - 1;

        return (
          <div
            key={x.id}
            className={`grid grid-cols-[28px_1fr] gap-4 items-stretch ${
              !isLast ? "pb-10" : ""
            }`}
          >
            <div className="flex flex-col items-center self-stretch">
              <div className={`w-px mx-auto h-3 ${isFirst ? "bg-transparent" : "bg-hairline"}`} />
              <div className="h-4 w-4 rounded-full border-2 border-ink bg-canvas" />
              <div className={`w-px mx-auto flex-1 ${isLast ? "bg-transparent" : "bg-hairline"}`} />
            </div>

            <div className={!isLast ? "border-b border-hairline-soft pb-8" : ""}>
              <p className="text-lg font-medium text-ink break-words">
                {x.title || "Untitled Role"}
              </p>

              <p className="text-sm text-charcoal break-words">
                {(x.company || "Company") + (x.employmentType ? ` • ${x.employmentType}` : "")}
              </p>

              <p className="text-sm text-mute break-words">
                {(x.startYear || "—") + " - " + (x.current ? "Present" : x.endYear || "—")}
                {x.location ? ` • ${x.location}` : ""}
              </p>

              {x.description ? (
                <p className="mt-3 text-charcoal leading-7 break-words">
                  {x.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
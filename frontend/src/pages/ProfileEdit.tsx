import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FilePicker from "../components/FilePicker";
import { loadProfile, saveProfile } from "../features/profile/profileStore";
import { getMyProfileApi, updateMyProfileApi } from "../features/profile/profileApi";
import { uploadAvatarApi, uploadCoverApi, uploadResumeApi } from "../features/uploads/uploadApi";
import type {
  EducationItem,
  EducationLevel,
  ExperienceItem,
  Profile,
} from "../features/profile/profileTypes";

const MONTHS = [
  { value: "", label: "Month" },
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function splitSkills(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function makeId(prefix = "id") {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${id}`;
}

function newExperience(): ExperienceItem {
  return {
    id: makeId("exp"),
    title: "",
    company: "",
    employmentType: "Full-time",
    location: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: true,
    description: "",
  };
}

function newEducation(level: EducationLevel = "University"): EducationItem {
  return {
    id: makeId("edu"),
    level,
    institutionName: "",
    degreeField: "",
    passingMonth: "",
    passingYear: "",
    description: "",
  };
}

const EDUCATION_ORDER: EducationLevel[] = [
  "Matric",
  "Intermediate",
  "University",
  "Current",
];

export default function ProfileEdit() {
  const nav = useNavigate();

  const initial = useMemo(() => loadProfile(), []);
  const [profile, setProfile] = useState<Profile>(initial);

  const [skillsDraft, setSkillsDraft] = useState(() => (initial.skills ?? []).join(", "));

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const fresh = await getMyProfileApi();
        if (!alive) return;

        setProfile(fresh);
        setSkillsDraft((fresh.skills ?? []).join(", "));
        saveProfile(fresh);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load profile");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      setBusy(true);
      setErr(null);

      // ensure skills are committed
      const finalProfile = { ...profile, skills: splitSkills(skillsDraft) };

      // omit email only
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, ...payload } = finalProfile as any;

      const saved = await updateMyProfileApi(payload);
      saveProfile(saved);
      nav("/profile");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save profile");
    } finally {
      setBusy(false);
    }
  };

  // Experience handlers
  const addExperience = () => {
    setProfile((p) => ({
      ...p,
      experiences: [newExperience(), ...(p.experiences ?? [])],
    }));
  };

  const updateExperience = (id: string, patch: Partial<ExperienceItem>) => {
    setProfile((p) => ({
      ...p,
      experiences: (p.experiences ?? []).map((x) =>
        x.id === id ? { ...x, ...patch } : x
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setProfile((p) => ({
      ...p,
      experiences: (p.experiences ?? []).filter((x) => x.id !== id),
    }));
  };

  // Education handlers
  const addEducation = () => {
    setProfile((p) => ({
      ...p,
      education: [...(p.education ?? []), newEducation("University")],
    }));
  };

  const updateEducation = (id: string, patch: Partial<EducationItem>) => {
    setProfile((p) => ({
      ...p,
      education: (p.education ?? []).map((x) =>
        x.id === id ? { ...x, ...patch } : x
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setProfile((p) => ({
      ...p,
      education: (p.education ?? []).filter((x) => x.id !== id),
    }));
  };

  const sortedEducation = [...(profile.education ?? [])].sort((a, b) => {
    return EDUCATION_ORDER.indexOf(a.level) - EDUCATION_ORDER.indexOf(b.level);
  });

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-hairline pb-8">
          <div>
            <p className="label">Profile Setup</p>
            <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
              Edit Profile
            </h1>
            <p className="mt-3 text-mute max-w-2xl">
              Experience + Education timeline. (MongoDB + Cloudinary)
            </p>

            {loading ? <p className="mt-3 text-sm text-mute">Loading from server...</p> : null}
            {err ? <p className="mt-3 text-sm text-sale">{err}</p> : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn-secondary"
              onClick={() => nav("/profile")}
              disabled={busy}
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={busy}
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              {busy ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="mt-section grid lg:grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-section">
            {/* Basic */}
            <section>
              <h2 className="font-display uppercase text-2xl leading-none">Basic Information</h2>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="label">Full Name</p>
                  <input
                    className="field mt-2"
                    value={profile.fullName}
                    onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                  />
                </div>

                <div>
                  <p className="label">City + Country</p>
                  <input
                    className="field mt-2"
                    value={profile.cityCountry}
                    onChange={(e) => setProfile((p) => ({ ...p, cityCountry: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="label">Headline (Position @ Company)</p>
                  <input
                    className="field mt-2"
                    value={profile.headline}
                    onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="label">About</p>
                  <textarea
                    className="field-textarea mt-2 min-h-[140px]"
                    value={profile.about}
                    onChange={(e) => setProfile((p) => ({ ...p, about: e.target.value }))}
                    placeholder="Write a short professional bio..."
                  />
                </div>
              </div>
            </section>

            {/* Experience */}
            <section className="border-t border-hairline pt-section">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display uppercase text-2xl leading-none">Experience</h2>
                  <p className="helper mt-2">Add your job history timeline.</p>
                </div>
                <button className="btn-secondary" onClick={addExperience}>
                  Add Experience
                </button>
              </div>

              <div className="mt-6 space-y-8">
                {(profile.experiences ?? []).map((x) => (
                  <div key={x.id} className="border-b border-hairline-soft pb-8">
                    <div className="flex items-start justify-between gap-4">
                      <p className="label text-ink">Experience Item</p>
                      <button
                        type="button"
                        onClick={() => removeExperience(x.id)}
                        className="text-sm font-medium text-sale underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="label">Title</p>
                        <input
                          className="field mt-2"
                          value={x.title}
                          onChange={(e) => updateExperience(x.id, { title: e.target.value })}
                        />
                      </div>

                      <div>
                        <p className="label">Company</p>
                        <input
                          className="field mt-2"
                          value={x.company}
                          onChange={(e) => updateExperience(x.id, { company: e.target.value })}
                        />
                      </div>

                      <div>
                        <p className="label">Employment Type</p>
                        <input
                          className="field mt-2"
                          value={x.employmentType}
                          onChange={(e) =>
                            updateExperience(x.id, { employmentType: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <p className="label">Location</p>
                        <input
                          className="field mt-2"
                          value={x.location}
                          onChange={(e) => updateExperience(x.id, { location: e.target.value })}
                        />
                      </div>

                      <div>
                        <p className="label">Start Month</p>
                        <select
                          className="field mt-2"
                          value={x.startMonth}
                          onChange={(e) => updateExperience(x.id, { startMonth: e.target.value })}
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="label">Start Year</p>
                        <input
                          className="field mt-2"
                          value={x.startYear}
                          onChange={(e) => updateExperience(x.id, { startYear: e.target.value })}
                          placeholder="2025"
                        />
                      </div>

                      <div>
                        <p className="label">End Month</p>
                        <select
                          className="field mt-2"
                          value={x.current ? "" : x.endMonth}
                          onChange={(e) => updateExperience(x.id, { endMonth: e.target.value })}
                          disabled={x.current}
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="label">End Year</p>
                        <input
                          className="field mt-2"
                          value={x.current ? "" : x.endYear}
                          onChange={(e) => updateExperience(x.id, { endYear: e.target.value })}
                          disabled={x.current}
                          placeholder="2026"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center justify-between gap-4 border border-hairline-soft bg-soft-cloud px-4 py-3 rounded-nike-md">
                        <span className="text-sm font-medium text-ink">Current Role</span>
                        <input
                          type="checkbox"
                          checked={x.current}
                          onChange={(e) =>
                            updateExperience(x.id, {
                              current: e.target.checked,
                              endMonth: e.target.checked ? "" : x.endMonth,
                              endYear: e.target.checked ? "" : x.endYear,
                            })
                          }
                          className="h-5 w-5 accent-[#111111]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <p className="label">Description</p>
                        <textarea
                          className="field-textarea mt-2 min-h-[110px]"
                          value={x.description}
                          onChange={(e) =>
                            updateExperience(x.id, { description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="border-t border-hairline pt-section">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display uppercase text-2xl leading-none">Education</h2>
                <button className="btn-secondary" onClick={addEducation}>
                  Add Education
                </button>
              </div>

              <div className="mt-6 space-y-8">
                {sortedEducation.map((e) => (
                  <div key={e.id} className="border-b border-hairline-soft pb-8">
                    <div className="flex items-start justify-between gap-4">
                      <p className="label text-ink">{e.level}</p>
                      <button
                        type="button"
                        onClick={() => removeEducation(e.id)}
                        className="text-sm font-medium text-sale underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="label">Level</p>
                        <select
                          className="field mt-2"
                          value={e.level}
                          onChange={(ev) =>
                            updateEducation(e.id, {
                              level: ev.target.value as EducationLevel,
                            })
                          }
                        >
                          <option value="Matric">Matric</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="University">University</option>
                          <option value="Current">Current Education</option>
                        </select>
                      </div>

                      <div>
                        <p className="label">Passing Month</p>
                        <select
                          className="field mt-2"
                          value={e.passingMonth}
                          onChange={(ev) =>
                            updateEducation(e.id, { passingMonth: ev.target.value })
                          }
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="label">Passing Year</p>
                        <input
                          className="field mt-2"
                          value={e.passingYear}
                          onChange={(ev) =>
                            updateEducation(e.id, { passingYear: ev.target.value })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <p className="label">Institution Name</p>
                        <input
                          className="field mt-2"
                          value={e.institutionName}
                          onChange={(ev) =>
                            updateEducation(e.id, { institutionName: ev.target.value })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <p className="label">Degree / Field</p>
                        <input
                          className="field mt-2"
                          value={e.degreeField}
                          onChange={(ev) =>
                            updateEducation(e.id, { degreeField: ev.target.value })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <p className="label">Description</p>
                        <textarea
                          className="field-textarea mt-2 min-h-[90px]"
                          value={e.description}
                          onChange={(ev) =>
                            updateEducation(e.id, { description: ev.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Contact</h2>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="label">Email (locked)</p>
                  <input className="field mt-2 opacity-70" value={profile.email} disabled />
                </div>

                <div>
                  <p className="label">Phone</p>
                  <input
                    className="field mt-2"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Skills</h2>

              <div className="mt-6">
                <p className="label">Skills (comma separated)</p>
                <input
                  className="field mt-2"
                  value={skillsDraft}
                  onChange={(e) => setSkillsDraft(e.target.value)}
                  onBlur={() => {
                    setProfile((p) => ({ ...p, skills: splitSkills(skillsDraft) }));
                  }}
                  placeholder="React, TypeScript, Node.js"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {splitSkills(skillsDraft).map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="border-t border-hairline pt-section">
              <h2 className="font-display uppercase text-2xl leading-none">Social Links</h2>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="label">LinkedIn</p>
                  <input
                    className="field mt-2"
                    value={profile.linkedin}
                    onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))}
                  />
                </div>

                <div>
                  <p className="label">GitHub</p>
                  <input
                    className="field mt-2"
                    value={profile.github}
                    onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                  />
                </div>

                <div>
                  <p className="label">Portfolio</p>
                  <input
                    className="field mt-2"
                    value={profile.portfolio}
                    onChange={(e) => setProfile((p) => ({ ...p, portfolio: e.target.value }))}
                  />
                </div>

                <div>
                  <p className="label">Fiverr</p>
                  <input
                    className="field mt-2"
                    value={profile.fiverr}
                    onChange={(e) => setProfile((p) => ({ ...p, fiverr: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="label">Upwork</p>
                  <input
                    className="field mt-2"
                    value={profile.upwork}
                    onChange={(e) => setProfile((p) => ({ ...p, upwork: e.target.value }))}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="border border-hairline-soft bg-soft-cloud p-6">
              <p className="label text-ink">Status</p>

              <div className="mt-4 space-y-3">
                <ToggleRow
                  label="Open to Work"
                  checked={profile.openToWork}
                  onChange={(v) => setProfile((p) => ({ ...p, openToWork: v }))}
                />
                <ToggleRow
                  label="Freelancer"
                  checked={profile.freelancer}
                  onChange={(v) => setProfile((p) => ({ ...p, freelancer: v }))}
                />
                <ToggleRow
                  label="Entrepreneur"
                  checked={profile.entrepreneur}
                  onChange={(v) => setProfile((p) => ({ ...p, entrepreneur: v }))}
                />
              </div>
            </div>

            {/* Uploads */}
            <div className="border border-hairline-soft bg-canvas p-6">
              <p className="label text-ink">Uploads (Cloudinary)</p>

              <div className="mt-4 space-y-4">
                <FilePicker
                  label="Profile Picture"
                  accept="image/*"
                  value={profile.avatarFileName}
                  onChangeName={(name) => setProfile((p) => ({ ...p, avatarFileName: name }))}
                  onChangeFile={async (file) => {
                    if (!file) return;
                    try {
                      setErr(null);
                      setUploadingAvatar(true);
                      const out = await uploadAvatarApi(file);
                      setProfile((p) => ({ ...p, avatarUrl: out.url }));
                    } catch (e: any) {
                      setErr(e?.message ?? "Avatar upload failed");
                    } finally {
                      setUploadingAvatar(false);
                    }
                  }}
                />

                <FilePicker
                  label="Cover Banner"
                  accept="image/*"
                  value={profile.coverFileName}
                  onChangeName={(name) => setProfile((p) => ({ ...p, coverFileName: name }))}
                  onChangeFile={async (file) => {
                    if (!file) return;
                    try {
                      setErr(null);
                      setUploadingCover(true);
                      const out = await uploadCoverApi(file);
                      setProfile((p) => ({ ...p, coverUrl: out.url }));
                    } catch (e: any) {
                      setErr(e?.message ?? "Cover upload failed");
                    } finally {
                      setUploadingCover(false);
                    }
                  }}
                />

                <FilePicker
                  label="Resume (PDF)"
                  accept="application/pdf"
                  value={profile.resumeFileName}
                  onChangeName={(name) => setProfile((p) => ({ ...p, resumeFileName: name }))}
                  onChangeFile={async (file) => {
                    if (!file) return;
                    try {
                      setErr(null);
                      setUploadingResume(true);
                      const out = await uploadResumeApi(file);
                      setProfile((p) => ({ ...p, resumeUrl: out.url }));
                    } catch (e: any) {
                      setErr(e?.message ?? "Resume upload failed");
                    } finally {
                      setUploadingResume(false);
                    }
                  }}
                />
              </div>

              <p className="helper mt-4">
                {uploadingAvatar || uploadingCover || uploadingResume ? "Uploading..." : "Uploaded files are saved to your account."}
              </p>
            </div>

            <button
              className="btn-primary w-full"
              onClick={handleSave}
              disabled={busy}
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              {busy ? "Saving..." : "Save Profile"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 border-b border-hairline-soft pb-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-[#111111]"
      />
    </label>
  );
}
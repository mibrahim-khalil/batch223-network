import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";
import { getAdminStatsApi, type AdminStats } from "../features/admin/adminApi";

import {
  listAnnouncementsApi,
  adminPatchAnnouncementApi,
  adminDeleteAnnouncementApi,
  type AnnouncementDto,
} from "../features/announcements/announcementsApi";

import {
  listJobsApi,
  adminPatchJobApi,
  adminDeleteJobApi,
  type JobDto,
} from "../features/jobs/jobsApi";

import {
  listEventsApi,
  adminPatchEventApi,
  adminDeleteEventApi,
  type EventDto,
} from "../features/events/eventsApi";

type Tab = "pending" | "rejected";

export default function Admin() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [tick, setTick] = useState(0);

  const [stats, setStats] = useState<AdminStats | null>(null);

  const [aItems, setAItems] = useState<AnnouncementDto[]>([]);
  const [jItems, setJItems] = useState<JobDto[]>([]);
  const [eItems, setEItems] = useState<EventDto[]>([]);

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr(null);
        setBusy(true);

        const [s, a, j, e] = await Promise.all([
          getAdminStatsApi(),
          listAnnouncementsApi({ page: 1, pageSize: 200 }),
          listJobsApi({ page: 1, pageSize: 200 }),
          listEventsApi({ page: 1, pageSize: 200 }),
        ]);

        if (!alive) return;

        setStats(s);
        setAItems(a.items ?? []);
        setJItems(j.items ?? []);
        setEItems(e.items ?? []);
      } catch (ex: any) {
        if (!alive) return;
        setErr(ex?.message ?? "Failed to load admin queue");
      } finally {
        if (alive) setBusy(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [tick]);

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
          <h1 className="font-display uppercase text-[64px] leading-[0.9]">
            Admin Only
          </h1>
          <p className="mt-4 text-mute">You don’t have admin access.</p>
        </div>
      </main>
    );
  }

  const pendingA = useMemo(() => aItems.filter((x) => x.status === "pending"), [aItems]);
  const pendingJ = useMemo(() => jItems.filter((x) => x.status === "pending"), [jItems]);
  const pendingE = useMemo(() => eItems.filter((x) => x.status === "pending"), [eItems]);

  const rejectedA = useMemo(() => aItems.filter((x) => x.status === "rejected"), [aItems]);
  const rejectedJ = useMemo(() => jItems.filter((x) => x.status === "rejected"), [jItems]);
  const rejectedE = useMemo(() => eItems.filter((x) => x.status === "rejected"), [eItems]);

  const pendingCount = pendingA.length + pendingJ.length + pendingE.length;
  const rejectedCount = rejectedA.length + rejectedJ.length + rejectedE.length;

  const officialPublishedA = useMemo(
    () => aItems.filter((x) => x.status === "published" && x.official),
    [aItems]
  );

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        <div className="border-b border-hairline pb-8">
          <p className="label">Admin</p>
          <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
            Dashboard
          </h1>
          <p className="mt-3 text-mute">
            Moderate and approve community posts including announcements, job listings, and events.
          </p>
          {err ? <p className="mt-4 text-sm text-sale">{err}</p> : null}
        </div>

        <div className="mt-section grid grid-cols-2 lg:grid-cols-4 border-y border-hairline">
          {[
            [String(stats?.totalUsers ?? 0), "Total Users"],
            [String(stats?.verifiedUsers ?? 0), "Verified Users"],
            [String(pendingCount), "Pending Posts"],
            [String(rejectedCount), "Rejected Posts"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="py-8 border-r last:border-r-0 border-hairline flex flex-col items-center justify-center text-center"
            >
              <p className="text-3xl font-medium">{busy ? "…" : num}</p>
              <p className="mt-1 text-sm text-mute">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-section flex flex-wrap gap-2">
          <button
            className={tab === "pending" ? "btn-primary" : "btn-secondary"}
            onClick={() => setTab("pending")}
          >
            Pending
          </button>
          <button
            className={tab === "rejected" ? "btn-primary" : "btn-secondary"}
            onClick={() => setTab("rejected")}
          >
            Rejected
          </button>
        </div>

        <section className="mt-8">
          <h2 className="font-display uppercase text-2xl leading-none">
            Moderation Queue
          </h2>

          <div className="mt-6 border-t border-hairline">
            {busy ? (
              <div className="py-10 text-sm text-mute">Loading...</div>
            ) : tab === "pending" ? (
              <>
                {/* Pending Announcements */}
                {pendingA.map((a) => (
                  <div key={a.id} className="py-6 border-b border-hairline-soft">
                    <p className="label">Announcement (Pending)</p>
                    <p className="mt-2 text-lg font-medium">{a.title}</p>
                    <p className="mt-2 text-charcoal leading-7">{a.body}</p>
                    <p className="mt-2 text-xs text-mute">By {a.authorEmail}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="btn-primary"
                        onClick={async () => {
                          await adminPatchAnnouncementApi(a.id, { status: "published" });
                          refresh();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await adminPatchAnnouncementApi(a.id, { status: "rejected" });
                          refresh();
                        }}
                      >
                        Reject
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await adminDeleteAnnouncementApi(a.id);
                          refresh();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pending Jobs */}
                {pendingJ.map((j) => (
                  <div key={j.id} className="py-6 border-b border-hairline-soft">
                    <p className="label">Job/Internship (Pending)</p>
                    <p className="mt-2 text-lg font-medium">{j.title}</p>
                    <p className="mt-2 text-charcoal">
                      {j.company} • {j.cityCountry}
                    </p>
                    <p className="mt-2 text-charcoal leading-7">{j.body}</p>
                    <p className="mt-2 text-xs text-mute">By {j.authorEmail}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="btn-primary"
                        onClick={async () => {
                          await adminPatchJobApi(j.id, { status: "published" });
                          refresh();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await adminPatchJobApi(j.id, { status: "rejected" });
                          refresh();
                        }}
                      >
                        Reject
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await adminDeleteJobApi(j.id);
                          refresh();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pending Events */}
                {pendingE.map((e) => (
                  <div key={e.id} className="py-6 border-b border-hairline-soft">
                    <p className="label">Event (Pending)</p>
                    <p className="mt-2 text-lg font-medium">{e.title}</p>
                    <p className="mt-2 text-charcoal">
                      {e.venue} • {e.cityCountry}
                    </p>
                    <p className="mt-2 text-charcoal leading-7">{e.description}</p>
                    <p className="mt-2 text-xs text-mute">By {e.authorEmail}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="btn-primary"
                        onClick={async () => {
                          await adminPatchEventApi(e.id, { status: "published" });
                          refresh();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await adminPatchEventApi(e.id, { status: "rejected" });
                          refresh();
                        }}
                      >
                        Reject
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await adminDeleteEventApi(e.id);
                          refresh();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {pendingCount === 0 ? (
                  <div className="py-10 text-sm text-mute">
                    No pending posts right now.
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {/* Rejected blocks unchanged */}
                {/* ... keep your rejected UI exactly as you already have ... */}
                {rejectedCount === 0 ? (
                  <div className="py-10 text-sm text-mute">
                    No rejected posts right now.
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>

        {/* Pin controls */}
        <section className="mt-section">
          <h2 className="font-display uppercase text-2xl leading-none">
            Pin Controls (Official Announcements)
          </h2>

          <div className="mt-6 border-t border-hairline">
            {officialPublishedA.slice(0, 12).map((a) => (
              <div
                key={a.id}
                className="py-6 border-b border-hairline-soft flex items-start justify-between gap-6"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{a.title}</p>
                  <p className="mt-1 text-sm text-mute truncate">{a.createdAt}</p>
                </div>

                <button
                  className="btn-secondary"
                  onClick={async () => {
                    await adminPatchAnnouncementApi(a.id, { pinned: !a.pinned });
                    refresh();
                  }}
                >
                  {a.pinned ? "Unpin" : "Pin"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
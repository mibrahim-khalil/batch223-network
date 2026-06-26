import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import usePageLoading from "../hooks/usePageLoading";
import AnnouncementRowSkeleton from "../components/AnnouncementRowSkeleton";
import { useAuth } from "../features/auth/AuthProvider";
import {
  createAnnouncementApi,
  listAnnouncementsApi,
  type AnnouncementDto,
} from "../features/announcements/announcementsApi";

function formatDate(d: string) {
  return d;
}

export default function Announcements() {
  const loading = usePageLoading(450);
  const { user, isAdmin } = useAuth();

  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [items, setItems] = useState<AnnouncementDto[]>([]);
  const [refresh, setRefresh] = useState(0);

  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<"Announcement" | "Update">("Update");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr(null);
        setBusy(true);
        const data = await listAnnouncementsApi();
        if (!alive) return;
        setItems(data.items ?? []);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load announcements");
      } finally {
        if (alive) setBusy(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [refresh]);

  const all = useMemo(() => items, [items]);

  const pinned = all.filter((a) => a.pinned && a.status === "published");
  const official = all.filter((a) => a.official && a.status === "published" && !a.pinned);
  const community = all.filter((a) => !a.official && a.status === "published");

  const myPending = all.filter(
    (a) => a.status === "pending" && a.authorEmail === (user?.email ?? "")
  );

  const submit = async () => {
    try {
      if (!title.trim() || !body.trim()) return;

      setErr(null);
      await createAnnouncementApi({
        title: title.trim(),
        body: body.trim(),
        tag,
      });

      setTitle("");
      setBody("");
      setComposerOpen(false);
      setRefresh((t) => t + 1);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to submit post");
    }
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-hairline pb-8">
          <div>
            <p className="label">Community</p>
            <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
              Announcements
            </h1>
            <p className="mt-3 text-mute max-w-2xl">
              Official announcements and approved student posts all in one place.
            </p>

            {err ? <p className="mt-4 text-sm text-sale">{err}</p> : null}
          </div>

          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => setComposerOpen((v) => !v)}
            >
              {composerOpen ? "Close" : "New Post"}
            </button>
          </div>
        </div>

        {/* Composer */}
        {composerOpen ? (
          <div className="mt-8 border border-hairline-soft bg-soft-cloud p-6">
            <p className="label text-ink">Create Post</p>

            <div className="mt-4 grid md:grid-cols-2 gap-3">
              <input
                className="field"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <select
                className="field"
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
              >
                <option value="Update">Update</option>
                <option value="Announcement">Announcement</option>
              </select>

              <textarea
                className="field-textarea md:col-span-2 min-h-[120px]"
                placeholder="Write your update..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              <div className="md:col-span-2 flex flex-wrap gap-2 items-center">
                <button className="btn-primary" onClick={submit}>
                  Submit
                </button>

                <p className="text-xs text-mute">
                  {isAdmin
                    ? "Admin posts publish instantly."
                    : "Student posts go to Pending and become visible after admin approval."}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Pinned */}
        {pinned.length > 0 ? (
          <section className="mt-section">
            <h2 className="font-display uppercase text-2xl leading-none">
              Pinned
            </h2>

            <div className="mt-6 grid lg:grid-cols-2 gap-8">
              {pinned.map((a) => (
                <article key={a.id} className="border border-hairline-soft bg-soft-cloud p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-medium tracking-widest uppercase text-ink">
                      {a.tag}
                    </p>
                    <p className="text-xs text-mute">{formatDate(a.createdAt)}</p>
                  </div>

                  <h3 className="mt-4 text-xl font-medium text-ink">{a.title}</h3>
                  <p className="mt-3 text-charcoal leading-7">{a.body}</p>

                  <div className="mt-6">
                    <Link to={`/announcements/${a.id}`} className="btn-secondary">
                      Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* Pending (only mine) */}
        {myPending.length > 0 ? (
          <section className="mt-section">
            <h2 className="font-display uppercase text-2xl leading-none">
              Your Pending
            </h2>

            <div className="mt-6 border-t border-hairline">
              {myPending.map((a) => (
                <div key={a.id} className="py-6 border-b border-hairline-soft">
                  <p className="text-xs text-mute tracking-widest uppercase">
                    Pending Approval • {formatDate(a.createdAt)}
                  </p>

                  <p className="mt-2 text-lg font-medium">{a.title}</p>
                  <p className="mt-2 text-charcoal leading-7">{a.body}</p>

                  <div className="mt-4">
                    <Link to={`/announcements/${a.id}`} className="btn-secondary">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Latest feed */}
        <section className="mt-section">
          <h2 className="font-display uppercase text-2xl leading-none">Latest</h2>

          <div className="mt-6 border-t border-hairline">
            {loading || busy ? (
              Array.from({ length: 5 }).map((_, i) => <AnnouncementRowSkeleton key={i} />)
            ) : (
              [...official, ...community].map((a) => (
                <div key={a.id} className="py-6 border-b border-hairline-soft">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-pill border border-hairline bg-canvas px-4 py-2 text-xs font-medium tracking-widest uppercase text-ink">
                          {a.official ? "Official" : "Community"}
                        </span>
                        <span className="text-xs text-mute">{formatDate(a.createdAt)}</span>
                      </div>

                      <h3 className="mt-3 text-lg font-medium text-ink">{a.title}</h3>
                      <p className="mt-2 text-charcoal leading-7">{a.body}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/announcements/${a.id}`} className="btn-secondary">
                        Details
                      </Link>
                      <button className="btn-secondary">Share</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
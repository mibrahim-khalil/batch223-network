import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";
import { useEffect, useState } from "react";
import { getAnnouncementApi, type AnnouncementDto } from "../features/announcements/announcementsApi";

export default function AnnouncementDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState<AnnouncementDto | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!id) return;
        setErr(null);
        const data = await getAnnouncementApi(id);
        if (!alive) return;
        setPost(data);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load announcement");
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (!id) return <Navigate to="/announcements" replace />;
  if (err) return <Navigate to="/announcements" replace />;
  if (!post) return null;

  // extra client-side check (backend already enforces)
  const canView =
    post.status === "published" ||
    isAdmin ||
    (post.status === "pending" && post.authorEmail === user?.email);

  if (!canView) return <Navigate to="/announcements" replace />;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <div className="max-w-[960px] mx-auto px-6 md:px-12 py-section">
        <Link to="/announcements" className="text-sm underline">
          Back to Announcements
        </Link>

        <p className="mt-6 label">
          {post.official ? "Official" : "Community"} • {post.status}
        </p>

        <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9] break-words">
          {post.title}
        </h1>

        <div className="mt-4 text-sm text-mute">
          {post.createdAt} • by {post.authorEmail}
        </div>

        <div className="mt-8 border-t border-hairline pt-8">
          <p className="text-charcoal leading-7 whitespace-pre-wrap">
            {post.body}
          </p>
        </div>
      </div>
    </main>
  );
}
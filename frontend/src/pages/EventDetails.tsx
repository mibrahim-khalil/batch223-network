import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";
import { useEffect, useState } from "react";
import { getEventApi, type EventDto } from "../features/events/eventsApi";

export default function EventDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [event, setEvent] = useState<EventDto | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!id) return;
        setErr(null);
        const data = await getEventApi(id);
        if (!alive) return;
        setEvent(data);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load event");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!id) return <Navigate to="/events" replace />;
  if (err) return <Navigate to="/events" replace />;
  if (!event) return null;

  const canView =
    event.status === "published" ||
    isAdmin ||
    ((event.status === "pending" || event.status === "rejected") && event.authorEmail === user?.email);

  if (!canView) return <Navigate to="/events" replace />;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-6 md:px-12 py-section">
        <Link to="/events" className="text-sm underline">
          Back to Events
        </Link>

        <p className="mt-6 label">
          {event.type} • {event.status}
        </p>

        <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9] break-words">
          {event.title}
        </h1>

        <p className="mt-4 text-charcoal font-medium">
          {event.venue} • {event.cityCountry}
        </p>

        <p className="mt-2 text-sm text-mute">
          {event.date} • {event.time}
        </p>

        <div className="mt-8 border-t border-hairline pt-8">
          <p className="text-charcoal leading-7 whitespace-pre-wrap">
            {event.description}
          </p>

          <p className="mt-6 text-xs text-mute">By {event.authorEmail}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button className="btn-primary">RSVP</button>
            <button className="btn-secondary">Share</button>
          </div>
        </div>
      </div>
    </main>
  );
}
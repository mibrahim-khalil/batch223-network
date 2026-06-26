import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import usePageLoading from "../hooks/usePageLoading";
import EventRowSkeleton from "../components/EventRowSkeleton";
import { useAuth } from "../features/auth/AuthProvider";
import { createEventApi, listEventsApi, type EventDto, type EventType } from "../features/events/eventsApi";

function includesCI(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

function formatDate(d: string) {
  return d;
}

const RSVP_KEY = "batch223_rsvp_v1";

function loadRsvp(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRsvp(map: Record<string, boolean>) {
  localStorage.setItem(RSVP_KEY, JSON.stringify(map));
}

export default function Events() {
  const loading = usePageLoading(450);
  const { user, isAdmin } = useAuth();

  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [items, setItems] = useState<EventDto[]>([]);
  const [refresh, setRefresh] = useState(0);

  const [composerOpen, setComposerOpen] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType | "All">("All");
  const [cityCountry, setCityCountry] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [filterType, setFilterType] = useState<EventType | "All">("All");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [rsvp, setRsvp] = useState<Record<string, boolean>>(() => loadRsvp());

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(null);
        setBusy(true);
        const data = await listEventsApi({ page: 1, pageSize: 200 });
        if (!alive) return;
        setItems(data.items ?? []);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load events");
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
    return published.filter((e) => {
      if (q.trim()) {
        const hit =
          includesCI(e.title, q) ||
          includesCI(e.venue, q) ||
          includesCI(e.description, q);
        if (!hit) return false;
      }
      if (city.trim() && !includesCI(e.cityCountry, city)) return false;
      if (filterType !== "All" && e.type !== filterType) return false;
      return true;
    });
  }, [published, q, city, filterType]);

  useEffect(() => setPage(1), [q, city, filterType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const toggleRsvp = (id: string) => {
    setRsvp((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveRsvp(next);
      return next;
    });
  };

  const submit = async () => {
    try {
      if (!user?.email) return;
      if (!title.trim() || !cityCountry.trim() || !venue.trim() || !date.trim() || !time.trim() || !description.trim()) return;
      if (type === "All") return;

      setErr(null);

      await createEventApi({
        title: title.trim(),
        type,
        cityCountry: cityCountry.trim(),
        venue: venue.trim(),
        date: date.trim(),
        time: time.trim(),
        description: description.trim(),
      });

      setTitle("");
      setCityCountry("");
      setVenue("");
      setDate("");
      setTime("");
      setDescription("");
      setType("All");
      setComposerOpen(false);
      setRefresh((t) => t + 1);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to submit event");
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
              Events
            </h1>
            <p className="mt-3 text-mute max-w-2xl">
              Students can create events. Events appear publicly after admin approval.
            </p>
            {err ? <p className="mt-4 text-sm text-sale">{err}</p> : null}
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setComposerOpen((v) => !v)}>
              {composerOpen ? "Close" : "Create Event"}
            </button>
          </div>
        </div>

        {/* Composer */}
        {composerOpen ? (
          <div className="mt-8 border border-hairline-soft bg-soft-cloud p-6">
            <p className="label text-ink">New Event</p>

            <div className="mt-4 grid md:grid-cols-2 gap-3">
              <input className="field md:col-span-2" placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />

              <select className="field" value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="All">Select type</option>
                <option value="Meetup">Meetup</option>
                <option value="Workshop">Workshop</option>
                <option value="Webinar">Webinar</option>
                <option value="Sports">Sports</option>
                <option value="Reunion">Reunion</option>
              </select>

              <input className="field" placeholder="City/Country (or Online)" value={cityCountry} onChange={(e) => setCityCountry(e.target.value)} />

              <input className="field md:col-span-2" placeholder="Venue (e.g. CUST Campus / Zoom)" value={venue} onChange={(e) => setVenue(e.target.value)} />

              <input className="field" placeholder="Date (YYYY-MM-DD)" value={date} onChange={(e) => setDate(e.target.value)} />
              <input className="field" placeholder="Time (e.g. 6:00 PM)" value={time} onChange={(e) => setTime(e.target.value)} />

              <textarea className="field-textarea md:col-span-2 min-h-[120px]" placeholder="Event description" value={description} onChange={(e) => setDescription(e.target.value)} />

              <div className="md:col-span-2 flex flex-wrap gap-2 items-center">
                <button className="btn-primary" onClick={submit}>
                  Submit
                </button>
                <p className="text-xs text-mute">
                  {isAdmin ? "Admin events publish instantly." : "Student events go to Pending until approved."}
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

            <div className="mt-6 border-t border-hairline">
              {myPending.map((e) => (
                <div key={e.id} className="py-6 border-b border-hairline-soft">
                  <p className="label">Pending Event</p>
                  <h3 className="mt-2 text-xl font-medium text-ink">{e.title}</h3>
                  <p className="mt-2 text-sm text-charcoal">
                    {e.venue} • {e.cityCountry}
                  </p>
                  <p className="mt-2 text-xs text-mute">
                    {formatDate(e.date)} • {e.time} • {e.type}
                  </p>
                  <p className="mt-3 text-charcoal leading-7">{e.description}</p>

                  <div className="mt-4">
                    <Link to={`/events/${e.id}`} className="btn-secondary">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Filters */}
        <div className="mt-section grid md:grid-cols-3 gap-3">
          <input className="field" placeholder="Search title/venue/keyword" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="field" placeholder="City (e.g. Islamabad / Online)" value={city} onChange={(e) => setCity(e.target.value)} />
          <select className="field" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
            <option value="All">All types</option>
            <option value="Meetup">Meetup</option>
            <option value="Workshop">Workshop</option>
            <option value="Webinar">Webinar</option>
            <option value="Sports">Sports</option>
            <option value="Reunion">Reunion</option>
          </select>
        </div>

        {/* Published List */}
        <section className="mt-section border-t border-hairline">
          {loading || busy ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <EventRowSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {pageItems.map((e) => (
                <EventRow
                  key={e.id}
                  event={e}
                  isRsvp={Boolean(rsvp[e.id])}
                  onToggleRsvp={() => toggleRsvp(e.id)}
                />
              ))}

              {pageItems.length === 0 ? (
                <div className="py-12 text-sm text-mute">No events match your filters.</div>
              ) : null}
            </>
          )}
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

function EventRow({
  event,
  isRsvp,
  onToggleRsvp,
}: {
  event: EventDto;
  isRsvp: boolean;
  onToggleRsvp: () => void;
}) {
  return (
    <div className="py-6 border-b border-hairline-soft">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-pill border border-hairline bg-canvas px-4 py-2 text-xs font-medium tracking-widest uppercase text-ink">
              {event.type}
            </span>
            <span className="text-xs text-mute">
              {formatDate(event.date)} • {event.time}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-medium text-ink">{event.title}</h3>

          <p className="mt-2 text-sm text-charcoal">
            {event.venue} • {event.cityCountry}
          </p>

          <p className="mt-3 text-charcoal leading-7">{event.description}</p>
          <p className="mt-4 text-xs text-mute">By {event.authorEmail}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={`/events/${event.id}`} className="btn-secondary">
            Details
          </Link>

          <button className={isRsvp ? "btn-primary" : "btn-secondary"} onClick={onToggleRsvp}>
            {isRsvp ? "RSVP'd" : "RSVP"}
          </button>
        </div>
      </div>
    </div>
  );
}
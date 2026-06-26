import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FeaturedAlumniCard from "../components/FeaturedAlumniCard";
import RecentlyUpdatedCard from "../components/RecentlyUpdatedCard";
import { getDashboardApi, type FeaturedAlumni, type RecentlyUpdated } from "../features/dashboard/dashboardApi";

export default function Dashboard() {
  const [featuredAlumni, setFeaturedAlumni] = useState<FeaturedAlumni[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<RecentlyUpdated[]>([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr(null);
        setBusy(true);

        const data = await getDashboardApi();
        if (!alive) return;

        setFeaturedAlumni(data.featuredAlumni ?? []);
        setRecentlyUpdated(data.recentlyUpdated ?? []);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load dashboard");
      } finally {
        if (alive) setBusy(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        {/* HERO */}
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-6">
            <p className="label">Private Access</p>

            <h1 className="mt-4 font-display uppercase text-[64px] md:text-[96px] leading-[0.88]">
              Welcome
              <br />
              Batch 223
            </h1>

            <p className="mt-6 text-charcoal text-base md:text-lg leading-7 max-w-xl">
              Welcome to the private alumni network a dedicated space to reconnect, exchange opportunities, and strengthen our community together.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/profile/edit" className="btn-primary">
                Complete Profile
              </Link>
              <Link to="/directory" className="btn-secondary">
                Explore Directory
              </Link>
            </div>

            {err ? <p className="mt-6 text-sm text-sale">{err}</p> : null}

            <div className="mt-section border-t border-hairline pt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-medium">223</p>
                <p className="mt-1 text-sm text-mute">Batch Identity</p>
              </div>
              <div>
                <p className="text-3xl font-medium">Private</p>
                <p className="mt-1 text-sm text-mute">Verified Students Only</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative bg-ink text-canvas overflow-hidden min-h-[420px] md:min-h-[520px]">
              <img
                src="https://cust.edu.pk/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-24-at-11.43.29-AM.jpeg"
                alt="Batch223 group"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

              <div className="absolute left-6 bottom-6 right-6">
                <p className="text-white/80 text-sm">
                  Batch223 • CUST • Private Alumni Network
                </p>

                <h2 className="mt-3 font-display uppercase text-[52px] md:text-[72px] leading-[0.9]">
                  Let’s Connect
                  <br />
                  Again
                </h2>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to="/directory" className="btn-outline-on-image">
                    Find Batchmates
                  </Link>
                  <Link to="/profile" className="btn-outline-on-image">
                    View Your Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-hairline pt-4 text-xs text-mute">
              Tip: Keep your profile updated, company, city, and skills help
              batchmates find you faster.
            </div>
          </div>
        </div>

        {/* FEATURED ALUMNI */}
        <section className="mt-section border-t border-hairline pt-section">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display uppercase text-2xl leading-none">
              Featured Alumni
            </h2>
            <Link to="/directory" className="btn-secondary">
              View Directory
            </Link>
          </div>

          <div className="mt-6 -mx-6 md:-mx-12 px-6 md:px-12 overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {busy
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-[220px] md:w-[240px] border border-hairline-soft bg-soft-cloud h-[320px]" />
                  ))
                : featuredAlumni.map((a) => (
                    <div key={a.id} className="w-[220px] md:w-[240px]">
                      <FeaturedAlumniCard a={a} />
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* RECENTLY UPDATED */}
        <section className="mt-section border-t border-hairline pt-section">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display uppercase text-2xl leading-none">
              Recently Updated
            </h2>
            <Link to="/directory" className="btn-secondary">
              Explore
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {busy
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-hairline-soft bg-soft-cloud h-[140px]" />
                ))
              : recentlyUpdated.map((u) => (
                  <RecentlyUpdatedCard key={u.id} u={u} />
                ))}
          </div>
        </section>
      </div>
    </main>
  );
}
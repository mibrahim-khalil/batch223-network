import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-section">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <p className="label">404</p>

            <h1 className="mt-4 font-display uppercase text-[72px] md:text-[118px] leading-[0.88]">
              Page
              <br />
              Not Found
            </h1>

            <p className="mt-6 max-w-xl text-charcoal text-base md:text-lg leading-7">
              This page doesn’t exist or you don’t have access to it. Return to
              Batch223 Network and continue exploring.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="btn-primary">
                Go Home
              </Link>
              <Link to="/directory" className="btn-secondary">
                Open Directory
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px] bg-ink text-canvas overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1400&auto=format&fit=crop"
              alt="Not found"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

            <div className="absolute left-6 bottom-6">
              <p className="text-white/80 text-sm">Batch223 Network</p>
              <h2 className="mt-3 font-display uppercase text-[54px] md:text-[72px] leading-[0.9]">
                Lost?
                <br />
                Reconnect.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
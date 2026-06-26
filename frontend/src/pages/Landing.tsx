import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";

export default function Landing() {
  const { isAuthed } = useAuth();

  // If logged in, don't show landing. Go to dashboard.
  if (isAuthed) return <Navigate to="/app" replace />;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-80 blur-[7px]">
          <PreviewDirectory />
        </div>

        <div className="absolute inset-0 bg-canvas/70" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-5 text-sm font-medium text-mute">
                Exclusively for the CUST SE Batch 223 community
              </p>

              <h1 className="font-display uppercase text-[64px] md:text-[96px] lg:text-[118px] leading-[0.88] tracking-tight">
                Reconnect.
                <br />
                Grow.
                <br />
                Network.
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg leading-7 text-charcoal">
                The private digital hub for SE Batch223 connect with classmates, build your professional profile, share opportunities, and stay connected beyond university.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Register with CUST Email
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </div>

              <p className="mt-5 text-sm text-mute">
                Only verified Software Engineering Batch 223 students{" "}
                <span className="font-medium text-ink">bse223XXX@cust.pk</span>{" "}
                can register.
              </p>
            </motion.div>

            <div className="grid gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative min-h-[360px] md:min-h-[420px] bg-ink text-canvas overflow-hidden"
              >
                <img
                  src="https://image.free-apply.com/gallery/l/uni/gallery/lg/1058600086/2665b079b8195734075ff95df1f078416be27744.jpg?s=640"
                  alt="Batch223"
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                <div className="absolute left-6 bottom-6">
                  <p className="mb-3 text-sm text-white/80">
                    Batch223 private alumni space
                  </p>
                  <h2 className="font-display uppercase text-[52px] md:text-[72px] leading-[0.9]">
                    Locked
                    <br />
                    Until Login
                  </h2>

                  <Link to="/register" className="btn-outline-on-image mt-5">
                    Request Access
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="relative overflow-hidden bg-soft-cloud"
              >
                <img
                  src="https://cust.edu.pk/wp-content/uploads/2023/12/4.jpg"
                  alt="CUST Campus"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/10 to-transparent" />

                <div className="relative p-6 text-canvas">
                  <p className="text-sm text-white/80">CUST • BSE • Batch 223</p>
                  <h3 className="mt-2 font-display uppercase text-[44px] md:text-[56px] leading-[0.9]">
                    CUST
                    <br />
                    Alumni
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-pill bg-canvas text-ink px-4 py-2 text-sm font-medium">
                      Verified Students Only
                    </span>
                    <span className="inline-flex items-center rounded-pill bg-canvas/20 text-canvas px-4 py-2 text-sm font-medium">
                      Private Network
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

<div className="mt-section grid grid-cols-2 md:grid-cols-4 border-y border-hairline">
  {[
    ["SE223", "Batch Code"],
    ["Private", "Community"],
    ["Verified", "Students Only"],
    ["CUST", "University"],
  ].map(([num, label]) => (
    <div
      key={label}
      className="py-8 border-r last:border-r-0 border-hairline flex flex-col items-center justify-center text-center"
    >
      <p className="text-3xl font-medium">{num}</p>
      <p className="mt-1 text-sm text-mute">{label}</p>
    </div>
  ))}
</div>
        </div>
      </section>
    </main>
  );
}

function PreviewDirectory() {
  const items = new Array(12).fill(0);

  return (
    <div className="pt-32 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((_, i) => (
          <div key={i} className="bg-canvas">
            <div className="aspect-square bg-soft-cloud" />
            <div className="pt-3">
              <div className="h-4 w-32 bg-ink/15 mb-2" />
              <div className="h-3 w-40 bg-ink/10 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 w-14 rounded-pill bg-ink/10" />
                <div className="h-6 w-16 rounded-pill bg-ink/10" />
                <div className="h-6 w-12 rounded-pill bg-ink/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
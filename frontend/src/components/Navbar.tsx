import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";
import { useTheme } from "../features/theme/ThemeProvider";

type NavItem = { to: string; label: string; end?: boolean };

function navLinkClassName({ isActive }: { isActive: boolean }) {
  const base =
    "relative text-sm font-medium text-ink px-2 py-1 inline-flex items-center";
  const underline =
    "after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-[10px] after:h-[2px] after:bg-ink";
  return isActive ? `${base} ${underline}` : base;
}

function SunIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5 19 19M5 19l-1.5 1.5M20.5 3.5 19 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 13.2A7.6 7.6 0 0 1 10.8 3 8.8 8.8 0 1 0 21 13.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { isAuthed, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const authedNav: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      { to: "/app", label: "Dashboard", end: true },
      { to: "/directory", label: "Directory" },
      { to: "/announcements", label: "Announcements" },
      { to: "/jobs", label: "Jobs & Internships" },
      { to: "/events", label: "Events" },
      { to: "/profile", label: "Profile" },
    ];

    if (isAdmin) items.push({ to: "/admin", label: "Admin" });
    return items;
  }, [isAdmin]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Utility Bar */}
      <div className="h-9 bg-soft-cloud px-6 text-xs font-medium flex items-center justify-end gap-4">
        <span>Private Community of CUST SE Batch 223</span>

        <Link
          to="/help"
          className="text-mute hover:text-ink underline underline-offset-4"
        >
          Help
        </Link>
      </div>

      {/* Primary Nav */}
      <nav className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-hairline-soft bg-canvas">
        {/* Brand */}
        <Link to="/" className="text-lg font-semibold tracking-tight">
          SEBatch223 Network
        </Link>

        {/* Desktop center links */}
        {isAuthed ? (
          <div className="hidden md:flex items-center gap-6">
            {authedNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClassName}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="hidden md:block" />
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-pill bg-soft-cloud text-ink inline-flex items-center justify-center border border-hairline-soft"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {!isAuthed ? (
            <>
              <Link
                to="/login"
                className="h-10 px-5 rounded-pill bg-soft-cloud text-ink text-sm font-medium inline-flex items-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="h-10 px-5 rounded-pill bg-ink text-canvas text-sm font-medium inline-flex items-center"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Mobile: hamburger */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden h-10 w-10 rounded-pill bg-soft-cloud text-ink inline-flex items-center justify-center border border-hairline-soft"
                aria-label="Open menu"
                aria-expanded={open}
              >
                <MenuIcon />
              </button>

              {/* Desktop: logout */}
              <button
                onClick={logout}
                className="hidden md:inline-flex h-10 px-5 rounded-pill bg-ink text-canvas text-sm font-medium items-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isAuthed && open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-ink/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed top-0 right-0 h-full w-[86%] max-w-[360px] bg-canvas z-50 border-l border-hairline-soft"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-hairline-soft">
                <p className="text-sm font-medium text-ink">Menu</p>
                <button
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 rounded-pill bg-soft-cloud text-ink inline-flex items-center justify-center border border-hairline-soft"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="px-6 py-6">
                <div className="space-y-2">
                  {authedNav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        [
                          "flex items-center justify-between px-4 py-3 rounded-nike-md border",
                          isActive
                            ? "bg-soft-cloud border-hairline-soft text-ink"
                            : "bg-canvas border-hairline-soft text-ink",
                        ].join(" ")
                      }
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-mute">→</span>
                    </NavLink>
                  ))}
                </div>

                <div className="mt-6 border-t border-hairline pt-6">
                  <button onClick={logout} className="btn-primary w-full">
                    Logout
                  </button>
                </div>

                {isAdmin ? (
                  <p className="mt-4 text-xs text-mute">
                    Admin access enabled for this account.
                  </p>
                ) : (
                  <p className="mt-4 text-xs text-mute">
                    SEBatch223 Network • Private Alumni Space
                  </p>
                )}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";
import { loginApi } from "../features/auth/authApi";

const PENDING_EMAIL_KEY = "batch223_pending_email";
const PENDING_PASS_KEY = "batch223_pending_pass";

function looksUnverifiedError(e: any) {
  const msg = String(e?.message ?? "").toLowerCase();
  return (
    msg.includes("not verified") ||
    msg.includes("verify your email") ||
    msg.includes("email not verified")
  );
}

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { isAuthed, setSession } = useAuth();

  const [notice, setNotice] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    if (qs.get("expired") === "1") {
      setNotice("Session timed out. Please login again.");
    } else {
      setNotice(null);
    }
  }, [location.search]);

  if (isAuthed) return <Navigate to="/app" replace />;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[520px] mx-auto px-6 pt-16">
        <h1 className="font-display uppercase text-[64px] leading-[0.9]">
          Login
        </h1>
        <p className="mt-3 text-mute">Welcome back.</p>

        <div className="mt-8 space-y-3">
          {notice ? (
            <div className="rounded-nike-md border border-hairline-soft bg-soft-cloud px-4 py-3 text-sm text-ink">
              {notice}
            </div>
          ) : null}

          <input
            className="search-pill"
            placeholder="bse223XXX@cust.pk"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(null);
            }}
          />

          <input
            className="search-pill"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr(null);
            }}
          />

          <div className="flex items-center justify-between">
            <span />
            <Link to="/forgot-password" className="text-sm underline text-ink">
              Forgot password?
            </Link>
          </div>

          {err ? <p className="text-sm text-sale">{err}</p> : null}

          <button
            className="btn-primary w-full"
            disabled={busy}
            style={{ opacity: busy ? 0.6 : 1 }}
            onClick={async () => {
              try {
                setBusy(true);
                setErr(null);

                if (!email.trim()) {
                  setErr("Enter your email.");
                  return;
                }
                if (!password) {
                  setErr("Enter your password.");
                  return;
                }

                const data = await loginApi(email.trim(), password);

                setSession({
                  accessToken: data.accessToken,
                  refreshToken: data.refreshToken,
                  user: data.user,
                });

                nav("/app");
              } catch (e: any) {
                if (looksUnverifiedError(e)) {
                  sessionStorage.setItem(PENDING_EMAIL_KEY, email.trim());
                  sessionStorage.setItem(PENDING_PASS_KEY, password);
                  nav("/verify-email");
                  return;
                }

                setErr(e?.message ?? "Login failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Signing in..." : "Login"}
          </button>

          <div className="pt-2 text-sm">
            <p className="text-mute">Don’t have an account?</p>
            <Link
              to="/register"
              className="inline-block mt-1 underline text-ink font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { forgotPasswordApi } from "../features/auth/authApi";

const RESET_EMAIL_KEY = "batch223_reset_email";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <div className="max-w-[520px] mx-auto px-6 pt-16">
        <h1 className="font-display uppercase text-[56px] leading-[0.9]">
          Forgot Password
        </h1>
        <p className="mt-3 text-mute">
          Enter your university email. We will send a 6-digit reset OTP.
        </p>

        <div className="mt-8 space-y-3">
          <input
            className="search-pill"
            placeholder="bse223XXX@cust.pk"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(null);
              setNotice(null);
            }}
          />

          {notice ? <p className="text-sm text-success">{notice}</p> : null}
          {err ? <p className="text-sm text-sale">{err}</p> : null}

          <button
            className="btn-primary w-full"
            disabled={busy}
            style={{ opacity: busy ? 0.6 : 1 }}
            onClick={async () => {
              try {
                setBusy(true);
                setErr(null);
                setNotice(null);

                if (!email.trim()) {
                  setErr("Email is required.");
                  return;
                }

                const res = await forgotPasswordApi(email.trim());
                setNotice(res.message);

                sessionStorage.setItem(RESET_EMAIL_KEY, email.trim());
                nav("/reset-password");
              } catch (e: any) {
                setErr(e?.message ?? "Failed to send reset OTP");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Sending..." : "Send Reset OTP"}
          </button>

          <Link to="/login" className="block text-sm underline text-ink">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
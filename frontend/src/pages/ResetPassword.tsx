import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { resetPasswordApi } from "../features/auth/authApi";

const RESET_EMAIL_KEY = "batch223_reset_email";

export default function ResetPassword() {
  const nav = useNavigate();
  const email = useMemo(() => sessionStorage.getItem(RESET_EMAIL_KEY) || "", []);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!email) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <div className="max-w-[720px] mx-auto px-6 py-section">
          <h1 className="font-display uppercase text-[56px] leading-[0.9]">
            Reset Password
          </h1>
          <p className="mt-4 text-mute">
            No reset request found. Please start again.
          </p>
          <div className="mt-8">
            <Link to="/forgot-password" className="btn-secondary">
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <div className="max-w-[520px] mx-auto px-6 pt-16">
        <h1 className="font-display uppercase text-[56px] leading-[0.9]">
          Reset Password
        </h1>

        <p className="mt-3 text-mute">
          Enter the OTP sent to{" "}
          <span className="text-ink font-medium">{email}</span>
        </p>

        <div className="mt-8 space-y-3">
          <input
            className="search-pill"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              setErr(null);
              setNotice(null);
            }}
          />

          <input
            className="search-pill"
            placeholder="New password (min 8 chars)"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErr(null);
              setNotice(null);
            }}
          />

          {notice ? <p className="text-sm text-mute">{notice}</p> : null}
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

                if (!/^\d{6}$/.test(otp)) {
                  setErr("Enter a valid 6-digit OTP.");
                  return;
                }
                if (newPassword.length < 8) {
                  setErr("Password must be at least 8 characters.");
                  return;
                }

                const res = await resetPasswordApi(email, otp, newPassword);
                setNotice(res.message);

                sessionStorage.removeItem(RESET_EMAIL_KEY);
                nav("/login");
              } catch (e) {
                setErr(e instanceof Error ? e.message : "Failed to reset password");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Resetting..." : "Reset Password"}
          </button>

          <Link to="/forgot-password" className="block text-sm underline text-ink">
            Send OTP again
          </Link>
        </div>
      </div>
    </main>
  );
}
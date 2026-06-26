import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/AuthProvider";
import { loginApi, resendOtpApi, verifyEmailApi } from "../features/auth/authApi";

const PENDING_EMAIL_KEY = "batch223_pending_email";
const PENDING_PASS_KEY = "batch223_pending_pass";

function isSixDigits(code: string) {
  return /^\d{6}$/.test(code);
}

export default function VerifyEmailOtp() {
  const nav = useNavigate();
  const { isAuthed, setSession } = useAuth();

  const email = useMemo(() => sessionStorage.getItem(PENDING_EMAIL_KEY) || "", []);
  const password = useMemo(
    () => sessionStorage.getItem(PENDING_PASS_KEY) || "",
    []
  );

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  if (isAuthed) return <Navigate to="/app" replace />;

  useEffect(() => {
    if (!email) return;
    refs.current[0]?.focus();
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // If user refreshes page and sessionStorage is cleared
  if (!email || !password) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <div className="max-w-[720px] mx-auto px-6 md:px-12 py-section">
          <h1 className="font-display uppercase text-[64px] leading-[0.9]">
            Verify Email
          </h1>
          <p className="mt-4 text-mute">
            No pending verification found. Please register again.
          </p>
          <div className="mt-8">
            <Link to="/register" className="btn-secondary">
              Go to Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const code = digits.join("");

  const onVerify = async () => {
    try {
      setBusy(true);
      setError(null);
      setNotice(null);

      if (!isSixDigits(code)) {
        setError("Enter the 6-digit code.");
        return;
      }

      // 1) Verify OTP
      await verifyEmailApi(email, code);

      // 2) Login immediately
      setNotice("Email verified. Logging you in...");
      const data = await loginApi(email, password);

      // 3) Store session
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          email: data.user.email,
          role: data.user.role as "student" | "admin",
        },
      });

      // 4) Clear pending keys
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
      sessionStorage.removeItem(PENDING_PASS_KEY);

      nav("/app");
    } catch (e: any) {
      setError(e?.message ?? "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return;

    try {
      setBusy(true);
      setError(null);
      setNotice(null);

      await resendOtpApi(email);
      setCooldown(30);
      setNotice("Code resent. Please check your email (and spam).");
    } catch (e: any) {
      setError(e?.message ?? "Failed to resend code");
    } finally {
      setBusy(false);
    }
  };

  const setDigitAt = (idx: number, val: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handlePaste = (raw: string) => {
    const onlyDigits = raw.replace(/\D/g, "").slice(0, 6);
    if (!onlyDigits) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < 6; i++) next[i] = onlyDigits[i] ?? "";
    setDigits(next);

    const focusIdx = Math.min(onlyDigits.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[920px] mx-auto px-6 md:px-12 py-section">
        <div className="border-b border-hairline pb-8">
          <p className="label">Email Verification</p>
          <h1 className="mt-3 font-display uppercase text-[56px] md:text-[72px] leading-[0.9]">
            Enter OTP
          </h1>
          <p className="mt-3 text-mute">
            We sent a 6-digit verification code to:
            <span className="text-ink font-medium"> {email}</span>
          </p>
        </div>

        <div className="mt-section grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="mt-2 flex gap-3 flex-wrap">
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    refs.current[idx] = el;
                  }}
                  value={d}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-14 w-12 md:h-16 md:w-14 text-center bg-soft-cloud rounded-nike-md border border-transparent focus:border-ink outline-none text-lg font-medium"
                  onPaste={(e) => {
                    e.preventDefault();
                    handlePaste(e.clipboardData.getData("text"));
                    setError(null);
                    setNotice(null);
                  }}
                  onChange={(e) => {
                    setError(null);
                    setNotice(null);
                    const val = e.target.value.replace(/\D/g, "").slice(-1);
                    setDigitAt(idx, val);
                    if (val && idx < 5) refs.current[idx + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    setError(null);
                    setNotice(null);

                    if (e.key === "Enter") {
                      e.preventDefault();
                      onVerify();
                      return;
                    }

                    if (e.key === "Backspace") {
                      e.preventDefault();
                      if (digits[idx]) {
                        setDigitAt(idx, "");
                        return;
                      }
                      if (idx > 0) {
                        setDigitAt(idx - 1, "");
                        refs.current[idx - 1]?.focus();
                      }
                    }
                  }}
                />
              ))}
            </div>

            {notice && (
              <div className="mt-4 rounded-nike-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
                {notice}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-nike-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                className="btn-primary"
                onClick={onVerify}
                disabled={busy || !isSixDigits(code)}
              >
                {busy ? "Please wait..." : "Verify & Continue"}
              </button>

              <button
                className="btn-secondary"
                onClick={onResend}
                disabled={busy || cooldown > 0}
                type="button"
              >
                {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend Code"}
              </button>
            </div>

            <p className="mt-6 text-sm text-mute">
              Wrong email?{" "}
              <Link
                to="/register"
                className="underline underline-offset-4 hover:opacity-80"
                onClick={() => {
                  sessionStorage.removeItem(PENDING_EMAIL_KEY);
                  sessionStorage.removeItem(PENDING_PASS_KEY);
                }}
              >
                Go back to Register
              </Link>
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-nike-md border border-hairline bg-soft-cloud p-6">
              <h3 className="font-medium">Tips</h3>
              <ul className="mt-3 text-sm text-mute space-y-2 list-disc pl-5">
                <li>Check spam/junk if email doesn’t arrive.</li>
                <li>You can paste the full 6-digit code.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
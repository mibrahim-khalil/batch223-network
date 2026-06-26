import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { isBatch223Email, isBatch223RegNo } from "../features/auth/emailRules";
import { registerApi } from "../features/auth/authApi";

const PENDING_EMAIL_KEY = "batch223_pending_email";
const PENDING_PASS_KEY = "batch223_pending_pass";

export default function Register() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (!avatar) {
      setAvatarPreview("");
      return;
    }
    const url = URL.createObjectURL(avatar);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  const initialLetter = useMemo(() => {
    const t = fullName.trim();
    return t ? t.slice(0, 1).toUpperCase() : "S";
  }, [fullName]);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />

      <div className="max-w-[520px] mx-auto px-6 pt-16">
        <h1 className="font-display uppercase text-[64px] leading-[0.9]">
          Register
        </h1>
        <p className="mt-3 text-mute">
          Only emails like <b>bse223XXX@cust.pk</b> are allowed.
        </p>

        <div className="mt-8 space-y-3">
          {/* Avatar optional */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-soft-cloud border border-hairline-soft overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-xl text-mute">
                  {initialLetter}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="search-pill flex items-center justify-between gap-3">
                <span className="text-sm text-mute truncate">
                  {avatar ? avatar.name : "Upload Profile Picture (optional)"}
                </span>

                <div className="flex items-center gap-3">
                  {avatar ? (
                    <button
                      type="button"
                      className="text-sm font-medium underline"
                      onClick={() => {
                        setAvatar(null);
                        setErr(null);
                      }}
                    >
                      Remove
                    </button>
                  ) : null}

                  <label className="text-sm font-medium underline cursor-pointer">
                    Choose
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setAvatar(f);
                        setErr(null);
                      }}
                    />
                  </label>
                </div>
              </div>
              <p className="mt-2 text-xs text-mute">
                Tip: You can change this later in Profile → Edit Profile.
              </p>
            </div>
          </div>

          <input
            className="search-pill"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setErr(null);
            }}
          />

          <input
            className="search-pill"
            placeholder="Registration Number (e.g. BSE223182)"
            value={registrationNumber}
            onChange={(e) => {
              setRegistrationNumber(e.target.value);
              setErr(null);
            }}
          />

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
            placeholder="Password (min 8 chars)"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr(null);
            }}
          />

          {err ? <p className="text-sm text-sale">{err}</p> : null}

          <button
            className="btn-primary w-full"
            disabled={busy}
            style={{ opacity: busy ? 0.6 : 1 }}
            onClick={async () => {
              try {
                setBusy(true);
                setErr(null);

                if (!fullName.trim()) {
                  setErr("Full name is required.");
                  return;
                }

                if (!registrationNumber.trim()) {
                  setErr("Registration number is required.");
                  return;
                }

                if (!isBatch223RegNo(registrationNumber)) {
                  setErr("Only batch SE223 registration numbers are allowed.");
                  return;
                }

                if (!isBatch223Email(email)) {
                  setErr("Only emails like bse223XXX@cust.pk are allowed.");
                  return;
                }

                if (password.length < 8) {
                  setErr("Password must be at least 8 characters.");
                  return;
                }

                await registerApi({
                  email: email.trim(),
                  password,
                  fullName: fullName.trim(),
                  registrationNumber: registrationNumber.trim(),
                  avatar,
                });

                sessionStorage.setItem(PENDING_EMAIL_KEY, email.trim());
                sessionStorage.setItem(PENDING_PASS_KEY, password);

                nav("/verify-email");
              } catch (e: any) {
                setErr(e?.message ?? "Register failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Sending OTP..." : "Continue to Verification"}
          </button>

          <div className="pt-2 text-sm">
            <p className="text-mute">Already have an account?</p>
            <Link to="/login" className="inline-block mt-1 underline text-ink font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
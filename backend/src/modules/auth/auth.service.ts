import bcrypt from "bcrypt";
import { User } from "../../models/User";
import { assertBatch223Email } from "../../utils/custEmail";
import { generateOtp6, hashOtp } from "../../utils/otp";
import { env } from "../../config/env";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { cloudinary } from "../../config/cloudinary";
import { sendEmail } from "../../utils/mailer";

const ADMIN_EMAILS = ["bse223000@cust.pk", "bse223001@cust.pk"];

function assertBse223RegNo(regNoRaw: string) {
  const reg = regNoRaw.trim().toUpperCase();
  if (!/^BSE223\d{1,}$/i.test(reg)) {
    const err: any = new Error("Registration number must be like BSE223182.");
    err.statusCode = 400;
    throw err;
  }
  return reg;
}

function uploadAvatarBufferToCloudinary(opts: { buffer: Buffer; folder: string }) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: opts.folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err || !result) return reject(err || new Error("Avatar upload failed"));
        resolve({ secure_url: result.secure_url });
      }
    );
    stream.end(opts.buffer);
  });
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

function buildOtpEmailHtml(opts: {
  fullName: string;
  registrationNumber: string;
  otp: string;
  expiresMinutes: number;
  heading: string;
  intro: string;
}) {
  const year = new Date().getFullYear();

  return `
  <div style="margin:0;padding:0;background:#f6f7fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:24px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                 style="max-width:600px;background:#ffffff;border:1px solid #e8e8ef;border-radius:10px;overflow:hidden;">
            
            <tr>
              <td style="padding:18px 22px;background:#0b0f19;color:#fff;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.9;">
                  SEBatch223 Network
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;margin-top:6px;line-height:1.3;">
                  ${escapeHtml(opts.heading)}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:22px;">
                <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.65;">
                  <div style="font-size:14px;color:#111827;">
                    <b>${escapeHtml(opts.fullName || "Student")}</b>
                    ${
                      opts.registrationNumber
                        ? ` <span style="color:#6b7280;">(${escapeHtml(opts.registrationNumber)})</span>`
                        : ""
                    }
                  </div>

                  <div style="margin-top:10px;font-size:14px;color:#374151;">
                    ${escapeHtml(opts.intro)}
                  </div>

                  <div style="margin-top:14px;font-size:13px;color:#374151;">
                    Use the OTP code below:
                  </div>

                  <div style="margin:14px 0 16px 0;padding:16px;border:1px dashed #c7c9d6;background:#f9fafb;text-align:center;border-radius:10px;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:900;letter-spacing:8px;color:#0b0f19;">
                      ${escapeHtml(opts.otp)}
                    </div>
                  </div>

                  <div style="font-size:13px;color:#374151;">
                    This code will expire in <b>${opts.expiresMinutes} minutes</b>.
                  </div>

                  <div style="margin-top:14px;font-size:12px;color:#6b7280;">
                    If you did not request this, ignore this email.<br/>
                    Do not share your OTP with anyone.
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 22px;border-top:1px solid #e8e8ef;background:#ffffff;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">
                  © ${year} SE Batch 223 Network • CUST
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}

export async function register(opts: {
  email: string;
  password: string;
  fullName: string;
  registrationNumber: string;
  avatarFile?: Express.Multer.File;
}) {
  const email = assertBatch223Email(opts.email);
  const regNo = assertBse223RegNo(opts.registrationNumber);

  const existing = await User.findOne({ email });
  if (existing) {
    const err: any = new Error("Email already registered.");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(opts.password, 12);

  const otp = generateOtp6();
  const otpHash = hashOtp(otp);
  const expiresMinutes = 10;
  const expires = new Date(Date.now() + expiresMinutes * 60 * 1000);

  const role = ADMIN_EMAILS.includes(email) ? "admin" : "student";

  const user = await User.create({
    email,
    passwordHash,
    role,
    emailVerified: false,
    emailOtpHash: otpHash,
    emailOtpExpiresAt: expires,
    fullName: opts.fullName.trim(),
    registrationNumber: regNo,
  });

  if (opts.avatarFile) {
    if (!opts.avatarFile.mimetype.startsWith("image/")) {
      const err: any = new Error("Avatar must be an image.");
      err.statusCode = 400;
      throw err;
    }

    const out = await uploadAvatarBufferToCloudinary({
      buffer: opts.avatarFile.buffer,
      folder: `batch223/${user._id}`,
    });

    user.avatarUrl = out.secure_url;
    user.avatarFileName = opts.avatarFile.originalname;
    await user.save();
  }

  if (env.MAIL_MODE === "log") {
    console.log(`OTP for ${email}: ${otp}`);
  } else if (env.MAIL_MODE === "smtp") {
    await sendEmail({
      to: email,
      subject: "Welcome to CUST SE Batch 223 — OTP Verification Code",
      html: buildOtpEmailHtml({
        heading: "Welcome to Department of Software Engineering, CUST — Batch 223",
        intro: "We respect your interest in joining the Batch 223 community.",
        fullName: user.fullName,
        registrationNumber: user.registrationNumber,
        otp,
        expiresMinutes,
      }),
    });
  }

  return { email };
}

export async function resendEmailOtp(emailRaw: string) {
  const email = assertBatch223Email(emailRaw);

  const user: any = await User.findOne({ email });
  if (!user) {
    const err: any = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }

  if (user.emailVerified) return { ok: true };

  const otp = generateOtp6();
  const expiresMinutes = 10;

  user.emailOtpHash = hashOtp(otp);
  user.emailOtpExpiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
  await user.save();

  if (env.MAIL_MODE === "log") {
    console.log(`OTP for ${email}: ${otp}`);
  } else if (env.MAIL_MODE === "smtp") {
    await sendEmail({
      to: email,
      subject: "CUST SE Batch 223 — OTP Code (Resent)",
      html: buildOtpEmailHtml({
        heading: "CUST SE Batch 223 — Email Verification",
        intro: "Here is your OTP again to complete email verification.",
        fullName: user.fullName ?? "Student",
        registrationNumber: user.registrationNumber ?? "",
        otp,
        expiresMinutes,
      }),
    });
  }

  return { ok: true };
}

export async function verifyEmail(emailRaw: string, otp: string) {
  const email = assertBatch223Email(emailRaw);

  const user = await User.findOne({ email });
  if (!user) {
    const err: any = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }

  if (user.emailVerified) return { emailVerified: true };

  if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
    const err: any = new Error("No OTP found. Please resend OTP.");
    err.statusCode = 400;
    throw err;
  }

  if (user.emailOtpExpiresAt.getTime() < Date.now()) {
    const err: any = new Error("OTP expired. Please resend OTP.");
    err.statusCode = 400;
    throw err;
  }

  const ok = hashOtp(otp) === user.emailOtpHash;
  if (!ok) {
    const err: any = new Error("Invalid OTP.");
    err.statusCode = 400;
    throw err;
  }

  user.emailVerified = true;
  user.emailOtpHash = null;
  user.emailOtpExpiresAt = null;
  await user.save();

  return { emailVerified: true };
}

export async function requestPasswordReset(emailRaw: string) {
  const email = assertBatch223Email(emailRaw);

  const user: any = await User.findOne({ email });

  // security: do not reveal if email exists
  if (!user) return { ok: true };

  const otp = generateOtp6();
  const expiresMinutes = 10;

  user.passwordResetOtpHash = hashOtp(otp);
  user.passwordResetOtpExpiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
  await user.save();

  if (env.MAIL_MODE === "log") {
    console.log(`RESET OTP for ${email}: ${otp}`);
  } else if (env.MAIL_MODE === "smtp") {
    await sendEmail({
      to: email,
      subject: "CUST SE Batch 223 — Password Reset OTP",
      html: buildOtpEmailHtml({
        heading: "Password Reset — CUST SE Batch 223",
        intro: "We received a request to reset your password for SEBatch223 Network.",
        fullName: user.fullName ?? "Student",
        registrationNumber: user.registrationNumber ?? "",
        otp,
        expiresMinutes,
      }),
    });
  }

  return { ok: true };
}

export async function resetPassword(emailRaw: string, otp: string, newPassword: string) {
  const email = assertBatch223Email(emailRaw);

  const user: any = await User.findOne({ email });
  if (!user) {
    const err: any = new Error("Invalid reset request.");
    err.statusCode = 400;
    throw err;
  }

  if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
    const err: any = new Error("No reset OTP found. Please request again.");
    err.statusCode = 400;
    throw err;
  }

  if (user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
    const err: any = new Error("Reset OTP expired. Please request again.");
    err.statusCode = 400;
    throw err;
  }

  const ok = hashOtp(otp) === user.passwordResetOtpHash;
  if (!ok) {
    const err: any = new Error("Invalid reset OTP.");
    err.statusCode = 400;
    throw err;
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordResetOtpHash = null;
  user.passwordResetOtpExpiresAt = null;

  await user.save();

  return { ok: true };
}

export async function login(emailRaw: string, password: string) {
  const email = assertBatch223Email(emailRaw);

  const user = await User.findOne({ email });
  if (!user) {
    const err: any = new Error("Invalid credentials.");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err: any = new Error("Invalid credentials.");
    err.statusCode = 401;
    throw err;
  }

  if (!user.emailVerified) {
    const err: any = new Error("Email not verified. Please verify OTP.");
    err.statusCode = 403;
    throw err;
  }

  const payload = { sub: String(user._id), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: { email: user.email, role: user.role },
  };
}
import nodemailer from "nodemailer";
import { env } from "../config/env";

let transporter: nodemailer.Transporter | null = null;
let transporterReady = false;

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(env.SMTP_PORT);

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },

    //  timeouts help on cloud deployments
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,

    // Optional but fine for Gmail on 587
    requireTLS: port === 587,

    // Debug only in non-production
    logger: env.NODE_ENV !== "production",
    debug: env.NODE_ENV !== "production",
  });

  return transporter;
}

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  console.log("[sendEmail] MAIL_MODE =", env.MAIL_MODE);

  if (env.MAIL_MODE !== "smtp") {
    console.log("[sendEmail] Skipped (not smtp). To:", opts.to);
    return;
  }

  const t = getTransporter();

  //  Verify once (first email only)
  if (!transporterReady) {
    try {
      await t.verify();
      transporterReady = true;
      console.log("[sendEmail] SMTP verified");
    } catch (e) {
      console.error("[sendEmail] SMTP verify failed:", e);
      throw e;
    }
  }

  const info = await t.sendMail({
    from: env.SMTP_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  console.log("[sendEmail] messageId:", info.messageId);
  console.log("[sendEmail] accepted:", info.accepted);
  console.log("[sendEmail] rejected:", info.rejected);
  console.log("[sendEmail] response:", info.response);
}
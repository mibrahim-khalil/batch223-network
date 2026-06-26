import nodemailer from "nodemailer";
import { env } from "../config/env";

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  console.log("[sendEmail] MAIL_MODE =", env.MAIL_MODE);

  if (env.MAIL_MODE !== "smtp") {
    console.log("[sendEmail] Skipped (not smtp). To:", opts.to);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  // checks connection/auth
  await transporter.verify();

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  console.log("[sendEmail] messageId:", info.messageId);
  console.log("[sendEmail] accepted:", info.accepted);
  console.log("[sendEmail] rejected:", info.rejected);
  console.log("[sendEmail] response:", info.response);
}
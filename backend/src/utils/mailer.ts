import nodemailer from "nodemailer";
import { env } from "../config/env";

let transporter: nodemailer.Transporter | null = null;
let transporterReady = false;

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(env.SMTP_PORT);

  const options = {
    host: env.SMTP_HOST,
    port,
    secure: port === 465,

    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },

    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,

    requireTLS: port === 587,

    logger: env.NODE_ENV !== "production",
    debug: env.NODE_ENV !== "production",
  } as any;

  transporter = nodemailer.createTransport(options);
  return transporter;
}

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (env.MAIL_MODE !== "smtp") return;

  const t = getTransporter();

  if (!transporterReady) {
    await t.verify();
    transporterReady = true;
  }

  await t.sendMail({
    from: env.SMTP_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}
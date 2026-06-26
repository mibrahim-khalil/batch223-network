import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const MAIL_MODE = process.env.MAIL_MODE ?? "log";
const IS_SMTP = MAIL_MODE === "smtp";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),

  MONGODB_URI: requireEnv("MONGODB_URI"),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",

  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),

  MAIL_MODE,

  // only required when using smtp
  SMTP_HOST: IS_SMTP ? requireEnv("SMTP_HOST") : "",
  SMTP_PORT: IS_SMTP ? Number(requireEnv("SMTP_PORT")) : 0,
  SMTP_USER: IS_SMTP ? requireEnv("SMTP_USER") : "",
  SMTP_PASS: IS_SMTP ? requireEnv("SMTP_PASS") : "",
  SMTP_FROM: IS_SMTP ? requireEnv("SMTP_FROM") : "",

  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
};
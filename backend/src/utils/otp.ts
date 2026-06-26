import crypto from "crypto";

export function generateOtp6() {
  return String(crypto.randomInt(100000, 1000000)); // 6 digits
}

export function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
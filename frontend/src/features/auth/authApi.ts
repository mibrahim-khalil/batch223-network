import { api } from "../../lib/apiClient";

export type UserRole = "student" | "admin";

export async function registerApi(opts: {
  email: string;
  password: string;
  fullName: string;
  registrationNumber: string;
  avatar?: File | null;
}) {
  const fd = new FormData();
  fd.append("email", opts.email);
  fd.append("password", opts.password);
  fd.append("fullName", opts.fullName);
  fd.append("registrationNumber", opts.registrationNumber);
  if (opts.avatar) fd.append("avatar", opts.avatar);

  return api<{ message: string; email: string }>("/api/auth/register", {
    method: "POST",
    body: fd,
  });
}

export async function verifyEmailApi(email: string, otp: string) {
  return api<{ message: string }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resendOtpApi(email: string) {
  return api<{ message: string }>("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function loginApi(email: string, password: string) {
  return api<{
    accessToken: string;
    refreshToken: string;
    user: { email: string; role: UserRole };
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function forgotPasswordApi(email: string) {
  return api<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string) {
  return api<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, newPassword }),
  });
}
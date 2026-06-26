import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(8),
  fullName: z.string().min(2).max(80),
  registrationNumber: z.string().min(3).max(30),
});

export const verifySchema = z.object({
  email: z.string().min(5),
  otp: z.string().regex(/^\d{6}$/),
});

export const resendSchema = z.object({
  email: z.string().min(5),
});

export const loginSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(5),
});

export const resetPasswordSchema = z.object({
  email: z.string().min(5),
  otp: z.string().regex(/^\d{6}$/),
  newPassword: z.string().min(8),
});
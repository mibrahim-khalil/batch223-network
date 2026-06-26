import type { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  verifySchema,
  loginSchema,
  resendSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import * as service from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const body = registerSchema.parse(req.body);
    const data = await service.register({
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      registrationNumber: body.registrationNumber,
      avatarFile: req.file,
    });
    res.status(201).json({ message: "Registered. OTP sent.", ...data });
  } catch (e) {
    next(e);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const body = verifySchema.parse(req.body);
    const data = await service.verifyEmail(body.email, body.otp);
    res.json({ message: "Email verified.", ...data });
  } catch (e) {
    next(e);
  }
}

export async function resendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const body = resendSchema.parse(req.body);
    const data = await service.resendEmailOtp(body.email);
    res.json({ message: "OTP resent.", ...data });
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.parse(req.body);
    const data = await service.login(body.email, body.password);
    res.json(data);
  } catch (e) {
    next(e);
  }
}


export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const body = forgotPasswordSchema.parse(req.body);
    await service.requestPasswordReset(body.email);
    res.json({
      message: "If this email is registered, a reset OTP has been sent.",
    });
  } catch (e) {
    next(e);
  }
}


export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const body = resetPasswordSchema.parse(req.body);
    await service.resetPassword(body.email, body.otp, body.newPassword);
    res.json({ message: "Password reset successful. You can login now." });
  } catch (e) {
    next(e);
  }
}
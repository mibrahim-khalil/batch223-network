import type { Request, Response, NextFunction } from "express";
import { updateMyProfileSchema } from "./profile.validation";
import * as service from "./profile.service";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    const profile = await service.getMyProfile(req.auth.userId);
    res.json(profile);
  } catch (e) {
    next(e);
  }
}

export async function patchMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    const patch = updateMyProfileSchema.parse(req.body);
    const profile = await service.updateMyProfile(req.auth.userId, patch);
    res.json(profile);
  } catch (e) {
    next(e);
  }
}
import type { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const totalUsers = await User.countDocuments({});
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    res.json({ totalUsers, verifiedUsers });
  } catch (e) {
    next(e);
  }
}
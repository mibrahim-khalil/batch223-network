import type { Request, Response, NextFunction } from "express";
import * as service from "./dashboard.service";

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getDashboardData();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
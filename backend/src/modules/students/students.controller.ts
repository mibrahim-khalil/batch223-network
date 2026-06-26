import type { Request, Response, NextFunction } from "express";
import * as service from "./students.service";

function toStr(v: unknown) {
  return typeof v === "string" ? v : "";
}

function toInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const pageSize = Math.min(50, Math.max(1, toInt(req.query.pageSize, 12)));

    const data = await service.listStudentsPaged({
      name: toStr(req.query.name),
      company: toStr(req.query.company),
      city: toStr(req.query.city),
      skill: toStr(req.query.skill),
      page,
      pageSize,
    });

    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getOne(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await service.getStudentPublicProfile(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
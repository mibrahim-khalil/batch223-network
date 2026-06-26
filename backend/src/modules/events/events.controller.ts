import type { Request, Response, NextFunction } from "express";
import { createSchema, listSchema, adminPatchSchema } from "./events.validation";
import * as service from "./events.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

    const q = listSchema.parse(req.query);
    const data = await service.listEvents({
      q: q.q,
      page: q.page ?? 1,
      pageSize: q.pageSize ?? 200,
      requesterEmail: req.auth.email,
      isAdmin: req.auth.role === "admin",
    });

    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getOne(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

    const data = await service.getEvent(req.params.id, {
      email: req.auth.email,
      isAdmin: req.auth.role === "admin",
    });

    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

    const body = createSchema.parse(req.body);

    const data = await service.createEvent({
      ...body,
      official: req.auth.role === "admin",
      status: req.auth.role === "admin" ? "published" : "pending",
      createdBy: req.auth.userId,
      authorEmail: req.auth.email,
    });

    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function adminPatch(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const patch = adminPatchSchema.parse(req.body);
    const data = await service.adminPatchEvent(req.params.id, patch);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function adminDelete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const data = await service.adminDeleteEvent(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
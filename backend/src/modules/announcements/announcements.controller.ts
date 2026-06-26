import type { Request, Response, NextFunction } from "express";
import { createSchema, listSchema, adminPatchSchema } from "./announcements.validation";
import * as service from "./announcements.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

    const q = listSchema.parse(req.query);
    const data = await service.listAnnouncements({
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

    const data = await service.getAnnouncement(req.params.id, {
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
    const data = await service.createAnnouncement({
      title: body.title,
      body: body.body,
      tag: body.tag,
      createdBy: req.auth.userId,
      authorEmail: req.auth.email,
      isAdmin: req.auth.role === "admin",
    });

    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function adminPatch(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const patch = adminPatchSchema.parse(req.body);
    const data = await service.adminPatchAnnouncement(req.params.id, patch);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function adminDelete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const data = await service.adminDeleteAnnouncement(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
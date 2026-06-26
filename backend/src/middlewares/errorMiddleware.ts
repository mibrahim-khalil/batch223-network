import type { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("❌ API ERROR:", err); // IMPORTANT

  const status = err?.statusCode ?? 500;
  const message =
    err?.message ||
    err?.error?.message ||
    "Server error";

  res.status(status).json({ message });
}
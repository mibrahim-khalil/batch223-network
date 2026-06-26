import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { authRateLimit } from "./middlewares/rateLimit";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";

import authRoutes from "./modules/auth/auth.routes";
import profileRoutes from "./modules/profile/profile.routes";
import studentsRoutes from "./modules/students/students.routes";
import uploadsRoutes from "./modules/uploads/uploads.routes";
import announcementsRoutes from "./modules/announcements/announcements.routes";

import { requireAuth } from "./middlewares/authMiddleware";

import jobsRoutes from "./modules/jobs/jobs.routes";
import eventsRoutes from "./modules/events/events.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import adminRoutes from "./modules/admin/admin.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true, name: "Batch223 API" }));

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ ok: true, auth: req.auth });
});

// routes
app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// 404 + error last
app.use(notFound);
app.use(errorHandler);
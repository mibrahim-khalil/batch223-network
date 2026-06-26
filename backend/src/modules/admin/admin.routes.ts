import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/authMiddleware";
import * as c from "./admin.controller";

const router = Router();

router.get("/stats", requireAuth, requireAdmin, c.getStats);

export default router;
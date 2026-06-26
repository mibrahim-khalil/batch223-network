import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import * as c from "./dashboard.controller";

const router = Router();

router.get("/", requireAuth, c.getDashboard);

export default router;
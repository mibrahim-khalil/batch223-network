import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import * as c from "./students.controller";

const router = Router();

// Directory (server-side search + paging)
router.get("/", requireAuth, c.list);

// Student profile
router.get("/:id", requireAuth, c.getOne);

export default router;
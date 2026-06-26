import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/authMiddleware";
import * as c from "./announcements.controller";

const router = Router();

router.get("/", requireAuth, c.list);
router.get("/:id", requireAuth, c.getOne);

router.post("/", requireAuth, c.create);

// admin moderation
router.patch("/:id", requireAuth, requireAdmin, c.adminPatch);
router.delete("/:id", requireAuth, requireAdmin, c.adminDelete);

export default router;
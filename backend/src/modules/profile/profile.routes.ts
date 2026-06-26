import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import * as c from "./profile.controller";

const router = Router();

router.get("/me", requireAuth, c.getMe);
router.patch("/me", requireAuth, c.patchMe);

export default router;
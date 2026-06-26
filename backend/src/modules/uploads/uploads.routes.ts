import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../middlewares/authMiddleware";
import * as c from "./uploads.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/avatar", requireAuth, upload.single("file"), c.uploadAvatar);
router.post("/cover", requireAuth, upload.single("file"), c.uploadCover);
router.post("/resume", requireAuth, upload.single("file"), c.uploadResume);

export default router;
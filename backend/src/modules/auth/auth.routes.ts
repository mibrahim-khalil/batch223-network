import { Router } from "express";
import multer from "multer";
import * as c from "./auth.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB avatar
});

router.post("/register", upload.single("avatar"), c.register);
router.post("/verify-email", c.verifyEmail);
router.post("/resend-otp", c.resendOtp);
router.post("/login", c.login);


router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);

export default router;
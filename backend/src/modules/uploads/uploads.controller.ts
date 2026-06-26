import type { Request, Response, NextFunction } from "express";
import { cloudinary } from "../../config/cloudinary";
import { User } from "../../models/User";

function cloudinaryErrToMessage(err: any) {
  return (
    err?.error?.message ||
    err?.message ||
    "Cloudinary upload failed"
  );
}

function uploadBufferToCloudinary(opts: {
  buffer: Buffer;
  folder?: string;                 // optional now
  resource_type: "image" | "raw";
  originalFilename?: string;
}) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        // IMPORTANT: do NOT set public_id + overwrite
        folder: opts.folder,
        resource_type: opts.resource_type,

        // keep filename, but make it unique to avoid collisions
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err || !result) {
          console.error("❌ Cloudinary error:", err);
          return reject(new Error(cloudinaryErrToMessage(err)));
        }
        resolve({ secure_url: result.secure_url });
      }
    );

    stream.end(opts.buffer);
  });
}

async function ensureUser(req: Request) {
  if (!req.auth) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(req.auth.userId);
  if (!user) {
    const err: any = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }

  return user;
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await ensureUser(req);

    const file = req.file;
    if (!file) return res.status(400).json({ message: "File is required" });
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Avatar must be an image" });
    }

    const out = await uploadBufferToCloudinary({
      buffer: file.buffer,
     folder: undefined,     // keep folder; if still 403 we’ll remove it
      resource_type: "image",
      originalFilename: file.originalname,
    });

    user.avatarUrl = out.secure_url;
    user.avatarFileName = file.originalname;
    await user.save();

    res.json({ url: out.secure_url });
  } catch (e) {
    next(e);
  }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await ensureUser(req);

    const file = req.file;
    if (!file) return res.status(400).json({ message: "File is required" });
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Cover must be an image" });
    }

    const out = await uploadBufferToCloudinary({
      buffer: file.buffer,
      folder: `batch223/${user._id}`,
      resource_type: "image",
      originalFilename: file.originalname,
    });

    user.coverUrl = out.secure_url;
    user.coverFileName = file.originalname;
    await user.save();

    res.json({ url: out.secure_url });
  } catch (e) {
    next(e);
  }
}

export async function uploadResume(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await ensureUser(req);

    const file = req.file;
    if (!file) return res.status(400).json({ message: "File is required" });
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Resume must be a PDF" });
    }

    const out = await uploadBufferToCloudinary({
      buffer: file.buffer,
      folder: `batch223/${user._id}`,
      resource_type: "raw",
      originalFilename: file.originalname,
    });

    user.resumeUrl = out.secure_url;
    user.resumeFileName = file.originalname;
    await user.save();

    res.json({ url: out.secure_url });
  } catch (e) {
    next(e);
  }
}
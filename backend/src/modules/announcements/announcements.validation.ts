import { z } from "zod";

export const listSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export const createSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(1),
  tag: z.enum(["Announcement", "Update", "Job", "Event"]).optional().default("Update"),
});

export const adminPatchSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    body: z.string().min(1).optional(),
    tag: z.enum(["Announcement", "Update", "Job", "Event"]).optional(),

    pinned: z.boolean().optional(),
    official: z.boolean().optional(),
    status: z.enum(["published", "pending", "rejected"]).optional(),
  })
  .strict();
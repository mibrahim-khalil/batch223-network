import { z } from "zod";

export const listSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export const createSchema = z.object({
  title: z.string().min(3).max(200),
  type: z.enum(["Meetup", "Workshop", "Webinar", "Sports", "Reunion"]),
  cityCountry: z.string().min(2).max(120),
  venue: z.string().min(2).max(200),
  date: z.string().min(4),
  time: z.string().min(1).max(50),
  description: z.string().min(1),
});

export const adminPatchSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    type: z.enum(["Meetup", "Workshop", "Webinar", "Sports", "Reunion"]).optional(),
    cityCountry: z.string().min(2).max(120).optional(),
    venue: z.string().min(2).max(200).optional(),
    date: z.string().min(4).optional(),
    time: z.string().min(1).max(50).optional(),
    description: z.string().min(1).optional(),

    official: z.boolean().optional(),
    status: z.enum(["published", "pending", "rejected"]).optional(),
  })
  .strict();
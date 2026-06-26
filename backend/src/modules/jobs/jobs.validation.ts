import { z } from "zod";

export const listSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export const createSchema = z.object({
  title: z.string().min(3).max(200),
  company: z.string().min(2).max(200),
  cityCountry: z.string().min(2).max(120),
  type: z.enum(["Job", "Internship"]),
  skills: z.array(z.string()).max(20).optional().default([]),
  link: z.string().optional().default(""),
  body: z.string().min(1),
  open: z.boolean().optional().default(true),
});

export const adminPatchSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    company: z.string().min(2).max(200).optional(),
    cityCountry: z.string().min(2).max(120).optional(),
    type: z.enum(["Job", "Internship"]).optional(),
    skills: z.array(z.string()).max(20).optional(),
    link: z.string().optional(),
    body: z.string().min(1).optional(),
    open: z.boolean().optional(),
    official: z.boolean().optional(),
    status: z.enum(["published", "pending", "rejected"]).optional(),
  })
  .strict();
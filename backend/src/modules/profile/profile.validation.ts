import { z } from "zod";

const expSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional().default(""),
  company: z.string().optional().default(""),
  employmentType: z.string().optional().default(""),
  location: z.string().optional().default(""),

  startMonth: z.string().optional().default(""),
  startYear: z.string().optional().default(""),
  endMonth: z.string().optional().default(""),
  endYear: z.string().optional().default(""),

  current: z.boolean().optional().default(true),
  description: z.string().optional().default(""),
});

const eduSchema = z.object({
  id: z.string().min(1),
  level: z.enum(["Matric", "Intermediate", "University", "Current"]),
  institutionName: z.string().optional().default(""),
  degreeField: z.string().optional().default(""),

  passingMonth: z.string().optional().default(""),
  passingYear: z.string().optional().default(""),

  description: z.string().optional().default(""),
});

export const updateMyProfileSchema = z
  .object({
    fullName: z.string().optional(),
    headline: z.string().optional(),
    cityCountry: z.string().optional(),
    about: z.string().optional(),

    openToWork: z.boolean().optional(),
    freelancer: z.boolean().optional(),
    entrepreneur: z.boolean().optional(),

    phone: z.string().optional(),

    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    fiverr: z.string().optional(),
    upwork: z.string().optional(),

    skills: z.array(z.string()).max(30).optional(),

    experiences: z.array(expSchema).max(50).optional(),
    education: z.array(eduSchema).max(50).optional(),

    avatarFileName: z.string().optional(),
    coverFileName: z.string().optional(),
    resumeFileName: z.string().optional(),

    avatarUrl: z.string().optional(),
    coverUrl: z.string().optional(),
    resumeUrl: z.string().optional(),

    // locked
    email: z.never().optional(),
  })
  .strict();
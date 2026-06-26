import { mockStudents } from "./mockStudents";

export type PublicExperienceItem = {
  title: string;
  company: string;
  employmentType: string;
  start: string;
  end: string; // "Present" allowed
  location?: string;
  description?: string;
};

export type PublicEducationItem = {
  level: "Matric" | "Intermediate" | "University" | "Current";
  institutionName: string;
  degreeField: string;
  passingYear?: string;
  description?: string;
};

export type StudentPublicProfile = {
  id: string;
  fullName: string;
  position: string;
  company: string;
  cityCountry: string;
  avatarUrl: string;
  coverUrl: string;

  openToWork?: boolean;

  about: string;

  email?: string;
  phone?: string;

  linkedin?: string;
  github?: string;
  portfolio?: string;

  skills: string[];

  experiences: PublicExperienceItem[];
  education: PublicEducationItem[];
};

export const mockStudentProfiles: Record<string, Partial<StudentPublicProfile>> = {
  "223-182": {
    coverUrl:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1800&auto=format&fit=crop",
    about:
      "Batch223 alumnus. Building high-performance web apps with React + Node. Interested in startups, clean systems, and mentoring juniors.",
    linkedin: "https://linkedin.com/in/awais-khan",
    github: "https://github.com/awaiskhan",
    portfolio: "https://awais.dev",
    experiences: [
      {
        title: "Senior Full Stack Developer",
        company: "TechNexus",
        employmentType: "Full-time",
        start: "2023",
        end: "Present",
        location: "Islamabad, Pakistan",
        description:
          "Leading frontend architecture, building dashboards, auth flows, and performance improvements.",
      },
      {
        title: "Junior Developer",
        company: "Company Name",
        employmentType: "Internship",
        start: "2022",
        end: "2023",
        location: "Islamabad, Pakistan",
        description:
          "Worked on internal tools and learned production workflows with a senior team.",
      },
    ],
    education: [
      {
        level: "University",
        institutionName: "CUST",
        degreeField: "BS Software Engineering",
        passingYear: "2023",
      },
    ],
  },

  "223-091": {
    coverUrl:
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?q=80&w=1800&auto=format&fit=crop",
    about:
      "Product designer focused on minimal UI systems and strong typography. Loves design systems, prototyping, and clean component libraries.",
    linkedin: "https://linkedin.com/in/fatima-noor",
    portfolio: "https://fatima.design",
    experiences: [
      {
        title: "Product Designer",
        company: "Studio",
        employmentType: "Full-time",
        start: "2023",
        end: "Present",
        description: "Designing SaaS dashboards and product experiences.",
      },
    ],
    education: [
      {
        level: "University",
        institutionName: "CUST",
        degreeField: "BS Software Engineering",
        passingYear: "2023",
      },
    ],
  },
};

export function getStudentPublicProfile(id: string): StudentPublicProfile | null {
  const base = mockStudents.find((s) => s.id === id);
  const extra = mockStudentProfiles[id];

  if (!base && !extra) return null;

  // fallback defaults if not in extra map
  const fallbackCover =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1800&auto=format&fit=crop";

  return {
    id,
    fullName: base?.fullName ?? extra?.fullName ?? "Batch223 Student",
    position: base?.position ?? extra?.position ?? "Student",
    company: base?.company ?? extra?.company ?? "CUST",
    cityCountry: base?.cityCountry ?? extra?.cityCountry ?? "Pakistan",
    avatarUrl: base?.avatarUrl ?? extra?.avatarUrl ?? fallbackCover,
    coverUrl: extra?.coverUrl ?? fallbackCover,

    openToWork: base?.openToWork ?? extra?.openToWork ?? false,

    about:
      extra?.about ??
      "This student profile is private to Batch223. More details will appear once the profile is completed.",

    email: extra?.email,
    phone: extra?.phone,

    linkedin: extra?.linkedin,
    github: extra?.github,
    portfolio: extra?.portfolio,

    skills: (extra?.skills ?? base?.skills ?? []).slice(0, 30),

    experiences: extra?.experiences ?? [],
    education: extra?.education ?? [],
  };
}
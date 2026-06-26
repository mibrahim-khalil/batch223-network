export type JobType = "Job" | "Internship";

export type JobPost = {
  id: string;
  title: string;
  company: string;
  cityCountry: string;
  type: JobType;
  skills: string[];
  postedAt: string; // yyyy-mm-dd
  link?: string;
  body: string;
};

export const mockJobs: JobPost[] = [
  {
    id: "j-1",
    title: "Frontend Engineer (React)",
    company: "TechNexus",
    cityCountry: "Islamabad, Pakistan",
    type: "Job",
    skills: ["React", "TypeScript", "Tailwind"],
    postedAt: "2026-06-09",
    link: "https://example.com/job/frontend",
    body: "Batch223 referral available. Looking for strong UI fundamentals, clean component architecture, and performance mindset.",
  },
  {
    id: "j-2",
    title: "Backend Engineer (Node.js)",
    company: "FinTech Co",
    cityCountry: "Karachi, Pakistan",
    type: "Job",
    skills: ["Node.js", "Express", "MongoDB"],
    postedAt: "2026-06-08",
    link: "https://example.com/job/backend",
    body: "Build secure APIs and scalable services. Experience with JWT, caching, and database indexing is a plus.",
  },
  {
    id: "j-3",
    title: "UI/UX Designer Intern",
    company: "Studio",
    cityCountry: "Lahore, Pakistan",
    type: "Internship",
    skills: ["Figma", "UI/UX", "Design Systems"],
    postedAt: "2026-06-06",
    link: "https://example.com/job/design-intern",
    body: "Internship for Batch223 students. Work on dashboards, typography, spacing, and component polish.",
  },
  {
    id: "j-4",
    title: "Data Analyst Intern",
    company: "Analytics Lab",
    cityCountry: "Islamabad, Pakistan",
    type: "Internship",
    skills: ["SQL", "Power BI", "Python"],
    postedAt: "2026-06-05",
    body: "Assist in dashboarding and reporting. Good communication and strong basics required.",
  },
];
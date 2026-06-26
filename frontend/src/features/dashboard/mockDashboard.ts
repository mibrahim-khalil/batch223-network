export type FeaturedAlumni = {
  id: string; // student id
  fullName: string;
  headline: string;
  cityCountry: string;
  avatarUrl: string;
  coverUrl?: string;
};

export type RecentlyUpdated = {
  id: string;
  fullName: string;
  position: string;
  company: string;
  cityCountry: string;
  avatarUrl: string;
  skills: string[];
  updatedAt: string;
};

export const featuredAlumni: FeaturedAlumni[] = [
  {
    id: "223-182",
    fullName: "Awais Khan",
    headline: "Senior Full Stack Developer @ TechNexus",
    cityCountry: "Islamabad, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1520975958225-3f61d1aa7c4b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "223-144",
    fullName: "Hamza Ali",
    headline: "Backend Engineer @ FinTech Co",
    cityCountry: "Karachi, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "223-091",
    fullName: "Fatima Noor",
    headline: "Product Designer @ Studio",
    cityCountry: "Lahore, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  },
];

export const recentlyUpdated: RecentlyUpdated[] = [
  {
    id: "223-203",
    fullName: "Hira Ahmed",
    position: "Data Analyst",
    company: "Analytics Lab",
    cityCountry: "Islamabad, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=600&auto=format&fit=crop",
    skills: ["SQL", "Power BI", "Python"],
    updatedAt: "2026-06-09",
  },
  {
    id: "223-118",
    fullName: "Usman Tariq",
    position: "Mobile Developer",
    company: "AppWorks",
    cityCountry: "Rawalpindi, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop",
    skills: ["Flutter", "Firebase", "Dart"],
    updatedAt: "2026-06-08",
  },
  {
    id: "223-166",
    fullName: "Maham Raza",
    position: "QA Engineer",
    company: "SaaS Team",
    cityCountry: "Peshawar, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=600&auto=format&fit=crop",
    skills: ["Selenium", "Automation", "QA"],
    updatedAt: "2026-06-07",
  },
    {
    id: "223-166",
    fullName: "Maham Raza",
    position: "QA Engineer",
    company: "SaaS Team",
    cityCountry: "Peshawar, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=600&auto=format&fit=crop",
    skills: ["Selenium", "Automation", "QA"],
    updatedAt: "2026-06-07",
  },
];
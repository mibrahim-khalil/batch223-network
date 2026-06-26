export type StudentCardModel = {
  id: string;
  fullName: string;

  //  add (Rank/Reg No)
  registrationNumber: string; // e.g. "BSE223182"

  position: string;
  company: string;
  cityCountry: string;
  avatarUrl: string;
  openToWork?: boolean;
  skills: string[];
};

export const mockStudents: StudentCardModel[] = [
  {
    id: "223-182",
    fullName: "Awais Khan",
    registrationNumber: "BSE223182",
    position: "Senior Full Stack Developer",
    company: "TechNexus",
    cityCountry: "Islamabad, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    openToWork: true,
    skills: ["React", "TypeScript", "Node.js", "MongoDB"],
  },
  {
    id: "223-091",
    fullName: "Fatima Noor",
    registrationNumber: "BSE223091",
    position: "Product Designer",
    company: "Studio",
    cityCountry: "Lahore, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    skills: ["Figma", "UI/UX", "Design Systems"],
  },
  {
    id: "223-144",
    fullName: "Hamza Ali",
    registrationNumber: "BSE223144",
    position: "Backend Engineer",
    company: "FinTech Co",
    cityCountry: "Karachi, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    skills: ["Node.js", "Express", "MongoDB", "Redis"],
  },
  {
    id: "223-203",
    fullName: "Hira Ahmed",
    registrationNumber: "BSE223203",
    position: "Data Analyst",
    company: "Analytics Lab",
    cityCountry: "Islamabad, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=600&auto=format&fit=crop",
    openToWork: true,
    skills: ["Power BI", "SQL", "Python"],
  },
  {
    id: "223-118",
    fullName: "Usman Tariq",
    registrationNumber: "BSE223118",
    position: "Mobile Developer",
    company: "AppWorks",
    cityCountry: "Rawalpindi, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop",
    skills: ["Flutter", "Dart", "Firebase"],
  },
  {
    id: "223-166",
    fullName: "Maham Raza",
    registrationNumber: "BSE223166",
    position: "QA Engineer",
    company: "SaaS Team",
    cityCountry: "Peshawar, Pakistan",
    avatarUrl:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=600&auto=format&fit=crop",
    skills: ["QA", "Selenium", "Automation"],
  },
];
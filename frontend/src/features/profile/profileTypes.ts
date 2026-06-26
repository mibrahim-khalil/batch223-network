export type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
};

export type EducationLevel = "Matric" | "Intermediate" | "University" | "Current";

export type EducationItem = {
  id: string;
  level: EducationLevel;
  institutionName: string;
  degreeField: string;
  passingMonth: string;
  passingYear: string;
  description: string;
};

export type Profile = {
 
  registrationNumber: string;

  fullName: string;
  headline: string;
  cityCountry: string;
  about: string;

  openToWork: boolean;
  freelancer: boolean;
  entrepreneur: boolean;

  phone: string;
  email: string;

  linkedin: string;
  github: string;
  portfolio: string;
  fiverr: string;
  upwork: string;

  skills: string[];

  experiences: ExperienceItem[];
  education: EducationItem[];

  avatarFileName: string;
  coverFileName: string;
  resumeFileName: string;

  avatarUrl: string;
  coverUrl: string;
  resumeUrl: string;
};

export const defaultProfile: Profile = {

  registrationNumber: "",

  fullName: "Your Name",
  headline: "Your Role @ Company",
  cityCountry: "City, Country",
  about: "",

  openToWork: true,
  freelancer: false,
  entrepreneur: false,

  phone: "",
  email: "bse223000@cust.pk",

  linkedin: "",
  github: "",
  portfolio: "",
  fiverr: "",
  upwork: "",

  skills: ["React", "TypeScript", "Node.js"],

  experiences: [],
  education: [],

  avatarFileName: "",
  coverFileName: "",
  resumeFileName: "",

  avatarUrl: "",
  coverUrl: "",
  resumeUrl: "",
};
export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // ISO or simple string
  tag?: "Announcement" | "Job" | "Event" | "Update";
  pinned?: boolean;
};

export const mockAnnouncements: Announcement[] = [
  {
    id: "a-1",
    title: "Welcome to Batch223 Network",
    body: "This is our private alumni space. Complete your profile, add your experience and education, and connect with batchmates in the Directory.",
    date: "2026-06-09",
    tag: "Announcement",
    pinned: true,
  },
  {
    id: "a-2",
    title: "Profile Setup Reminder",
    body: "Your profile helps batchmates find you: add city, company, skills, and your resume (PDF) if available.",
    date: "2026-06-08",
    tag: "Update",
  },
  {
    id: "a-3",
    title: "Job & Internship Sharing",
    body: "Starting next, we’ll add a Job board. You’ll be able to post opportunities for Batch223 only.",
    date: "2026-06-07",
    tag: "Job",
  },
]; 
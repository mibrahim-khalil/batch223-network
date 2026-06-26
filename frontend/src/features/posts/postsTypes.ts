export type ModerationStatus = "pending" | "published" | "rejected";

export type CommunityAnnouncement = {
  id: string;
  title: string;
  body: string;
  tag: "Announcement" | "Update";
  createdAt: string;
  authorEmail: string;
  status: ModerationStatus;
  pinned?: boolean;     // admin only
  official?: boolean;   // admin only
};

export type JobPostX = {
  id: string;
  title: string;
  company: string;
  cityCountry: string;
  type: "Job" | "Internship";
  skills: string[];
  postedAt: string;
  link?: string;
  body: string;

  authorEmail: string;
  status: ModerationStatus;
  open: boolean;
};

export type EventPostX = {
  id: string;
  title: string;
  type: "Meetup" | "Workshop" | "Webinar" | "Sports" | "Reunion";
  cityCountry: string;
  venue: string;
  date: string;
  time: string;
  description: string;

  authorEmail: string;
  status: ModerationStatus;
};
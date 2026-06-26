export type EventType = "Meetup" | "Workshop" | "Webinar" | "Sports" | "Reunion";

export type EventPost = {
  id: string;
  title: string;
  type: EventType;
  cityCountry: string;
  venue: string;
  date: string; // yyyy-mm-dd
  time: string; // 6:00 PM
  description: string;
};

export const mockEvents: EventPost[] = [
  {
    id: "e-1",
    title: "Batch223 Reunion Meetup",
    type: "Reunion",
    cityCountry: "Islamabad, Pakistan",
    venue: "CUST Campus",
    date: "2026-07-05",
    time: "5:30 PM",
    description:
      "A private Batch223 meetup to reconnect and catch up. Bring memories, bring energy.",
  },
  {
    id: "e-2",
    title: "Resume + LinkedIn Workshop",
    type: "Workshop",
    cityCountry: "Online",
    venue: "Google Meet",
    date: "2026-06-20",
    time: "8:00 PM",
    description:
      "Improve your LinkedIn and resume. Alumni sharing real advice and templates.",
  },
  {
    id: "e-3",
    title: "Tech Talk: Building Production APIs",
    type: "Webinar",
    cityCountry: "Online",
    venue: "Zoom",
    date: "2026-06-28",
    time: "9:00 PM",
    description:
      "JWT auth, validation, security basics, and clean architecture patterns in Node.js.",
  },
  {
    id: "e-4",
    title: "Weekend Football Match",
    type: "Sports",
    cityCountry: "Rawalpindi, Pakistan",
    venue: "Local Ground",
    date: "2026-06-16",
    time: "6:00 PM",
    description:
      "Friendly match. Everyone welcome. We’ll make teams on the spot.",
  },
];
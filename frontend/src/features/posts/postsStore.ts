import type {
  CommunityAnnouncement,
  EventPostX,
  JobPostX,
  ModerationStatus,
} from "./postsTypes";
import { mockAnnouncements } from "../announcements/mockAnnouncements";
import { mockJobs } from "../jobs/mockJobs";
import { mockEvents } from "../events/mockEvents";

const KEY_A = "batch223_posts_announcements_v1";
const KEY_J = "batch223_posts_jobs_v1";
const KEY_E = "batch223_posts_events_v1";

function nowISO() {
  return new Date().toISOString().slice(0, 10);
}

function rid(prefix: string) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${id}`;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeededPosts() {
  // Announcements seed (official, published)
  const a = localStorage.getItem(KEY_A);
  if (!a) {
    const seeded: CommunityAnnouncement[] = mockAnnouncements.map((x) => ({
      id: x.id,
      title: x.title,
      body: x.body,
      tag: x.tag === "Update" ? "Update" : "Announcement",
      createdAt: x.date,
      authorEmail: "admin@cust.pk",
      status: "published",
      pinned: Boolean(x.pinned),
      official: true,
    }));
    save(KEY_A, seeded);
  }

  // Jobs seed (published)
  const j = localStorage.getItem(KEY_J);
  if (!j) {
    const seeded: JobPostX[] = mockJobs.map((x) => ({
      ...x,
      authorEmail: "admin@cust.pk",
      status: "published",
      open: true,
    }));
    save(KEY_J, seeded);
  }

  // Events seed (published)
  const e = localStorage.getItem(KEY_E);
  if (!e) {
    const seeded: EventPostX[] = mockEvents.map((x) => ({
      ...x,
      authorEmail: "admin@cust.pk",
      status: "published",
    }));
    save(KEY_E, seeded);
  }
}

/* ---------------- Announcements ---------------- */
export function listAnnouncements(status?: ModerationStatus) {
  ensureSeededPosts();
  const all = load<CommunityAnnouncement[]>(KEY_A, []);
  return status ? all.filter((x) => x.status === status) : all;
}

export function getAnnouncement(id: string) {
  ensureSeededPosts();
  const all = load<CommunityAnnouncement[]>(KEY_A, []);
  return all.find((x) => x.id === id) ?? null;
}

export function createAnnouncement(input: {
  title: string;
  body: string;
  tag: "Announcement" | "Update";
  authorEmail: string;
  isAdmin: boolean;
}) {
  ensureSeededPosts();
  const all = load<CommunityAnnouncement[]>(KEY_A, []);
  const post: CommunityAnnouncement = {
    id: rid("a"),
    title: input.title.trim(),
    body: input.body.trim(),
    tag: input.tag,
    createdAt: nowISO(),
    authorEmail: input.authorEmail,
    status: input.isAdmin ? "published" : "pending",
    official: input.isAdmin ? true : false,
    pinned: false,
  };
  save(KEY_A, [post, ...all]);
  return post;
}

export function setAnnouncementStatus(id: string, status: ModerationStatus) {
  const all = load<CommunityAnnouncement[]>(KEY_A, []);
  save(
    KEY_A,
    all.map((x) => (x.id === id ? { ...x, status } : x))
  );
}

export function togglePinAnnouncement(id: string) {
  const all = load<CommunityAnnouncement[]>(KEY_A, []);
  save(
    KEY_A,
    all.map((x) =>
      x.id === id ? { ...x, pinned: !x.pinned, official: true } : x
    )
  );
}

export function deleteAnnouncement(id: string) {
  const all = load<CommunityAnnouncement[]>(KEY_A, []);
  save(KEY_A, all.filter((x) => x.id !== id));
}

/* ---------------- Jobs ---------------- */
export function listJobs(status?: ModerationStatus) {
  ensureSeededPosts();
  const all = load<JobPostX[]>(KEY_J, []);
  return status ? all.filter((x) => x.status === status) : all;
}

export function getJob(id: string) {
  ensureSeededPosts();
  const all = load<JobPostX[]>(KEY_J, []);
  return all.find((x) => x.id === id) ?? null;
}

export function createJob(
  input: Omit<JobPostX, "id" | "postedAt" | "status"> & { isAdmin: boolean }
) {
  ensureSeededPosts();
  const all = load<JobPostX[]>(KEY_J, []);
  const post: JobPostX = {
    ...input,
    id: rid("j"),
    postedAt: nowISO(),
    status: input.isAdmin ? "published" : "pending",
  };
  save(KEY_J, [post, ...all]);
  return post;
}

export function setJobStatus(id: string, status: ModerationStatus) {
  const all = load<JobPostX[]>(KEY_J, []);
  save(KEY_J, all.map((x) => (x.id === id ? { ...x, status } : x)));
}

export function deleteJob(id: string) {
  const all = load<JobPostX[]>(KEY_J, []);
  save(KEY_J, all.filter((x) => x.id !== id));
}

/* ---------------- Events ---------------- */
export function listEvents(status?: ModerationStatus) {
  ensureSeededPosts();
  const all = load<EventPostX[]>(KEY_E, []);
  return status ? all.filter((x) => x.status === status) : all;
}

export function getEvent(id: string) {
  ensureSeededPosts();
  const all = load<EventPostX[]>(KEY_E, []);
  return all.find((x) => x.id === id) ?? null;
}

export function createEvent(
  input: Omit<EventPostX, "id" | "status"> & { isAdmin: boolean }
) {
  ensureSeededPosts();
  const all = load<EventPostX[]>(KEY_E, []);
  const post: EventPostX = {
    ...input,
    id: rid("e"),
    status: input.isAdmin ? "published" : "pending",
  };
  save(KEY_E, [post, ...all]);
  return post;
}

export function setEventStatus(id: string, status: ModerationStatus) {
  const all = load<EventPostX[]>(KEY_E, []);
  save(KEY_E, all.map((x) => (x.id === id ? { ...x, status } : x)));
}

export function deleteEvent(id: string) {
  const all = load<EventPostX[]>(KEY_E, []);
  save(KEY_E, all.filter((x) => x.id !== id));
}
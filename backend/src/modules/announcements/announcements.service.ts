import { Announcement } from "../../models/Announcement";

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toDto(a: any) {
  return {
    id: String(a._id),
    title: a.title,
    body: a.body,
    tag: a.tag,
    pinned: Boolean(a.pinned),
    official: Boolean(a.official),
    status: a.status,
    authorEmail: a.authorEmail,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export async function listAnnouncements(opts: {
  q?: string;
  page: number;
  pageSize: number;
  requesterEmail: string;
  isAdmin: boolean;
}) {
  const filter: any = {};

  // Visibility:
  // - admin sees all
  // - student sees published + their own pending/rejected
  if (!opts.isAdmin) {
    filter.$or = [
      { status: "published" },
      { status: "pending", authorEmail: opts.requesterEmail },
      { status: "rejected", authorEmail: opts.requesterEmail },
    ];
  }

  if (opts.q?.trim()) {
    const r = new RegExp(escapeRegex(opts.q.trim()), "i");
    filter.$and = filter.$and ?? [];
    filter.$and.push({ $or: [{ title: r }, { body: r }, { tag: r }] });
  }

  const total = await Announcement.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / opts.pageSize));
  const page = Math.min(Math.max(1, opts.page), totalPages);
  const skip = (page - 1) * opts.pageSize;

  const items = await Announcement.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(opts.pageSize)
    .lean();

  return { items: items.map(toDto), total, page, pageSize: opts.pageSize, totalPages };
}

export async function getAnnouncement(
  id: string,
  requester: { email: string; isAdmin: boolean }
) {
  const a: any = await Announcement.findById(id).lean();
  if (!a) {
    const err: any = new Error("Announcement not found.");
    err.statusCode = 404;
    throw err;
  }

  const canView =
    a.status === "published" ||
    requester.isAdmin ||
    ((a.status === "pending" || a.status === "rejected") &&
      a.authorEmail === requester.email);

  if (!canView) {
    const err: any = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return toDto(a);
}

export async function createAnnouncement(input: {
  title: string;
  body: string;
  tag: string;
  createdBy: string;
  authorEmail: string;
  isAdmin: boolean;
}) {
  const doc = await Announcement.create({
    title: input.title,
    body: input.body,
    tag: input.tag,

    pinned: false,
    official: input.isAdmin,
    status: input.isAdmin ? "published" : "pending",

    createdBy: input.createdBy,
    authorEmail: input.authorEmail,
  });

  return toDto(doc.toObject());
}

export async function adminPatchAnnouncement(id: string, patch: any) {
  const a: any = await Announcement.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!a) {
    const err: any = new Error("Announcement not found.");
    err.statusCode = 404;
    throw err;
  }
  return toDto(a);
}

export async function adminDeleteAnnouncement(id: string) {
  const a = await Announcement.findByIdAndDelete(id).lean();
  if (!a) {
    const err: any = new Error("Announcement not found.");
    err.statusCode = 404;
    throw err;
  }
  return { ok: true };
}
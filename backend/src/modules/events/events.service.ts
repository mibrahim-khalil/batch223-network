import { Event } from "../../models/Event";

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toDto(e: any) {
  return {
    id: String(e._id),
    title: e.title,
    type: e.type,
    cityCountry: e.cityCountry,
    venue: e.venue,
    date: e.date,
    time: e.time,
    description: e.description,

    status: e.status,
    official: Boolean(e.official),
    authorEmail: e.authorEmail,

    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

export async function listEvents(opts: {
  q?: string;
  page: number;
  pageSize: number;
  requesterEmail: string;
  isAdmin: boolean;
}) {
  const filter: any = {};

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
    filter.$and.push({
      $or: [{ title: r }, { venue: r }, { cityCountry: r }, { description: r }, { type: r }],
    });
  }

  const total = await Event.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / opts.pageSize));
  const page = Math.min(Math.max(1, opts.page), totalPages);
  const skip = (page - 1) * opts.pageSize;

  const items = await Event.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(opts.pageSize)
    .lean();

  return { items: items.map(toDto), total, page, pageSize: opts.pageSize, totalPages };
}

export async function getEvent(id: string, requester: { email: string; isAdmin: boolean }) {
  const e: any = await Event.findById(id).lean();
  if (!e) {
    const err: any = new Error("Event not found.");
    err.statusCode = 404;
    throw err;
  }

  const canView =
    e.status === "published" ||
    requester.isAdmin ||
    ((e.status === "pending" || e.status === "rejected") && e.authorEmail === requester.email);

  if (!canView) {
    const err: any = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return toDto(e);
}

export async function createEvent(input: any) {
  const doc = await Event.create(input);
  return toDto(doc.toObject());
}

export async function adminPatchEvent(id: string, patch: any) {
  const e: any = await Event.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!e) {
    const err: any = new Error("Event not found.");
    err.statusCode = 404;
    throw err;
  }
  return toDto(e);
}

export async function adminDeleteEvent(id: string) {
  const e = await Event.findByIdAndDelete(id).lean();
  if (!e) {
    const err: any = new Error("Event not found.");
    err.statusCode = 404;
    throw err;
  }
  return { ok: true };
}
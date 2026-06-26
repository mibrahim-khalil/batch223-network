import { Job } from "../../models/Job";

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function postedAtFromCreatedAt(createdAt: any) {
  try {
    return new Date(createdAt).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function toDto(j: any) {
  return {
    id: String(j._id),
    title: j.title,
    company: j.company,
    cityCountry: j.cityCountry,
    type: j.type,
    skills: Array.isArray(j.skills) ? j.skills : [],
    link: j.link || undefined,
    body: j.body,
    open: Boolean(j.open),

    status: j.status,
    official: Boolean(j.official),
    authorEmail: j.authorEmail,

    postedAt: postedAtFromCreatedAt(j.createdAt),
    createdAt: j.createdAt,
    updatedAt: j.updatedAt,
  };
}

export async function listJobs(opts: {
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
      $or: [{ title: r }, { company: r }, { cityCountry: r }, { body: r }, { skills: r }],
    });
  }

  const total = await Job.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / opts.pageSize));
  const page = Math.min(Math.max(1, opts.page), totalPages);
  const skip = (page - 1) * opts.pageSize;

  const items = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(opts.pageSize)
    .lean();

  return { items: items.map(toDto), total, page, pageSize: opts.pageSize, totalPages };
}

export async function getJob(id: string, requester: { email: string; isAdmin: boolean }) {
  const j: any = await Job.findById(id).lean();
  if (!j) {
    const err: any = new Error("Job not found.");
    err.statusCode = 404;
    throw err;
  }

  const canView =
    j.status === "published" ||
    requester.isAdmin ||
    ((j.status === "pending" || j.status === "rejected") && j.authorEmail === requester.email);

  if (!canView) {
    const err: any = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return toDto(j);
}

export async function createJob(input: any) {
  const doc = await Job.create(input);
  return toDto(doc.toObject());
}

export async function adminPatchJob(id: string, patch: any) {
  const j: any = await Job.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!j) {
    const err: any = new Error("Job not found.");
    err.statusCode = 404;
    throw err;
  }
  return toDto(j);
}

export async function adminDeleteJob(id: string) {
  const j = await Job.findByIdAndDelete(id).lean();
  if (!j) {
    const err: any = new Error("Job not found.");
    err.statusCode = 404;
    throw err;
  }
  return { ok: true };
}
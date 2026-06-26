import { User } from "../../models/User";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600&auto=format&fit=crop";

function avatarFromSeed(seed: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

function splitHeadline(headlineRaw: string | undefined) {
  const headline = (headlineRaw ?? "").trim();
  if (!headline) return { position: "", company: "" };

  const parts = headline.split("@");
  if (parts.length >= 2) {
    const position = parts[0].trim();
    const company = parts.slice(1).join("@").trim();
    return { position, company };
  }
  return { position: headline, company: "" };
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function re(q: string) {
  return { $regex: escapeRegex(q.trim()), $options: "i" as const };
}

export type ListStudentsQuery = {
  name?: string;
  company?: string;
  city?: string;
  skill?: string;
  page: number;
  pageSize: number;
};

export async function listStudentsPaged(q: ListStudentsQuery) {
  const and: any[] = [{ emailVerified: true }];

  if (q.name?.trim()) and.push({ fullName: re(q.name) });
  if (q.company?.trim()) and.push({ headline: re(q.company) });
  if (q.city?.trim()) and.push({ cityCountry: re(q.city) });

  if (q.skill?.trim()) {
    const rr = re(q.skill);
    and.push({
      $or: [{ skills: { $elemMatch: rr } }, { headline: rr }],
    });
  }

  const filter = and.length === 1 ? and[0] : { $and: and };

  const total = await User.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / q.pageSize));
  const page = Math.min(Math.max(1, q.page), totalPages);
  const skip = (page - 1) * q.pageSize;

  const users = await User.find(filter)
    .select("fullName registrationNumber headline cityCountry skills openToWork email avatarUrl coverUrl")
    .sort({ fullName: 1 })
    .skip(skip)
    .limit(q.pageSize)
    .lean();

  const items = users.map((u: any) => {
    const { position, company } = splitHeadline(u.headline);

    return {
      id: String(u._id),
      fullName: u.fullName ?? "Batch 223",
      registrationNumber: u.registrationNumber ?? "",

      position: position || "Student",
      company: company || "—",
      cityCountry: u.cityCountry ?? "—",
      avatarUrl:
        (u.avatarUrl && String(u.avatarUrl).trim()) ||
        avatarFromSeed(u.fullName || u.email || String(u._id)),
      openToWork: Boolean(u.openToWork),
      skills: Array.isArray(u.skills) ? u.skills : [],
    };
  });

  return { items, page, pageSize: q.pageSize, total, totalPages };
}

export async function getStudentPublicProfile(studentId: string) {
  const u: any = await User.findById(studentId)
    .select(
      [
        "emailVerified",
        "registrationNumber",
        "fullName",
        "headline",
        "cityCountry",
        "about",
        "openToWork",
        "skills",
        "experiences",
        "education",
        "linkedin",
        "github",
        "portfolio",
        "email",
        "avatarUrl",
        "coverUrl",
      ].join(" ")
    )
    .lean();

  if (!u || !u.emailVerified) {
    const err: any = new Error("Student profile not found.");
    err.statusCode = 404;
    throw err;
  }

  const { position, company } = splitHeadline(u.headline);

  return {
    id: String(u._id),
    fullName: u.fullName ?? "Batch 223",

    registrationNumber: u.registrationNumber ?? "",

    position: position || "Student",
    company: company || "—",
    cityCountry: u.cityCountry ?? "—",
    avatarUrl:
      (u.avatarUrl && String(u.avatarUrl).trim()) ||
      avatarFromSeed(u.fullName || u.email || String(u._id)),
    coverUrl: (u.coverUrl && String(u.coverUrl).trim()) || DEFAULT_COVER,
    openToWork: Boolean(u.openToWork),
    about: u.about ?? "",

    skills: Array.isArray(u.skills) ? u.skills : [],

    experiences: (u.experiences ?? []).map((x: any) => ({
      title: x.title ?? "",
      company: x.company ?? "",
      employmentType: x.employmentType ?? "",
      start: x.startYear ?? "",
      end: x.current ? "Present" : x.endYear ?? "",
      location: x.location ?? "",
      description: x.description ?? "",
    })),

    education: (u.education ?? []).map((e: any) => ({
      level: e.level,
      institutionName: e.institutionName ?? "",
      degreeField: e.degreeField ?? "",
      passingYear: e.passingYear ?? "",
      description: e.description ?? "",
    })),

    linkedin: u.linkedin ?? "",
    github: u.github ?? "",
    portfolio: u.portfolio ?? "",
  };
}
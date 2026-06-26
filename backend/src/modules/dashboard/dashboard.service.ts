import { User } from "../../models/User";

function avatarFromSeed(seed: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

function splitHeadline(headlineRaw?: string) {
  const headline = (headlineRaw ?? "").trim();
  if (!headline) return { position: "Student", company: "—" };

  const parts = headline.split("@");
  if (parts.length >= 2) {
    const position = parts[0].trim() || "Student";
    const company = parts.slice(1).join("@").trim() || "—";
    return { position, company };
  }
  return { position: headline, company: "—" };
}

function dateOnly(d: any) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export async function getDashboardData() {
  // Featured: random sample of verified users
  const featuredRaw = await User.aggregate([
    { $match: { emailVerified: true } },
    { $sample: { size: 12 } },
    {
      $project: {
        fullName: 1,
        headline: 1,
        cityCountry: 1,
        avatarUrl: 1,
        coverUrl: 1,
        email: 1,
      },
    },
  ]);

  // Recently updated: most recently updated profiles
  const recentRaw = await User.find({ emailVerified: true })
    .sort({ updatedAt: -1 })
    .limit(12)
    .select("fullName headline cityCountry avatarUrl skills email updatedAt")
    .lean();

  const featuredAlumni = featuredRaw.map((u: any) => ({
    id: String(u._id),
    fullName: u.fullName ?? "Batch 223",
    headline: u.headline ?? "",
    cityCountry: u.cityCountry ?? "—",
    avatarUrl:
      (u.avatarUrl && String(u.avatarUrl).trim()) ||
      avatarFromSeed(u.fullName || u.email || String(u._id)),
    coverUrl: (u.coverUrl && String(u.coverUrl).trim()) || undefined,
  }));

  const recentlyUpdated = recentRaw.map((u: any) => {
    const { position, company } = splitHeadline(u.headline);
    return {
      id: String(u._id),
      fullName: u.fullName ?? "Batch 223",
      position,
      company,
      cityCountry: u.cityCountry ?? "—",
      avatarUrl:
        (u.avatarUrl && String(u.avatarUrl).trim()) ||
        avatarFromSeed(u.fullName || u.email || String(u._id)),
      skills: Array.isArray(u.skills) ? u.skills : [],
      updatedAt: dateOnly(u.updatedAt),
    };
  });

  return { featuredAlumni, recentlyUpdated };
}
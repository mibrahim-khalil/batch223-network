import { User } from "../../models/User";

function toProfileDto(user: any) {
  return {
    registrationNumber: user.registrationNumber ?? "",

    fullName: user.fullName ?? "Your Name",
    headline: user.headline ?? "Your Role @ Company",
    cityCountry: user.cityCountry ?? "City, Country",
    about: user.about ?? "",

    openToWork: Boolean(user.openToWork),
    freelancer: Boolean(user.freelancer),
    entrepreneur: Boolean(user.entrepreneur),

    phone: user.phone ?? "",
    email: user.email,

    linkedin: user.linkedin ?? "",
    github: user.github ?? "",
    portfolio: user.portfolio ?? "",
    fiverr: user.fiverr ?? "",
    upwork: user.upwork ?? "",

    skills: user.skills ?? [],

    experiences: user.experiences ?? [],
    education: user.education ?? [],

    avatarFileName: user.avatarFileName ?? "",
    coverFileName: user.coverFileName ?? "",
    resumeFileName: user.resumeFileName ?? "",

    avatarUrl: user.avatarUrl ?? "",
    coverUrl: user.coverUrl ?? "",
    resumeUrl: user.resumeUrl ?? "",
  };
}

export async function getMyProfile(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    const err: any = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }
  return toProfileDto(user);
}

export async function updateMyProfile(userId: string, patch: any) {
  const user = await User.findById(userId);
  if (!user) {
    const err: any = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }

  Object.assign(user, patch);

  await user.save();
  return toProfileDto(user);
}
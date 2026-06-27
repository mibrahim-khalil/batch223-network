import { api } from "../../lib/apiClient";
import type { Profile } from "./profileTypes";

export async function getMyProfileApi() {
  return api<Profile>("/api/profile/me", { method: "GET", auth: true });
}

export async function updateMyProfileApi(patch: Partial<Profile>) {
  // Remove read-only fields
  const { email, registrationNumber, ...safe } = patch;
  return api<Profile>("/api/profile/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(safe),
  });
}
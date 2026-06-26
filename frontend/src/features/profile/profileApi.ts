import { api } from "../../lib/apiClient";
import type { Profile } from "./profileTypes";

export async function getMyProfileApi() {
  return api<Profile>("/api/profile/me", { method: "GET", auth: true });
}

export async function updateMyProfileApi(patch: Partial<Profile>) {
  // IMPORTANT: backend does not allow updating email
  // so always omit email if it exists in payload
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...safe } = patch as any;

  return api<Profile>("/api/profile/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(safe),
  });
}
import { api } from "../../lib/apiClient";

export async function uploadAvatarApi(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<{ url: string }>("/api/uploads/avatar", {
    method: "POST",
    auth: true,
    body: fd,
  });
}

export async function uploadCoverApi(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<{ url: string }>("/api/uploads/cover", {
    method: "POST",
    auth: true,
    body: fd,
  });
}

export async function uploadResumeApi(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<{ url: string }>("/api/uploads/resume", {
    method: "POST",
    auth: true,
    body: fd,
  });
}
import { api } from "../../lib/apiClient";

export type AnnouncementTag = "Announcement" | "Update" | "Job" | "Event";
export type AnnouncementStatus = "published" | "pending" | "rejected";

export type AnnouncementDto = {
  id: string;
  title: string;
  body: string;
  tag: AnnouncementTag;
  pinned: boolean;
  official: boolean;
  status: AnnouncementStatus;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementsListResponse = {
  items: AnnouncementDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function listAnnouncementsApi(params?: {
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  qs.set("page", String(params?.page ?? 1));
  qs.set("pageSize", String(params?.pageSize ?? 200));

  return api<AnnouncementsListResponse>(`/api/announcements?${qs.toString()}`, {
    method: "GET",
    auth: true,
  });
}

export async function getAnnouncementApi(id: string) {
  return api<AnnouncementDto>(`/api/announcements/${id}`, {
    method: "GET",
    auth: true,
  });
}

export async function createAnnouncementApi(input: {
  title: string;
  body: string;
  tag: "Announcement" | "Update"; // matches your UI composer
}) {
  return api<AnnouncementDto>("/api/announcements", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}


export async function adminPatchAnnouncementApi(
  id: string,
  patch: Partial<Pick<AnnouncementDto, "title" | "body" | "tag" | "pinned" | "official" | "status">>
) {
  return api<AnnouncementDto>(`/api/announcements/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(patch),
  });
}

export async function adminDeleteAnnouncementApi(id: string) {
  return api<{ ok: true }>(`/api/announcements/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
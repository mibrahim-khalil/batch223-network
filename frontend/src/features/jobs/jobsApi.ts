import { api } from "../../lib/apiClient";

export type JobStatus = "published" | "pending" | "rejected";
export type JobType = "Job" | "Internship";

export type JobDto = {
  id: string;
  title: string;
  company: string;
  cityCountry: string;
  type: JobType;
  skills: string[];
  postedAt: string; // yyyy-mm-dd
  link?: string;
  body: string;
  open: boolean;

  status: JobStatus;
  official: boolean;
  authorEmail: string;

  createdAt: string;
  updatedAt: string;
};

export type JobsListResponse = {
  items: JobDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function listJobsApi(params?: { q?: string; page?: number; pageSize?: number }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  qs.set("page", String(params?.page ?? 1));
  qs.set("pageSize", String(params?.pageSize ?? 200));

  return api<JobsListResponse>(`/api/jobs?${qs.toString()}`, {
    method: "GET",
    auth: true,
  });
}

export function getJobApi(id: string) {
  return api<JobDto>(`/api/jobs/${id}`, { method: "GET", auth: true });
}

export function createJobApi(input: {
  title: string;
  company: string;
  cityCountry: string;
  type: JobType;
  skills: string[];
  link?: string;
  body: string;
  open: boolean;
}) {
  return api<JobDto>("/api/jobs", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}


export function adminPatchJobApi(
  id: string,
  patch: Partial<
    Pick<
      JobDto,
      "status" | "official" | "title" | "company" | "cityCountry" | "type" | "skills" | "link" | "body" | "open"
    >
  >
) {
  return api<JobDto>(`/api/jobs/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(patch),
  });
}

export function adminDeleteJobApi(id: string) {
  return api<{ ok: true }>(`/api/jobs/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
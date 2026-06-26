import { api } from "../../lib/apiClient";

export type EventStatus = "published" | "pending" | "rejected";
export type EventType = "Meetup" | "Workshop" | "Webinar" | "Sports" | "Reunion";

export type EventDto = {
  id: string;
  title: string;
  type: EventType;
  cityCountry: string;
  venue: string;
  date: string;
  time: string;
  description: string;

  status: EventStatus;
  official: boolean;
  authorEmail: string;

  createdAt: string;
  updatedAt: string;
};

export type EventsListResponse = {
  items: EventDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function listEventsApi(params?: { q?: string; page?: number; pageSize?: number }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  qs.set("page", String(params?.page ?? 1));
  qs.set("pageSize", String(params?.pageSize ?? 200));

  return api<EventsListResponse>(`/api/events?${qs.toString()}`, {
    method: "GET",
    auth: true,
  });
}

export function getEventApi(id: string) {
  return api<EventDto>(`/api/events/${id}`, { method: "GET", auth: true });
}

export function createEventApi(input: {
  title: string;
  type: EventType;
  cityCountry: string;
  venue: string;
  date: string;
  time: string;
  description: string;
}) {
  return api<EventDto>("/api/events", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}


export function adminPatchEventApi(
  id: string,
  patch: Partial<Pick<EventDto, "status" | "official" | "title" | "type" | "cityCountry" | "venue" | "date" | "time" | "description">>
) {
  return api<EventDto>(`/api/events/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(patch),
  });
}

export function adminDeleteEventApi(id: string) {
  return api<{ ok: true }>(`/api/events/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
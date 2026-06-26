import { api } from "../../lib/apiClient";

export type FeaturedAlumni = {
  id: string;
  fullName: string;
  headline: string;
  cityCountry: string;
  avatarUrl: string;
  coverUrl?: string;
};

export type RecentlyUpdated = {
  id: string;
  fullName: string;
  position: string;
  company: string;
  cityCountry: string;
  avatarUrl: string;
  skills: string[];
  updatedAt: string;
};

export type DashboardResponse = {
  featuredAlumni: FeaturedAlumni[];
  recentlyUpdated: RecentlyUpdated[];
};

export function getDashboardApi() {
  return api<DashboardResponse>("/api/dashboard", { method: "GET", auth: true });
}
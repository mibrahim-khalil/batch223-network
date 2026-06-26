import { api } from "../../lib/apiClient";

export type AdminStats = {
  totalUsers: number;
  verifiedUsers: number;
};

export function getAdminStatsApi() {
  return api<AdminStats>("/api/admin/stats", { method: "GET", auth: true });
}
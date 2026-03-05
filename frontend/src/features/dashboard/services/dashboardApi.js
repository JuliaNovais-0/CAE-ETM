import { http } from "../../../app/api/http";

/**
 * GET /api/dashboard/stats
 * Retorna DashboardStatsDTO
 */
export async function fetchDashboardStats() {
  const res = await http.get("/api/dashboard/stats");
  return res.data;
}

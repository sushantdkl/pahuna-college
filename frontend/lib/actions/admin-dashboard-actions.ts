import {
  getAdminDashboardOverview,
  type DashboardRange,
} from "@/lib/api/admin-dashboard";

export function getAdminDashboardOverviewAction(range: DashboardRange) {
  return getAdminDashboardOverview(range);
}

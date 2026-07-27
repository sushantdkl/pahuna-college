import { apiGet } from "./axios-instance";

export type DashboardRange = "today" | "7d" | "30d" | "90d";

export type DashboardBreakdownItem = {
  label: string;
  count: number;
  href: string;
};

export type DashboardCard = {
  id: string;
  label: string;
  value: number;
  comparison: string;
  href: string;
  icon: string;
  breakdown?: DashboardBreakdownItem[];
};

export type DashboardTrend = {
  metric: string;
  points: Array<{ label: string; value: number }>;
};

export type DashboardPipeline = {
  id: string;
  label: string;
  href: string;
  statuses: Array<{ status: string; count: number }>;
};

export type DashboardSubmission = {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  href: string;
};

export type DashboardOverview = {
  range: DashboardRange;
  dateFrom: string;
  dateTo: string;
  cards: DashboardCard[];
  trends: DashboardTrend[];
  contentDistribution: DashboardBreakdownItem[];
  pipelines: DashboardPipeline[];
  reservationSummary: {
    statuses: Array<{ status: string; count: number }>;
    total: number;
    estimatedValue: number;
    roomsReserved: number;
    nextCheckIn: { guestName: string; checkIn: string; status: string } | null;
    href: string;
  };
  attention: Array<{ label: string; count: number; href: string }>;
  recentSubmissions: Record<string, DashboardSubmission[]>;
  recentActivity: Array<{ type: string; text: string; createdAt: string; href: string }>;
  recentlyPublished: Array<{
    title: string;
    type: string;
    image?: string;
    createdAt: string;
    href: string;
  }>;
  quickActions: Array<{ label: string; href: string }>;
  health: Array<{ label: string; status: string; detail: string }>;
};

export function getAdminDashboardOverview(range: DashboardRange) {
  return apiGet<DashboardOverview>(`/admin/dashboard/overview?range=${range}`, true);
}

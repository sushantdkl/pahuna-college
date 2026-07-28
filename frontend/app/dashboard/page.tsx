"use client";

import { AdminReplicaFrame, AdminReplicaOverviewContent } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  return (
    <AdminReplicaFrame>
      <AdminReplicaOverviewContent title="Dashboard" />
    </AdminReplicaFrame>
  );
}


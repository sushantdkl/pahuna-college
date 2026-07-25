"use client";

import { AdminReplicaFrame, AdminReplicaOverviewContent } from "@/components/dashboard/dashboard-shell";

export default function AdminOverviewPage() {
  return (
    <AdminReplicaFrame>
      <AdminReplicaOverviewContent title="Dashboard" />
    </AdminReplicaFrame>
  );
}


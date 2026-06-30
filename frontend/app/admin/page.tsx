"use client";

import { AdminReplicaFrame, AdminReplicaOverviewContent } from "@/app/_components/admin-replica-dashboard";

export default function AdminOverviewPage() {
  return (
    <AdminReplicaFrame>
      <AdminReplicaOverviewContent title="Dashboard" />
    </AdminReplicaFrame>
  );
}

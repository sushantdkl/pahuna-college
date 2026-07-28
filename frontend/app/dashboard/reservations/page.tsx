"use client";

import { AdminReplicaFrame } from "@/components/dashboard/dashboard-shell";
import { AdminReservationsPanel } from "@/components/reservations/admin-reservations-panel";

export default function AdminReservationsPage() {
  return (
    <AdminReplicaFrame>
      <AdminReservationsPanel />
    </AdminReplicaFrame>
  );
}

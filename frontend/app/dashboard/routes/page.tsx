"use client";

import { SimpleCrudPage, type CrudField } from "@/app/dashboard/_components/simple-crud-page";
import {
  createAdminRouteSegment,
  createAdminTransportRoute,
  deleteAdminRouteSegment,
  deleteAdminTransportRoute,
  getAdminRouteSegments,
  getAdminTransportRoutes,
  updateAdminRouteSegment,
  updateAdminTransportRoute,
  type RouteSegment,
  type TransportRoute,
} from "@/lib/actions/final-crud-actions";

const modes = ["FLIGHT", "BUS", "JEEP", "WALK", "TREK", "MIXED"].map((value) => ({ label: value, value }));

const segmentFields: CrudField[] = [
  { key: "from", label: "From", required: true },
  { key: "to", label: "To", required: true },
  { key: "slug", label: "Slug" },
  { key: "mode", label: "Mode", type: "select", required: true, options: modes },
  { key: "distanceKm", label: "Distance KM", type: "number" },
  { key: "durationMin", label: "Min Duration", type: "number" },
  { key: "durationMax", label: "Max Duration", type: "number" },
  { key: "costMin", label: "Min Cost", type: "number" },
  { key: "costMax", label: "Max Cost", type: "number" },
  { key: "currency", label: "Currency" },
  { key: "seasonality", label: "Seasonality" },
  { key: "reliability", label: "Reliability", type: "select", options: ["HIGH", "MEDIUM", "LOW"].map((value) => ({ label: value, value })) },
  { key: "notes", label: "Notes", type: "textarea" },
  { key: "riskNotes", label: "Risk Notes", type: "textarea" },
  { key: "recommendedStopover", label: "Recommended Stopover" },
  { key: "requiresConfirmation", label: "Requires Confirmation", type: "boolean" },
  { key: "featured", label: "Featured", type: "boolean" },
  { key: "active", label: "Active", type: "boolean" },
];

const transportFields: CrudField[] = [
  { key: "fromLocation", label: "From Location", required: true },
  { key: "toLocation", label: "To Location", required: true },
  { key: "mode", label: "Mode", required: true },
  { key: "durationHours", label: "Duration Hours", type: "number" },
  { key: "costMin", label: "Min Cost", type: "number" },
  { key: "costMax", label: "Max Cost", type: "number" },
  { key: "frequency", label: "Frequency" },
  { key: "notes", label: "Notes", type: "textarea" },
  { key: "sortOrder", label: "Sort Order", type: "number" },
  { key: "isActive", label: "Active", type: "boolean" },
];

export default function DashboardRoutesPage() {
  return (
    <div className="grid gap-6">
      <SimpleCrudPage<RouteSegment>
        title="Route Segments"
        subtitle="Manage Karnali route legs with cost, time, reliability, seasonality, and safety notes"
        createLabel="New Route Segment"
        fields={segmentFields}
        columns={[
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "mode", label: "Mode" },
          { key: "costMin", label: "Cost", render: (item) => `${item.currency} ${item.costMin || 0} - ${item.costMax || 0}` },
          { key: "reliability", label: "Reliability" },
          { key: "active", label: "Active", render: (item) => item.active ? "Active" : "Inactive" },
          { key: "updatedAt", label: "Updated", render: (item) => new Date(item.updatedAt).toLocaleDateString() },
        ]}
        filters={[
          { key: "active", label: "Active status", options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }] },
          { key: "featured", label: "Featured status", options: [{ label: "Featured", value: "true" }, { label: "Normal", value: "false" }] },
          { key: "mode", label: "Mode", options: modes },
        ]}
        load={getAdminRouteSegments}
        create={createAdminRouteSegment}
        update={updateAdminRouteSegment}
        remove={deleteAdminRouteSegment}
        statLabels={["Total Segments", "Active", "Featured", "Inactive"]}
        defaultValues={{ mode: "JEEP", currency: "NPR", reliability: "MEDIUM", requiresConfirmation: true, active: true, featured: false }}
      />
      <SimpleCrudPage<TransportRoute>
        title="Transport Routes"
        subtitle="Manage simple transport route summaries and frequency notes"
        createLabel="New Transport Route"
        fields={transportFields}
        columns={[
          { key: "fromLocation", label: "From" },
          { key: "toLocation", label: "To" },
          { key: "mode", label: "Mode" },
          { key: "durationHours", label: "Hours" },
          { key: "costMin", label: "Cost", render: (item) => `NPR ${item.costMin || 0} - ${item.costMax || 0}` },
          { key: "isActive", label: "Active", render: (item) => item.isActive ? "Active" : "Inactive" },
        ]}
        filters={[
          { key: "active", label: "Active status", options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }] },
        ]}
        load={getAdminTransportRoutes}
        create={createAdminTransportRoute}
        update={updateAdminTransportRoute}
        remove={deleteAdminTransportRoute}
        statLabels={["Total Routes", "Active", "Reviewed", "Inactive"]}
        defaultValues={{ mode: "Jeep", isActive: true, sortOrder: 0 }}
      />
    </div>
  );
}

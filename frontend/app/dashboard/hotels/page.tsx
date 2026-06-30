"use client";

import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/app/_components/admin-replica-dashboard";
import { featuredStays } from "@/lib/pahuna-content";

const createdDates = ["May 20, 2026", "May 20, 2026", "May 18, 2026", "May 18, 2026", "May 18, 2026"];

export default function DashboardHotelsPage() {
  const activeListings = featuredStays.filter((stay) => stay.publicListing !== false).length;
  const coordinateCount = featuredStays.filter((stay) => stay.latitude && stay.longitude).length;
  const mapCoverage = featuredStays.length ? Math.round((coordinateCount / featuredStays.length) * 100) : 0;

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stays & Services</h1>
          <p className="text-sm text-stone-500">Review Karnali provider listings, verification status, and inquiries</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Providers" value={featuredStays.length} icon="providers" />
          <ReplicaStatCard title="Active Listings" value={activeListings} icon="active" />
          <ReplicaStatCard title="Inquiries" value={0} icon="inquiries" />
          <ReplicaStatCard title="Map Coverage" value={`${mapCoverage}%`} subtitle={`${coordinateCount}/${featuredStays.length} have coordinates`} icon="map" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-base font-semibold">Provider Records</h2>
              <p className="text-sm text-stone-500">{featuredStays.length} providers flagged for pending physical verification</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-9 w-36 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-700 outline-none">
                <option>All</option>
                <option>Hotels</option>
                <option>Resorts</option>
                <option>Guest Houses</option>
              </select>
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">50 / 107</span>
            </div>
          </div>

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[1180px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">Name</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Type</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">District</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Verification</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Consent</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Active</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Featured</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Flag</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {featuredStays.slice(0, 18).map((stay, index) => (
                  <tr key={stay.slug} className="border-b last:border-0">
                    <td className="py-2.5 pr-5 font-medium text-stone-950">{stay.name}</td>
                    <td className="py-2.5 pr-5">
                      <TableSelect value={stay.typeLabel || stay.type} />
                    </td>
                    <td className="py-2.5 pr-5 text-stone-950">{stay.district.split("/")[0].trim()}</td>
                    <td className="py-2.5 pr-5">
                      <TableSelect value={formatStatus(stay.verificationStatus || "PUBLIC_LISTING")} />
                    </td>
                    <td className="py-2.5 pr-5">
                      <TableSelect value={stay.consentStatus === "APPROVED" ? "Approved" : "Pending"} />
                    </td>
                    <td className="py-2.5 pr-5">
                      <TableSelect value={index % 5 === 2 ? "No" : "Yes"} narrow />
                    </td>
                    <td className="py-2.5 pr-5">
                      <TableSelect value={stay.featured ? "Yes" : "No"} narrow />
                    </td>
                    <td className="py-2.5 pr-5">
                      <ReplicaStatusBadge>Pending physical verification</ReplicaStatusBadge>
                    </td>
                    <td className="py-2.5 pr-5 text-stone-950">{createdDates[index % createdDates.length]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminReplicaFrame>
  );
}

function TableSelect({ value, narrow = false }: { value: string; narrow?: boolean }) {
  return (
    <select value={value} onChange={() => undefined} className={`h-9 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-950 outline-none ${narrow ? "w-24" : "w-36"}`}>
      <option>{value}</option>
    </select>
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

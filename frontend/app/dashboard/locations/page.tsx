"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import { getAdminDestinationsApi, updateAdminDestinationApi, type AdminDestination } from "@/lib/api/admin-destinations";
import { getAdminExperiencesApi, updateAdminExperienceApi, type AdminExperience } from "@/lib/api/admin-experiences";
import { getAdminHotelsApi, updateAdminHotelApi, type AdminHotel } from "@/lib/api/admin-hotels";
import { getAdminFoodProviders, updateAdminFoodProvider, type FoodProvider } from "@/lib/api/final-crud";

type LocationRecord = {
  id: string;
  type: "Stay" | "Food" | "Destination" | "Experience";
  name: string;
  district: string;
  area: string;
  address: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  active: boolean;
  updatedAt: string;
  raw: AdminHotel | FoodProvider | AdminDestination | AdminExperience;
};

type LocationForm = {
  district: string;
  area: string;
  address: string;
  latitude: string;
  longitude: string;
  verified: boolean;
};

type LocationUpdate = {
  district?: string;
  area?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  verified?: boolean;
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const pageSize = 10;

export default function DashboardLocationsPage() {
  const [records, setRecords] = useState<LocationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<LocationRecord | null>(null);
  const [editing, setEditing] = useState<LocationRecord | null>(null);
  const [form, setForm] = useState<LocationForm>({ district: "", area: "", address: "", latitude: "", longitude: "", verified: false });
  const [isSaving, setIsSaving] = useState(false);

  const loadLocations = useCallback(async () => {
    setIsFetching(true);
    setError("");

    try {
      const [hotels, food, destinations, experiences] = await Promise.all([
        getAdminHotelsApi({ page: 1, limit: 50 }),
        getAdminFoodProviders({ page: 1, limit: 50 }),
        getAdminDestinationsApi({ page: 1, limit: 50 }),
        getAdminExperiencesApi({ page: 1, limit: 50 }),
      ]);

      setRecords([
        ...(hotels.data || []).map(mapHotel),
        ...(food.data || []).map(mapFood),
        ...(destinations.data || []).map(mapDestination),
        ...(experiences.data || []).map(mapExperience),
      ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (loadError) {
      setRecords([]);
      setError(loadError instanceof Error ? loadError.message : "Unable to load location records");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadLocations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadLocations]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch = !query || [record.name, record.district, record.area, record.address].join(" ").toLowerCase().includes(query);
      const matchesType = !typeFilter || record.type === typeFilter;
      const matchesDistrict = !districtFilter || record.district.toLowerCase().includes(districtFilter.toLowerCase());
      const matchesVerified = !verifiedFilter || String(record.verified) === verifiedFilter;
      return matchesSearch && matchesType && matchesDistrict && matchesVerified;
    });
  }, [districtFilter, records, search, typeFilter, verifiedFilter]);

  const totalPages = Math.max(Math.ceil(filteredRecords.length / pageSize), 1);
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  const stats = useMemo(() => ({
    total: records.length,
    mapped: records.filter((record) => hasCoordinates(record)).length,
    verified: records.filter((record) => record.verified).length,
    missing: records.filter((record) => !hasCoordinates(record)).length,
  }), [records]);

  function openEdit(record: LocationRecord) {
    setEditing(record);
    setForm({
      district: record.district,
      area: record.area,
      address: record.address,
      latitude: record.latitude === undefined ? "" : String(record.latitude),
      longitude: record.longitude === undefined ? "" : String(record.longitude),
      verified: record.verified,
    });
    setNotice("");
    setError("");
  }

  async function saveLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const latitude = parseOptionalNumber(form.latitude);
    const longitude = parseOptionalNumber(form.longitude);

    if ((latitude === undefined) !== (longitude === undefined)) {
      setError("Latitude and longitude must be saved together");
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      await updateRecord(editing, {
        district: form.district,
        area: form.area,
        address: form.address,
        latitude,
        longitude,
        verified: form.verified,
      });
      setNotice("Location saved");
      setEditing(null);
      await loadLocations();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save location");
    } finally {
      setIsSaving(false);
    }
  }

  async function quickVerify(record: LocationRecord) {
    setNotice("");
    setError("");

    try {
      await updateRecord(record, { verified: !record.verified });
      setNotice(record.verified ? "Location unverified" : "Location verified");
      await loadLocations();
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Unable to update verification");
    }
  }

  async function resetLocation(record: LocationRecord) {
    setNotice("");
    setError("");

    try {
      await updateRecord(record, { latitude: undefined, longitude: undefined, verified: false });
      setNotice("Location coordinates reset");
      await loadLocations();
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to reset location");
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
          <p className="text-sm text-stone-500">Manage map-ready addresses and coordinates from stays, food providers, destinations, and experiences.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Location Records" value={stats.total} subtitle="Loaded from domain records" icon="location" />
          <ReplicaStatCard title="Mapped Records" value={stats.mapped} subtitle="Latitude and longitude saved" icon="map" />
          <ReplicaStatCard title="Verified Locations" value={stats.verified} subtitle="Approved for public maps" icon="verified" />
          <ReplicaStatCard title="Missing Coordinates" value={stats.missing} subtitle="Need map data" icon="attention" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1fr_170px_170px_170px]">
            <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search name, district, area, or address" className={inputClassName} />
            <select value={typeFilter} onChange={(event) => { setPage(1); setTypeFilter(event.target.value); }} className={inputClassName} aria-label="Filter by entity type">
              <option value="">All types</option>
              <option value="Stay">Stays</option>
              <option value="Food">Food</option>
              <option value="Destination">Destinations</option>
              <option value="Experience">Experiences</option>
            </select>
            <input value={districtFilter} onChange={(event) => { setPage(1); setDistrictFilter(event.target.value); }} placeholder="District" className={inputClassName} />
            <select value={verifiedFilter} onChange={(event) => { setPage(1); setVerifiedFilter(event.target.value); }} className={inputClassName} aria-label="Filter by verification">
              <option value="">All verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={loadLocations} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[1120px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">Entity</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Type</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">District</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Area</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Address</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Coordinates</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Verification</th>
                  <th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? <LoadingRows /> : visibleRecords.length ? visibleRecords.map((record) => (
                  <tr key={`${record.type}-${record.id}`} className="border-b last:border-0">
                    <td className="py-3 pr-5 font-semibold text-stone-950">{record.name}</td>
                    <td className="py-3 pr-5"><ReplicaStatusBadge tone="neutral">{record.type}</ReplicaStatusBadge></td>
                    <td className="py-3 pr-5 text-stone-700">{record.district || "Not set"}</td>
                    <td className="py-3 pr-5 text-stone-700">{record.area || "Not set"}</td>
                    <td className="py-3 pr-5 text-stone-700">{record.address || "Not set"}</td>
                    <td className="py-3 pr-5 text-stone-700">{hasCoordinates(record) ? `${record.latitude}, ${record.longitude}` : "Not set"}</td>
                    <td className="py-3 pr-5"><ReplicaStatusBadge tone={record.verified ? "success" : "warning"}>{record.verified ? "Verified" : "Unverified"}</ReplicaStatusBadge></td>
                    <td className="py-3 pr-0">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => setSelected(record)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button>
                        <button onClick={() => openEdit(record)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button>
                        <button onClick={() => void quickVerify(record)} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{record.verified ? "Unverify" : "Verify"}</button>
                        <button onClick={() => void resetLocation(record)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Reset</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="py-14 text-center"><p className="text-base font-semibold text-stone-900">No locations found</p><p className="mt-2 text-sm text-stone-500">Adjust filters or add location data through a stay, food provider, destination, or experience record.</p></td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">Page {page} of {totalPages} - {filteredRecords.length} records</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={page <= 1 || isFetching} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((value) => Math.min(value + 1, totalPages))} disabled={page >= totalPages || isFetching} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>

      {selected ? <LocationDetail record={selected} onClose={() => setSelected(null)} /> : null}
      {editing ? <LocationEditDialog record={editing} form={form} setForm={setForm} isSaving={isSaving} onClose={() => setEditing(null)} onSubmit={saveLocation} /> : null}
    </AdminReplicaFrame>
  );
}

function mapHotel(hotel: AdminHotel): LocationRecord {
  return { id: hotel._id, type: "Stay", name: hotel.name, district: hotel.district || "", area: "", address: hotel.address || "", latitude: hotel.latitude, longitude: hotel.longitude, verified: hotel.isVerified, active: hotel.isActive, updatedAt: hotel.updatedAt, raw: hotel };
}

function mapFood(food: FoodProvider): LocationRecord {
  return { id: food._id, type: "Food", name: food.name, district: food.district || "", area: food.area || "", address: food.address || "", latitude: food.latitude, longitude: food.longitude, verified: food.verificationStatus === "VERIFIED" || food.verificationStatus === "PARTNER", active: food.active, updatedAt: food.updatedAt, raw: food };
}

function mapDestination(destination: AdminDestination): LocationRecord {
  return { id: destination._id, type: "Destination", name: destination.name, district: destination.district || "", area: "", address: "", latitude: destination.latitude, longitude: destination.longitude, verified: destination.isActive, active: destination.isActive, updatedAt: destination.updatedAt, raw: destination };
}

function mapExperience(experience: AdminExperience): LocationRecord {
  return { id: experience._id, type: "Experience", name: experience.name, district: "", area: experience.location || "", address: experience.location || "", latitude: experience.latitude, longitude: experience.longitude, verified: experience.isActive, active: experience.isActive, updatedAt: experience.updatedAt, raw: experience };
}

async function updateRecord(record: LocationRecord, updates: LocationUpdate) {
  if (record.type === "Stay") {
    const hotel = record.raw as AdminHotel;
    return updateAdminHotelApi(record.id, {
      name: hotel.name,
      description: hotel.description,
      address: updates.address ?? hotel.address,
      district: updates.district ?? hotel.district,
      latitude: updates.latitude,
      longitude: updates.longitude,
      propertyType: hotel.propertyType,
      starRating: hotel.starRating,
      priceMin: hotel.priceMin,
      priceMax: hotel.priceMax,
      amenities: hotel.amenities || [],
      contactPhone: hotel.contactPhone,
      email: hotel.email,
      images: hotel.images || [],
      isVerified: updates.verified ?? hotel.isVerified,
      isFeatured: hotel.isFeatured,
      isActive: hotel.isActive,
      totalRooms: hotel.totalRooms,
      availableRooms: hotel.availableRooms,
    });
  }

  if (record.type === "Food") {
    return updateAdminFoodProvider(record.id, {
      district: updates.district,
      area: updates.area,
      address: updates.address,
      latitude: updates.latitude,
      longitude: updates.longitude,
      verificationStatus: updates.verified ? "VERIFIED" : "PENDING",
    });
  }

  if (record.type === "Destination") {
    const destination = record.raw as AdminDestination;
    return updateAdminDestinationApi(record.id, {
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      attractions: destination.attractions || [],
      bestTimeToVisit: destination.bestTimeToVisit,
      distanceFromSurkhetKm: destination.distanceFromSurkhetKm,
      latitude: updates.latitude,
      longitude: updates.longitude,
      images: destination.images || [],
      category: destination.category,
      district: updates.district ?? destination.district,
      isActive: updates.verified ?? destination.isActive,
      isFeatured: destination.isFeatured,
    });
  }

  const experience = record.raw as AdminExperience;
  return updateAdminExperienceApi(record.id, {
    providerId: experience.providerId,
    name: experience.name,
    description: experience.description,
    category: experience.category,
    price: experience.price,
    duration: experience.duration,
    location: updates.address || updates.area || experience.location,
    latitude: updates.latitude,
    longitude: updates.longitude,
    maxParticipants: experience.maxParticipants,
    images: experience.images || [],
    rating: experience.rating,
    reviewCount: experience.reviewCount,
    isActive: updates.verified ?? experience.isActive,
  });
}

function LocationDetail({ record, onClose }: { record: LocationRecord; onClose: () => void }) {
  return (
    <Modal title={record.name} eyebrow={`${record.type} location`} onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Detail label="District" value={record.district || "Not set"} />
        <Detail label="Area" value={record.area || "Not set"} />
        <Detail label="Address" value={record.address || "Not set"} />
        <Detail label="Coordinates" value={hasCoordinates(record) ? `${record.latitude}, ${record.longitude}` : "Not set"} />
        <Detail label="Verification" value={record.verified ? "Verified" : "Unverified"} />
        <Detail label="Updated" value={formatDate(record.updatedAt)} />
      </div>
      {hasCoordinates(record) ? (
        <a className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" href={`https://www.openstreetmap.org/?mlat=${record.latitude}&mlon=${record.longitude}#map=15/${record.latitude}/${record.longitude}`} target="_blank" rel="noreferrer">
          Open map
        </a>
      ) : null}
    </Modal>
  );
}

function LocationEditDialog({ record, form, setForm, isSaving, onClose, onSubmit }: { record: LocationRecord; form: LocationForm; setForm: (form: LocationForm) => void; isSaving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <Modal title={record.name} eyebrow="Edit location" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="District"><input value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} className={inputClassName} /></Field>
          <Field label="Area"><input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className={inputClassName} /></Field>
          <Field label="Latitude"><input type="number" step="any" min="-90" max="90" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Longitude"><input type="number" step="any" min="-180" max="180" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} className={inputClassName} /></Field>
          <label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Address</span><textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className={`${inputClassName} min-h-24`} /></label>
          <label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.verified} onChange={(event) => setForm({ ...form, verified: event.target.checked })} /> Verified for public maps</label>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Use the map link in View to confirm coordinates, then save exact latitude and longitude here.
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{isSaving ? "Saving..." : "Save location"}</button>
        </div>
      </form>
    </Modal>
  );
}

function Alert({ tone, message, onRetry }: { tone: "success" | "error"; message: string; onRetry?: () => void }) {
  return <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>{message}</span>{onRetry ? <button onClick={onRetry} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Retry</button> : null}</div></div>;
}

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: 8 }).map((__, cellIndex) => <td key={cellIndex} className="py-4 pr-5"><div className="h-4 animate-pulse rounded-full bg-stone-100" /></td>)}</tr>);
}

function Modal({ title, eyebrow, children, onClose }: { title: string; eyebrow: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6"><section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-stone-950">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button></div>{children}</section></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>;
}

function hasCoordinates(record: LocationRecord) {
  return typeof record.latitude === "number" && typeof record.longitude === "number";
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) throw new Error("Coordinates must be valid numbers");
  return parsed;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import { AdminReservationsPanel } from "@/components/reservations/admin-reservations-panel";
import {
  createAdminHotelAction,
  deleteAdminHotelAction,
  getAdminHotelsAction,
  updateAdminHotelAction,
} from "@/lib/actions/admin-hotel-actions";
import type { AdminHotel } from "@/lib/api/admin-hotels";
import { featuredStays } from "@/lib/pahuna-content";
import {
  adminHotelFormSchema,
  type AdminHotelFormData,
} from "@/schemas/admin-hotel.schema";

type FormMode = "create" | "edit";

type HotelFormState = {
  name: string;
  description: string;
  address: string;
  district: string;
  latitude: string;
  longitude: string;
  propertyType: string;
  starRating: string;
  priceMin: string;
  priceMax: string;
  amenities: string;
  contactPhone: string;
  email: string;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  totalRooms: string;
  availableRooms: string;
};

const pageSizeOptions = [10, 20, 50];
const propertyTypes = ["Hotel", "Resort", "Guest House", "Lodge", "Homestay", "Inn"];
const districtSeeds = Array.from(new Set(featuredStays.map((stay) => stay.district.split("/")[0].trim()).filter(Boolean)));
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const emptyForm: HotelFormState = {
  name: "",
  description: "",
  address: "",
  district: "",
  latitude: "",
  longitude: "",
  propertyType: "Hotel",
  starRating: "",
  priceMin: "",
  priceMax: "",
  amenities: "",
  contactPhone: "",
  email: "",
  isVerified: false,
  isFeatured: false,
  isActive: true,
  totalRooms: "",
  availableRooms: "",
};

export default function DashboardHotelsPage() {
  const searchParams = useSearchParams();
  const requestedEdit = searchParams.get("edit");
  const requestedSearch = searchParams.get("search");
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(requestedSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(requestedSearch || "");
  const [propertyType, setPropertyType] = useState("");
  const [district, setDistrict] = useState("");
  const [verified, setVerified] = useState("");
  const [featured, setFeatured] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<AdminHotel | null>(null);
  const [form, setForm] = useState<HotelFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [viewHotel, setViewHotel] = useState<AdminHotel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminHotel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadHotels = useCallback(async () => {
    setIsFetching(true);
    setError("");

    try {
      const response = await getAdminHotelsAction({
        page,
        limit,
        search: debouncedSearch,
        propertyType,
        district,
        verified,
        featured,
      });

      setHotels(response.data || []);
      setMeta(response.meta || { page, limit, total: response.data?.length || 0, totalPages: 1 });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load hotels");
      setHotels([]);
    } finally {
      setIsFetching(false);
    }
  }, [debouncedSearch, district, featured, limit, page, propertyType, verified]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadHotels();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadHotels]);

  const stats = useMemo(() => {
    const active = hotels.filter((hotel) => hotel.isActive).length;
    const verifiedCount = hotels.filter((hotel) => hotel.isVerified).length;
    const featuredCount = hotels.filter((hotel) => hotel.isFeatured).length;
    const mapped = hotels.filter((hotel) => typeof hotel.latitude === "number" && typeof hotel.longitude === "number").length;
    const coverage = hotels.length ? Math.round((mapped / hotels.length) * 100) : 0;

    return { active, verifiedCount, featuredCount, mapped, coverage };
  }, [hotels]);

  const typeOptions = useMemo(() => {
    const apiTypes = hotels.map((hotel) => hotel.propertyType).filter(Boolean);
    return Array.from(new Set([...propertyTypes, ...apiTypes]));
  }, [hotels]);

  const districtOptions = useMemo(() => {
    const apiDistricts = hotels.map((hotel) => hotel.district || hotel.address.split(",").at(-1)?.trim() || "").filter(Boolean);
    return Array.from(new Set([...districtSeeds, ...apiDistricts]));
  }, [hotels]);

  function openCreateForm() {
    setSelectedHotel(null);
    setForm(emptyForm);
    setFormError("");
    setImageFiles(null);
    setFormMode("create");
  }

  function openEditForm(hotel: AdminHotel) {
    setSelectedHotel(hotel);
    setForm({
      name: hotel.name || "",
      description: hotel.description || "",
      address: hotel.address || "",
      district: hotel.district || "",
      latitude: hotel.latitude?.toString() || "",
      longitude: hotel.longitude?.toString() || "",
      propertyType: hotel.propertyType || "Hotel",
      starRating: hotel.starRating?.toString() || "",
      priceMin: hotel.priceMin?.toString() || "",
      priceMax: hotel.priceMax?.toString() || "",
      amenities: hotel.amenities?.join(", ") || "",
      contactPhone: hotel.contactPhone || "",
      email: hotel.email || "",
      isVerified: hotel.isVerified,
      isFeatured: hotel.isFeatured,
      isActive: hotel.isActive,
      totalRooms: hotel.totalRooms?.toString() || "",
      availableRooms: hotel.availableRooms?.toString() || "",
    });
    setFormError("");
    setImageFiles(null);
    setFormMode("edit");
  }

  useEffect(() => {
    if (!requestedEdit || !hotels.length || formMode) return;

    const target = hotels.find((hotel) => {
      const nameSlug = hotel.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return hotel._id === requestedEdit || nameSlug === requestedEdit;
    });

    if (!target) return;

    const timeout = window.setTimeout(() => {
      openEditForm(target);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [formMode, hotels, requestedEdit]);

  function toPayload(state: HotelFormState): AdminHotelFormData {
    return {
      name: state.name,
      description: state.description,
      address: state.address,
      district: state.district || undefined,
      latitude: state.latitude ? Number(state.latitude) : undefined,
      longitude: state.longitude ? Number(state.longitude) : undefined,
      propertyType: state.propertyType,
      starRating: state.starRating ? Number(state.starRating) : undefined,
      priceMin: state.priceMin ? Number(state.priceMin) : undefined,
      priceMax: state.priceMax ? Number(state.priceMax) : undefined,
      amenities: state.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      contactPhone: state.contactPhone || undefined,
      email: state.email || undefined,
      images: selectedHotel?.images || [],
      isVerified: state.isVerified,
      isFeatured: state.isFeatured,
      isActive: state.isActive,
      totalRooms: state.totalRooms ? Number(state.totalRooms) : undefined,
      availableRooms: state.availableRooms ? Number(state.availableRooms) : undefined,
    };
  }

  async function handleSaveHotel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const parsed = adminHotelFormSchema.safeParse(toPayload(form));

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the hotel form");
      return;
    }

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createAdminHotelAction(parsed.data, imageFiles || undefined);
        setNotice("Hotel created successfully");
      } else if (selectedHotel) {
        await updateAdminHotelAction(selectedHotel._id, parsed.data, imageFiles || undefined);
        setNotice("Hotel updated successfully");
      }

      setFormMode(null);
      await loadHotels();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save hotel");
    } finally {
      setIsSaving(false);
    }
  }

  async function quickPatchHotel(hotel: AdminHotel, updates: Partial<AdminHotelFormData>) {
    setNotice("");
    setError("");

    const payload = adminHotelFormSchema.safeParse({
      ...hotel,
      amenities: hotel.amenities || [],
      ...updates,
    });

    if (!payload.success) {
      setError(payload.error.issues[0]?.message || "Unable to update hotel");
      return;
    }

    try {
      await updateAdminHotelAction(hotel._id, payload.data);
      setNotice(`${hotel.name} updated`);
      await loadHotels();
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : "Unable to update hotel");
    }
  }

  async function handleDeleteHotel() {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setNotice("");

    try {
      await deleteAdminHotelAction(deleteTarget._id);
      setNotice("Hotel deleted successfully");
      setDeleteTarget(null);
      await loadHotels();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete hotel");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stays & Services</h1>
            <p className="text-sm text-stone-500">Review Karnali provider listings, verification status, and inquiries</p>
          </div>
          <button onClick={openCreateForm} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            New Hotel
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ReplicaStatCard title="Total Providers" value={meta.total} subtitle="All matching records" icon="providers" />
          <ReplicaStatCard title="Active Listings" value={stats.active} subtitle="On this page" icon="active" />
          <ReplicaStatCard title="Verified Listings" value={stats.verifiedCount} subtitle="On this page" icon="verified" />
          <ReplicaStatCard title="Featured Listings" value={stats.featuredCount} subtitle="On this page" icon="featured" />
          <ReplicaStatCard title="Map Coverage" value={`${stats.coverage}%`} subtitle={`${stats.mapped}/${hotels.length} visible records`} icon="map" />
        </div>

        <AdminReservationsPanel />

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1.2fr_repeat(5,minmax(0,0.7fr))]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, address, email, phone" className={inputClassName} />
            <select value={propertyType} onChange={(event) => { setPage(1); setPropertyType(event.target.value); }} className={inputClassName} aria-label="Property type filter">
              <option value="">All types</option>
              {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select value={district} onChange={(event) => { setPage(1); setDistrict(event.target.value); }} className={inputClassName} aria-label="District filter">
              <option value="">All districts</option>
              {districtOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={verified} onChange={(event) => { setPage(1); setVerified(event.target.value); }} className={inputClassName} aria-label="Verified filter">
              <option value="">Verified: all</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
            <select value={featured} onChange={(event) => { setPage(1); setFeatured(event.target.value); }} className={inputClassName} aria-label="Featured filter">
              <option value="">Featured: all</option>
              <option value="true">Featured</option>
              <option value="false">Not featured</option>
            </select>
            <select value={limit} onChange={(event) => { setPage(1); setLimit(Number(event.target.value)); }} className={inputClassName} aria-label="Rows per page">
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option} rows</option>)}
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={loadHotels} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[1180px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">Name</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Type</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Address</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Price</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Verified</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Featured</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Rooms</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Map</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Created</th>
                  <th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <LoadingRows />
                ) : hotels.length ? (
                  hotels.map((hotel) => (
                    <tr key={hotel._id} className="border-b last:border-0">
                      <td className="py-3 pr-5">
                        <p className="font-medium text-stone-950">{hotel.name}</p>
                        <p className="mt-1 text-xs text-stone-500">{hotel.email || hotel.contactPhone || "No contact"}</p>
                      </td>
                      <td className="py-3 pr-5 text-stone-700">{hotel.propertyType}</td>
                      <td className="max-w-[260px] py-3 pr-5 text-stone-600">{hotel.district || hotel.address}</td>
                      <td className="py-3 pr-5 text-stone-700">{formatPrice(hotel)}</td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge>{hotel.isVerified ? "Verified" : "Unverified"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge>{hotel.isFeatured ? "Featured" : "Standard"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5 text-stone-700">{formatRooms(hotel)}</td>
                      <td className="py-3 pr-5 text-stone-700">{hasCoordinates(hotel) ? "Mapped" : "Missing"}</td>
                      <td className="py-3 pr-5 text-stone-700">{formatDate(hotel.createdAt)}</td>
                      <td className="py-3 pr-0">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick={() => setViewHotel(hotel)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button>
                          <button onClick={() => openEditForm(hotel)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button>
                          <button onClick={() => void quickPatchHotel(hotel, { isVerified: !hotel.isVerified })} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">{hotel.isVerified ? "Unverify" : "Verify"}</button>
                          <button onClick={() => void quickPatchHotel(hotel, { isFeatured: !hotel.isFeatured })} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{hotel.isFeatured ? "Unfeature" : "Feature"}</button>
                          <button onClick={() => setDeleteTarget(hotel)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-14 text-center">
                      <p className="text-base font-semibold text-stone-900">No hotels found</p>
                      <p className="mt-2 text-sm text-stone-500">Create a hotel or adjust the filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} · {meta.total} hotels</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={isFetching || meta.page <= 1} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={isFetching || meta.page >= meta.totalPages} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>

      {formMode ? (
        <HotelFormDialog
          mode={formMode}
          form={form}
          error={formError}
          isSaving={isSaving}
          selectedHotel={selectedHotel}
          onClose={() => setFormMode(null)}
          onChange={setForm}
          onFiles={setImageFiles}
          onSubmit={handleSaveHotel}
        />
      ) : null}

      {viewHotel ? <ViewHotelDialog hotel={viewHotel} onClose={() => setViewHotel(null)} /> : null}
      {deleteTarget ? <DeleteHotelDialog hotel={deleteTarget} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteHotel} /> : null}
    </AdminReplicaFrame>
  );
}

function Alert({ tone, message, onRetry }: { tone: "success" | "error"; message: string; onRetry?: () => void }) {
  return (
    <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{message}</span>
        {onRetry ? <button onClick={onRetry} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Retry</button> : null}
      </div>
    </div>
  );
}

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: 10 }).map((__, cellIndex) => (
        <td key={cellIndex} className="py-4 pr-5">
          <div className="h-4 animate-pulse rounded-full bg-stone-100" />
        </td>
      ))}
    </tr>
  ));
}

function HotelFormDialog({
  mode,
  form,
  error,
  isSaving,
  selectedHotel,
  onClose,
  onChange,
  onFiles,
  onSubmit,
}: {
  mode: FormMode;
  form: HotelFormState;
  error: string;
  isSaving: boolean;
  selectedHotel: AdminHotel | null;
  onClose: () => void;
  onChange: (form: HotelFormState) => void;
  onFiles: (files: FileList | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/80 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Hotel form</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{mode === "create" ? "Create hotel" : "Edit hotel"}</h2>
            {selectedHotel?.images?.length ? <p className="mt-1 text-sm text-stone-500">{selectedHotel.images.length} current image(s)</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Name"><input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClassName} /></Field>
          <Field label="Property type"><select value={form.propertyType} onChange={(event) => onChange({ ...form, propertyType: event.target.value })} className={inputClassName}>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="Address"><input value={form.address} onChange={(event) => onChange({ ...form, address: event.target.value })} className={inputClassName} /></Field>
          <Field label="District"><input value={form.district} onChange={(event) => onChange({ ...form, district: event.target.value })} className={inputClassName} /></Field>
          <Field label="Contact phone"><input value={form.contactPhone} onChange={(event) => onChange({ ...form, contactPhone: event.target.value })} className={inputClassName} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} className={inputClassName} /></Field>
          <Field label="Price min"><input type="number" value={form.priceMin} onChange={(event) => onChange({ ...form, priceMin: event.target.value })} className={inputClassName} /></Field>
          <Field label="Price max"><input type="number" value={form.priceMax} onChange={(event) => onChange({ ...form, priceMax: event.target.value })} className={inputClassName} /></Field>
          <Field label="Latitude"><input type="number" step="any" value={form.latitude} onChange={(event) => onChange({ ...form, latitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Longitude"><input type="number" step="any" value={form.longitude} onChange={(event) => onChange({ ...form, longitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Star rating"><input type="number" step="0.1" min="0" max="5" value={form.starRating} onChange={(event) => onChange({ ...form, starRating: event.target.value })} className={inputClassName} /></Field>
          <Field label="Total rooms"><input type="number" value={form.totalRooms} onChange={(event) => onChange({ ...form, totalRooms: event.target.value })} className={inputClassName} /></Field>
          <Field label="Available rooms"><input type="number" value={form.availableRooms} onChange={(event) => onChange({ ...form, availableRooms: event.target.value })} className={inputClassName} /></Field>
          <Field label="Images"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => onFiles(event.target.files)} className={inputClassName} /></Field>
          <Field label="Amenities"><input value={form.amenities} onChange={(event) => onChange({ ...form, amenities: event.target.value })} placeholder="Wi-Fi, Parking, Restaurant" className={inputClassName} /></Field>
          <div className="grid gap-3 rounded-lg border border-stone-200 p-4 text-sm font-semibold text-stone-700">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} /> Active listing</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isVerified} onChange={(event) => onChange({ ...form, isVerified: event.target.checked })} /> Verified</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(event) => onChange({ ...form, isFeatured: event.target.checked })} /> Featured</label>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
        </div>

        {error ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{isSaving ? "Saving..." : "Save hotel"}</button>
        </div>
      </form>
    </div>
  );
}

function ViewHotelDialog({ hotel, onClose }: { hotel: AdminHotel; onClose: () => void }) {
  const mapHref = hasCoordinates(hotel) ? `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{hotel.propertyType}</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{hotel.name}</h2>
            <p className="mt-2 text-sm text-stone-500">{hotel.address}</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>
        <p className="mt-5 text-sm leading-6 text-stone-600">{hotel.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Price" value={formatPrice(hotel)} />
          <Detail label="Rooms" value={formatRooms(hotel)} />
          <Detail label="Contact" value={hotel.email || hotel.contactPhone || "Not set"} />
          <Detail label="Map" value={hasCoordinates(hotel) ? `${hotel.latitude}, ${hotel.longitude}` : "Coordinates missing"} />
        </div>
        {mapHref ? <Link href={mapHref} target="_blank" className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Open map</Link> : null}
      </section>
    </div>
  );
}

function DeleteHotelDialog({ hotel, isDeleting, onCancel, onConfirm }: { hotel: AdminHotel; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Delete hotel</p>
        <h2 className="mt-3 text-2xl font-bold text-stone-950">Confirm deletion</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">This will delete <span className="font-bold">{hotel.name}</span> from admin hotel management.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete hotel"}</button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>;
}

function hasCoordinates(hotel: AdminHotel) {
  return typeof hotel.latitude === "number" && typeof hotel.longitude === "number";
}

function formatPrice(hotel: AdminHotel) {
  if (hotel.priceMin && hotel.priceMax) return `Rs. ${hotel.priceMin} - ${hotel.priceMax}`;
  if (hotel.priceMin) return `From Rs. ${hotel.priceMin}`;
  if (hotel.priceMax) return `Up to Rs. ${hotel.priceMax}`;
  return "Ask price";
}

function formatRooms(hotel: AdminHotel) {
  if (hotel.availableRooms !== undefined && hotel.totalRooms !== undefined) return `${hotel.availableRooms}/${hotel.totalRooms}`;
  if (hotel.totalRooms !== undefined) return `${hotel.totalRooms} total`;
  return hotel.isActive ? "Active" : "Inactive";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


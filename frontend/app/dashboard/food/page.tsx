"use client";

import { SimpleCrudPage, type CrudField } from "@/app/dashboard/_components/simple-crud-page";
import {
  createAdminFoodProvider,
  deleteAdminFoodProvider,
  getAdminFoodProviders,
  updateAdminFoodProvider,
  type FoodProvider,
} from "@/lib/actions/final-crud-actions";

const fields: CrudField[] = [
  { key: "name", label: "Name", required: true },
  { key: "slug", label: "Slug" },
  { key: "type", label: "Type", required: true },
  { key: "district", label: "District", required: true },
  { key: "area", label: "Area", required: true },
  { key: "address", label: "Address" },
  { key: "shortDescription", label: "Short Description", type: "textarea", required: true },
  { key: "longDescription", label: "Long Description", type: "textarea" },
  { key: "cuisines", label: "Cuisines", type: "list" },
  { key: "services", label: "Services", type: "list" },
  { key: "features", label: "Features", type: "list" },
  { key: "priceLevel", label: "Price Level" },
  { key: "openingHours", label: "Opening Hours" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "images", label: "Images", type: "list" },
  { key: "verificationStatus", label: "Verification", type: "select", options: ["PENDING", "VERIFIED", "PARTNER", "REJECTED"].map((value) => ({ label: value, value })) },
  { key: "featured", label: "Featured", type: "boolean" },
  { key: "active", label: "Active", type: "boolean" },
];

export default function DashboardFoodPage() {
  return (
    <SimpleCrudPage<FoodProvider>
      title="Food Providers"
      subtitle="Manage cafes, restaurants, tea shops, momo spots, and route food records"
      createLabel="New Food Provider"
      fields={fields}
      columns={[
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "area", label: "Area" },
        { key: "verificationStatus", label: "Verification" },
        { key: "featured", label: "Featured", render: (item) => item.featured ? "Yes" : "No" },
        { key: "active", label: "Active", render: (item) => item.active ? "Active" : "Inactive" },
        { key: "updatedAt", label: "Updated", render: (item) => new Date(item.updatedAt).toLocaleDateString() },
      ]}
      filters={[
        { key: "active", label: "Active status", options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }] },
        { key: "featured", label: "Featured status", options: [{ label: "Featured", value: "true" }, { label: "Normal", value: "false" }] },
        { key: "verificationStatus", label: "Verification", options: ["PENDING", "VERIFIED", "PARTNER", "REJECTED"].map((value) => ({ label: value, value })) },
      ]}
      load={getAdminFoodProviders}
      create={createAdminFoodProvider}
      update={updateAdminFoodProvider}
      remove={deleteAdminFoodProvider}
      statLabels={["Total Food", "Active Food", "Pending", "Inactive"]}
      defaultValues={{ verificationStatus: "PENDING", featured: false, active: true, cuisines: "", services: "", features: "", images: "" }}
    />
  );
}

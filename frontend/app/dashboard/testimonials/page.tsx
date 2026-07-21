"use client";

import { SimpleCrudPage, type CrudField } from "@/app/dashboard/_components/simple-crud-page";
import {
  createAdminTestimonial,
  deleteAdminTestimonial,
  getAdminTestimonials,
  updateAdminTestimonial,
  type Testimonial,
} from "@/lib/actions/final-crud-actions";

const fields: CrudField[] = [
  { key: "name", label: "Name", required: true },
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "quote", label: "Quote", type: "textarea", required: true },
  { key: "rating", label: "Rating", type: "number" },
  { key: "avatar", label: "Avatar Image" },
  { key: "category", label: "Category" },
  { key: "serviceSlug", label: "Service Slug" },
  { key: "sortOrder", label: "Sort Order", type: "number" },
  { key: "isPublished", label: "Published", type: "boolean" },
];

export default function DashboardTestimonialsPage() {
  return (
    <SimpleCrudPage<Testimonial>
      title="Testimonials"
      subtitle="Manage customer, partner, training, and consulting proof for public pages"
      createLabel="New Testimonial"
      fields={fields}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "category", label: "Category" },
        { key: "rating", label: "Rating" },
        { key: "isPublished", label: "Published", render: (item) => item.isPublished ? "Published" : "Draft" },
        { key: "updatedAt", label: "Updated", render: (item) => new Date(item.updatedAt).toLocaleDateString() },
      ]}
      filters={[
        { key: "published", label: "Publication", options: [{ label: "Published", value: "true" }, { label: "Draft", value: "false" }] },
      ]}
      load={getAdminTestimonials}
      create={createAdminTestimonial}
      update={updateAdminTestimonial}
      remove={deleteAdminTestimonial}
      statLabels={["Total Stories", "Published", "Draft", "Hidden"]}
      defaultValues={{ rating: 5, isPublished: true, sortOrder: 0 }}
    />
  );
}

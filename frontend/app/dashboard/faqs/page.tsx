"use client";

import { SimpleCrudPage, type CrudField } from "@/app/dashboard/_components/simple-crud-page";
import {
  createAdminFAQ,
  deleteAdminFAQ,
  getAdminFAQs,
  updateAdminFAQ,
  type FAQ,
} from "@/lib/actions/final-crud-actions";

const fields: CrudField[] = [
  { key: "question", label: "Question", required: true },
  { key: "answer", label: "Answer", type: "textarea", required: true },
  { key: "category", label: "Category", required: true },
  { key: "sortOrder", label: "Sort Order", type: "number" },
  { key: "isPublished", label: "Published", type: "boolean" },
];

export default function DashboardFaqsPage() {
  return (
    <SimpleCrudPage<FAQ>
      title="FAQs"
      subtitle="Manage public questions for Pahuna routes, stays, partners, training, and travel planning"
      createLabel="New FAQ"
      fields={fields}
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Category" },
        { key: "isPublished", label: "Published", render: (item) => item.isPublished ? "Published" : "Draft" },
        { key: "sortOrder", label: "Sort" },
        { key: "updatedAt", label: "Updated", render: (item) => new Date(item.updatedAt).toLocaleDateString() },
      ]}
      filters={[
        { key: "published", label: "Publication", options: [{ label: "Published", value: "true" }, { label: "Draft", value: "false" }] },
      ]}
      load={getAdminFAQs}
      create={createAdminFAQ}
      update={updateAdminFAQ}
      remove={deleteAdminFAQ}
      statLabels={["Total FAQs", "Published", "Draft", "Hidden"]}
      defaultValues={{ category: "Travel", isPublished: true, sortOrder: 0 }}
    />
  );
}

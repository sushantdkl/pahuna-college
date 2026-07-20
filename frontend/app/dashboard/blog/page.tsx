"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  createAdminBlogPostAction,
  deleteAdminBlogPostAction,
  getAdminBlogPostsAction,
  updateAdminBlogPostAction,
} from "@/lib/actions/admin-blog-post-actions";
import type { AdminBlogPost } from "@/lib/api/admin-blog-posts";
import type { BlogAuthor } from "@/lib/api/blog-posts";
import {
  blogPostFormSchema,
  type BlogPostFormData,
  type BlogPostStatus,
} from "@/schemas/blog-post.schema";

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  featuredImage: string;
  status: BlogPostStatus;
};

const emptyForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Travel Guide",
  tags: "",
  featuredImage: "",
  status: "DRAFT",
};

const statuses: BlogPostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const categorySeeds = ["Travel Guide", "Destination", "Culture", "Food", "Adventure", "Planning"];
const imageSuggestions = [
  "/images/hero/karnali-hero.jpg",
  "/images/karnali/rara-lake.jpg",
  "/images/karnali/phoksundo-lake.jpg",
  "/images/surkhet/bulbule-lake.jpg",
  "/images/surkhet/kakrebihar.jpg",
];
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BlogPostStatus | "">("");
  const [category, setCategory] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [viewing, setViewing] = useState<AdminBlogPost | null>(null);
  const [editing, setEditing] = useState<AdminBlogPost | "create" | null>(null);
  const [deleting, setDeleting] = useState<AdminBlogPost | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminBlogPostsAction({
        page,
        limit: 10,
        search,
        status,
        category,
      });
      setPosts(response.data || []);
      setMeta(response.meta || { page, limit: 10, total: response.data?.length || 0, totalPages: 1 });
      setSummary({
        total: response.meta?.summary?.total || 0,
        published: response.meta?.summary?.published || 0,
        draft: response.meta?.summary?.draft || 0,
        archived: response.meta?.summary?.archived || 0,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load blog posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [category, page, search, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPosts(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadPosts]);

  const categories = useMemo(
    () => Array.from(new Set([...categorySeeds, ...posts.map((post) => post.category || "").filter(Boolean)])),
    [posts],
  );

  function openCreate() {
    setForm(emptyForm);
    setFormError("");
    setEditing("create");
  }

  function openEdit(post: AdminBlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category || "",
      tags: post.tags.join(", "),
      featuredImage: post.featuredImage || "",
      status: post.status,
    });
    setFormError("");
    setEditing(post);
  }

  function payload(): BlogPostFormData {
    return {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category || undefined,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      featuredImage: form.featuredImage || undefined,
      status: form.status,
    };
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");
    const parsed = blogPostFormSchema.safeParse(payload());
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the blog post form");
      return;
    }
    setSaving(true);
    try {
      if (editing === "create") {
        await createAdminBlogPostAction(parsed.data);
        setNotice("Blog post created successfully");
      } else if (editing) {
        await updateAdminBlogPostAction(editing._id, parsed.data);
        setNotice("Blog post updated successfully");
      }
      setEditing(null);
      await loadPosts();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save blog post");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(post: AdminBlogPost) {
    const nextStatus: BlogPostStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setSavingId(post._id);
    setError("");
    setNotice("");
    try {
      await updateAdminBlogPostAction(post._id, { status: nextStatus });
      setNotice(`${post.title} ${nextStatus === "PUBLISHED" ? "published" : "moved to draft"}`);
      await loadPosts();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update publish status");
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    setError("");
    try {
      await deleteAdminBlogPostAction(deleting._id);
      setNotice("Blog post deleted successfully");
      setDeleting(null);
      await loadPosts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete blog post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1><p className="text-sm text-stone-500">Manage travel guides, destination stories, and Pahuna content</p></div><button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">New Blog Post</button></div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><ReplicaStatCard title="Total Posts" value={summary.total} subtitle="All content" icon="BP" /><ReplicaStatCard title="Published Posts" value={summary.published} subtitle="Publicly visible" icon="PB" /><ReplicaStatCard title="Draft Posts" value={summary.draft} subtitle="Admin only" icon="DR" /><ReplicaStatCard title="Archived Posts" value={summary.archived} subtitle="Stored history" icon="AR" /></div>
        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadPosts()} className="font-bold underline">Retry</button></div> : null}

        <ReplicaDataCard title="Blog post records" description="Create, edit, publish, archive, or delete" count={meta.total}>
          <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_220px_auto]"><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search title, slug, content, category, or tag" className={inputClassName} /><select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as BlogPostStatus | ""); }} className={inputClassName}><option value="">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select><select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className={inputClassName}><option value="">All categories</option>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select><button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white">Search</button></form>

          {loading ? <div className="py-14 text-center text-sm font-medium text-stone-500">Loading blog posts...</div> : posts.length ? <table className="w-full min-w-[1050px] text-sm"><thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Title</th><th className="pb-3 pr-4 font-medium">Category</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Author</th><th className="pb-3 pr-4 font-medium">Published</th><th className="pb-3 pr-4 font-medium">Updated</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{posts.map((post) => <tr key={post._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4"><p className="font-semibold text-stone-900">{post.title}</p><p className="mt-1 text-xs text-stone-500">/{post.slug}</p></td><td className="py-4 pr-4 text-stone-600">{post.category || "Uncategorized"}</td><td className="py-4 pr-4"><StatusBadge status={post.status} /></td><td className="py-4 pr-4 text-stone-600">{authorName(post.authorId)}</td><td className="py-4 pr-4 text-stone-500">{post.publishedAt ? formatDate(post.publishedAt) : "Not published"}</td><td className="py-4 pr-4 text-stone-500">{formatDate(post.updatedAt)}</td><td className="py-4"><div className="flex min-w-80 flex-wrap gap-2">{post.status === "PUBLISHED" ? <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</Link> : <button onClick={() => setViewing(post)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</button>}<button onClick={() => openEdit(post)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">Edit</button><button disabled={savingId === post._id} onClick={() => void togglePublished(post)} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{savingId === post._id ? "Saving..." : post.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button><button onClick={() => setDeleting(post)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button></div></td></tr>)}</tbody></table> : <div className="py-14 text-center"><p className="font-semibold text-stone-800">No blog posts found.</p><p className="mt-2 text-sm text-stone-500">Create a draft or adjust the filters.</p><button onClick={openCreate} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Create post</button></div>}
          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {meta.totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= meta.totalPages || loading} onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>
        </ReplicaDataCard>
      </div>

      {viewing ? <ViewDialog post={viewing} onClose={() => setViewing(null)} /> : null}
      {editing ? <FormDialog mode={editing === "create" ? "create" : "edit"} form={form} setForm={setForm} categories={categories} error={formError} saving={saving} onClose={() => setEditing(null)} onSubmit={handleSave} /> : null}
      {deleting ? <ModalShell title="Delete blog post?" eyebrow="Permanent action" onClose={() => setDeleting(null)}><p className="text-sm leading-6 text-stone-600">Delete <strong>{deleting.title}</strong>? This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setDeleting(null)} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={() => void confirmDelete()} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Deleting..." : "Delete post"}</button></div></ModalShell> : null}
    </AdminReplicaFrame>
  );
}

function FormDialog({ mode, form, setForm, categories, error, saving, onClose, onSubmit }: { mode: "create" | "edit"; form: BlogFormState; setForm: React.Dispatch<React.SetStateAction<BlogFormState>>; categories: string[]; error: string; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) { return <ModalShell title={mode === "create" ? "Create blog post" : "Edit blog post"} eyebrow="Content management" onClose={onClose}><form onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} className={inputClassName} /></Field><Field label="Slug (optional)"><input value={form.slug} onChange={(event) => setForm((value) => ({ ...value, slug: event.target.value }))} placeholder="generated-from-title" className={inputClassName} /></Field><Field label="Category"><input list="blog-categories" value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))} className={inputClassName} /><datalist id="blog-categories">{categories.map((value) => <option key={value} value={value} />)}</datalist></Field><Field label="Status"><select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value as BlogPostStatus }))} className={inputClassName}>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></Field><Field label="Tags (comma separated)"><input value={form.tags} onChange={(event) => setForm((value) => ({ ...value, tags: event.target.value }))} placeholder="karnali, rara, planning" className={inputClassName} /></Field><Field label="Featured image path"><input list="blog-images" value={form.featuredImage} onChange={(event) => setForm((value) => ({ ...value, featuredImage: event.target.value }))} placeholder="/images/karnali/rara-lake.jpg" className={inputClassName} /><datalist id="blog-images">{imageSuggestions.map((value) => <option key={value} value={value} />)}</datalist></Field></div><Field label="Excerpt" className="mt-4"><textarea value={form.excerpt} onChange={(event) => setForm((value) => ({ ...value, excerpt: event.target.value }))} className={`${inputClassName} min-h-24`} /></Field><Field label="Content" className="mt-4"><textarea value={form.content} onChange={(event) => setForm((value) => ({ ...value, content: event.target.value }))} className={`${inputClassName} min-h-64`} placeholder="Write the full travel guide or story" /></Field>{error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}</button></div></form></ModalShell>; }
function ViewDialog({ post, onClose }: { post: AdminBlogPost; onClose: () => void }) { return <ModalShell title={post.title} eyebrow={post.category || "Blog post"} onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Status" value={label(post.status)} /><Detail label="Author" value={authorName(post.authorId)} /><Detail label="Slug" value={`/${post.slug}`} /><Detail label="Featured image" value={post.featuredImage || "Fallback image"} /></div><TextBlock label="Excerpt" value={post.excerpt} /><TextBlock label="Content" value={post.content} />{post.tags.length ? <p className="mt-4 text-sm text-stone-600">Tags: {post.tags.join(", ")}</p> : null}</ModalShell>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function Field({ label: fieldLabel, className = "", children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`block space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500 ${className}`}>{fieldLabel}{children}</label>; }
function Detail({ label: detailLabel, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{detailLabel}</p><p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p></div>; }
function TextBlock({ label: blockLabel, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{blockLabel}</p><p className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function StatusBadge({ status }: { status: BlogPostStatus }) { const tone = status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : status === "ARCHIVED" ? "bg-stone-100 text-stone-600" : "bg-amber-100 text-amber-900"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label(status)}</span>; }
function label(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function authorName(author: string | BlogAuthor) { return typeof author === "string" ? "Pahuna admin" : author.fullName; }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }

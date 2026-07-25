"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminBlogPosts,
  updateAdminBlogPost,
  type BlogPost,
  type BlogPostPayload,
  type BlogPostStatus,
} from "@/lib/api/blog-posts";

type FormMode = "create" | "edit";
type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  status: BlogPostStatus;
  isFeatured: boolean;
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  authorName: "Pahuna Team",
  category: "",
  tags: "",
  seoTitle: "",
  seoDescription: "",
  status: "DRAFT",
  isFeatured: false,
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BlogPostStatus | "">("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, summary: {} as Record<string, number> });
  const [isFetching, setIsFetching] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<FormMode | null>(null);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [viewPost, setViewPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsFetching(true);
    setError("");
    try {
      const response = await getAdminBlogPosts({ page, limit: 10, search, status });
      setPosts(response.data || []);
      setMeta({ page, limit: 10, total: response.meta?.total || 0, totalPages: response.meta?.totalPages || 1, summary: response.meta?.summary || {} });
    } catch (loadError) {
      setPosts([]);
      setError(loadError instanceof Error ? loadError.message : "Unable to load blog posts");
    } finally {
      setIsFetching(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPosts(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadPosts]);

  const stats = useMemo(() => ({
    total: meta.summary.total ?? meta.total,
    published: meta.summary.published ?? posts.filter((post) => post.status === "PUBLISHED").length,
    drafts: meta.summary.drafts ?? posts.filter((post) => post.status === "DRAFT").length,
    featured: meta.summary.featured ?? posts.filter((post) => post.isFeatured).length,
  }), [meta, posts]);

  function openCreate() {
    setSelected(null);
    setForm(emptyForm);
    setFormError("");
    setMode("create");
  }

  function openEdit(post: BlogPost) {
    setSelected(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      authorName: post.authorName,
      category: post.category || "",
      tags: post.tags.join(", "),
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      status: post.status,
      isFeatured: post.isFeatured,
    });
    setFormError("");
    setMode("edit");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setFormError("");
    const payload = toPayload(form);
    if (!payload.title || !payload.excerpt || !payload.content || !payload.authorName) {
      setFormError("Title, excerpt, content, and author are required");
      return;
    }
    setIsSaving(true);
    try {
      if (mode === "create") {
        await createAdminBlogPost(payload);
        setNotice("Blog post created");
      } else if (selected) {
        await updateAdminBlogPost(selected._id, payload);
        setNotice("Blog post updated");
      }
      setMode(null);
      await loadPosts();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save blog post");
    } finally {
      setIsSaving(false);
    }
  }

  async function quickPatch(post: BlogPost, payload: BlogPostPayload, message: string) {
    setNotice("");
    setError("");
    try {
      await updateAdminBlogPost(post._id, payload);
      setNotice(message);
      await loadPosts();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update blog post");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError("");
    setNotice("");
    try {
      await deleteAdminBlogPost(deleteTarget._id);
      setNotice("Blog post deleted");
      setDeleteTarget(null);
      await loadPosts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1><p className="text-sm text-stone-500">Create, edit, publish, feature, and remove public travel stories.</p></div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Create Post</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><ReplicaStatCard title="Blog Posts" value={stats.total} subtitle="Database records" icon="blog" /><ReplicaStatCard title="Published" value={stats.published} subtitle="Visible publicly" icon="published" /><ReplicaStatCard title="Drafts" value={stats.drafts} subtitle="Private posts" icon="draft" /><ReplicaStatCard title="Featured" value={stats.featured} subtitle="Highlighted posts" icon="featured" /></div>
        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 sm:grid-cols-[1fr_180px]"><input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search title, excerpt, author, or tag" className={inputClassName} /><select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as BlogPostStatus | ""); }} className={inputClassName}><option value="">All status</option><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
          {notice ? <Alert tone="success" message={notice} /> : null}{error ? <Alert tone="error" message={error} onRetry={loadPosts} /> : null}
          <div className="overflow-x-auto px-6 py-5"><table className="w-full min-w-[1040px] text-sm"><thead><tr className="border-b text-left"><th className="pb-3 pr-5 font-medium text-stone-500">Post</th><th className="pb-3 pr-5 font-medium text-stone-500">Author</th><th className="pb-3 pr-5 font-medium text-stone-500">Category</th><th className="pb-3 pr-5 font-medium text-stone-500">Status</th><th className="pb-3 pr-5 font-medium text-stone-500">Published</th><th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th></tr></thead><tbody>{isFetching ? <LoadingRows /> : posts.length ? posts.map((post) => <tr key={post._id} className="border-b last:border-0"><td className="py-3 pr-5"><p className="font-semibold text-stone-950">{post.title}</p><p className="mt-1 line-clamp-1 text-xs text-stone-500">{post.excerpt}</p></td><td className="py-3 pr-5 text-stone-700">{post.authorName}</td><td className="py-3 pr-5 text-stone-700">{post.category || "Not set"}</td><td className="py-3 pr-5"><ReplicaStatusBadge tone={post.status === "PUBLISHED" ? "success" : "warning"}>{post.status === "PUBLISHED" ? "Published" : "Draft"}</ReplicaStatusBadge></td><td className="py-3 pr-5 text-stone-700">{post.publishedAt ? formatDate(post.publishedAt) : "Not published"}</td><td className="py-3 pr-0"><div className="flex flex-wrap justify-end gap-2"><button onClick={() => setViewPost(post)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button><button onClick={() => openEdit(post)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button><button onClick={() => void quickPatch(post, { status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }, post.status === "PUBLISHED" ? "Post moved to draft" : "Post published")} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{post.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button><button onClick={() => void quickPatch(post, { isFeatured: !post.isFeatured }, post.isFeatured ? "Post unfeatured" : "Post featured")} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{post.isFeatured ? "Unfeature" : "Feature"}</button><button onClick={() => setDeleteTarget(post)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button></div></td></tr>) : <tr><td colSpan={6} className="py-14 text-center"><p className="text-base font-semibold text-stone-900">No blog posts found</p><p className="mt-2 text-sm text-stone-500">Create a post or adjust your filters.</p></td></tr>}</tbody></table></div>
          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} - {meta.total} posts</p><div className="flex gap-2"><button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={isFetching || meta.page <= 1} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button><button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={isFetching || meta.page >= meta.totalPages} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button></div></div>
        </section>
      </div>
      {mode ? <BlogFormDialog mode={mode} form={form} error={formError} isSaving={isSaving} onChange={setForm} onClose={() => setMode(null)} onSubmit={handleSave} /> : null}
      {viewPost ? <ViewDialog post={viewPost} onClose={() => setViewPost(null)} /> : null}
      {deleteTarget ? <DeleteDialog post={deleteTarget} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} /> : null}
    </AdminReplicaFrame>
  );
}

function BlogFormDialog({ mode, form, error, isSaving, onChange, onClose, onSubmit }: { mode: FormMode; form: BlogForm; error: string; isSaving: boolean; onChange: (form: BlogForm) => void; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={mode === "create" ? "Create post" : "Edit post"} eyebrow="Publishing" onClose={onClose}><form onSubmit={onSubmit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => onChange({ ...form, slug: event.target.value })} className={inputClassName} placeholder="auto-generated if blank" /></Field><Field label="Author"><input value={form.authorName} onChange={(event) => onChange({ ...form, authorName: event.target.value })} className={inputClassName} /></Field><Field label="Category"><input value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })} className={inputClassName} /></Field><Field label="Cover image URL"><input value={form.coverImage} onChange={(event) => onChange({ ...form, coverImage: event.target.value })} className={inputClassName} /></Field><Field label="Tags"><input value={form.tags} onChange={(event) => onChange({ ...form, tags: event.target.value })} className={inputClassName} /></Field><Field label="Status"><select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value as BlogPostStatus })} className={inputClassName}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></Field><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => onChange({ ...form, isFeatured: event.target.checked })} />Featured</label><label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Excerpt</span><textarea value={form.excerpt} onChange={(event) => onChange({ ...form, excerpt: event.target.value })} className={`${inputClassName} min-h-20`} /></label><label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Content</span><textarea value={form.content} onChange={(event) => onChange({ ...form, content: event.target.value })} className={`${inputClassName} min-h-48 font-mono`} /></label><Field label="SEO title"><input value={form.seoTitle} onChange={(event) => onChange({ ...form, seoTitle: event.target.value })} className={inputClassName} /></Field><Field label="SEO description"><input value={form.seoDescription} onChange={(event) => onChange({ ...form, seoDescription: event.target.value })} className={inputClassName} /></Field></div>{error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Save post"}</button></div></form></Modal>;
}

function toPayload(form: BlogForm): BlogPostPayload {
  return { title: form.title.trim(), slug: form.slug.trim() || undefined, excerpt: form.excerpt.trim(), content: form.content.trim(), coverImage: form.coverImage.trim() || undefined, authorName: form.authorName.trim(), category: form.category.trim() || undefined, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean), seoTitle: form.seoTitle.trim() || undefined, seoDescription: form.seoDescription.trim() || undefined, status: form.status, isFeatured: form.isFeatured };
}

function ViewDialog({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  return <Modal title={post.title} eyebrow="Post preview" onClose={onClose}><div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><Detail label="Author" value={post.authorName} /><Detail label="Status" value={post.status === "PUBLISHED" ? "Published" : "Draft"} /><Detail label="Category" value={post.category || "Not set"} /><Detail label="Slug" value={post.slug} /></div><p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700">{post.excerpt}</p><div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-stone-200 px-4 py-3 text-sm leading-7 text-stone-700">{post.content}</div></div></Modal>;
}

function DeleteDialog({ post, isDeleting, onCancel, onConfirm }: { post: BlogPost; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <Modal title="Confirm deletion" eyebrow="Delete blog post" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">This will remove <span className="font-bold">{post.title}</span>. Published posts disappear from the public blog immediately.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold disabled:opacity-50">Cancel</button><button onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete post"}</button></div></Modal>;
}

function Alert({ tone, message, onRetry }: { tone: "success" | "error"; message: string; onRetry?: () => void }) {
  return <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>{message}</span>{onRetry ? <button onClick={onRetry} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Retry</button> : null}</div></div>;
}
function LoadingRows() { return Array.from({ length: 6 }).map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: 6 }).map((__, cellIndex) => <td key={cellIndex} className="py-4 pr-5"><div className="h-4 animate-pulse rounded-full bg-stone-100" /></td>)}</tr>); }
function Modal({ title, eyebrow, children, onClose }: { title: string; eyebrow: string; children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6"><section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-stone-950">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button></div>{children}</section></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>; }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }

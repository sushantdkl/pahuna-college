"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogPostsAction } from "@/lib/actions/blog-post-actions";
import type { BlogPost } from "@/lib/api/blog-posts";

const fallbackImage = "/images/hero/karnali-hero.jpg";
const inputClassName =
  "rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPublishedBlogPostsAction({
        page,
        limit: 9,
        search,
        category,
      });
      setPosts(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load travel stories",
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [category, page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPosts(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadPosts]);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.category).filter(Boolean))) as string[],
    [posts],
  );

  return (
    <div className="mt-10">
      <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(query.trim()); }} className="grid gap-3 rounded-[26px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides, destinations, or stories" className={inputClassName} />
        <select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className={inputClassName} aria-label="Blog category"><option value="">All categories</option>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        <button type="submit" className="rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-black text-white hover:bg-emerald-800">Search</button>
      </form>

      {error ? <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadPosts()} className="font-bold underline">Retry</button></div> : null}

      {loading ? <div className="py-20 text-center text-sm font-bold text-stone-500">Loading published stories...</div> : posts.length ? (
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post._id} className="overflow-hidden rounded-[26px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative h-48 overflow-hidden bg-emerald-950">
                  <Image src={post.featuredImage || fallbackImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700"><span>{post.category || "Travel"}</span><span className="text-stone-300">•</span><time className="text-stone-500">{formatDate(post.publishedAt || post.createdAt)}</time></div>
                  <h2 className="mt-3 text-xl font-black leading-tight text-stone-950 group-hover:text-emerald-800">{post.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
                  {post.tags.length ? <div className="mt-4 flex flex-wrap gap-2">{post.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">#{tag}</span>)}</div> : null}
                  <span className="mt-5 inline-flex text-sm font-black text-emerald-800">Read story →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : <div className="py-20 text-center"><p className="text-lg font-black text-stone-900">No published stories found.</p><p className="mt-2 text-sm text-stone-500">Try another search or check back for new Karnali travel guides.</p></div>}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-900/10 pt-5 text-sm text-stone-500"><span>{total} published {total === 1 ? "story" : "stories"} · Page {page} of {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-full border border-emerald-200 bg-white px-5 py-2 font-bold text-emerald-800 disabled:opacity-40">Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-full border border-emerald-200 bg-white px-5 py-2 font-bold text-emerald-800 disabled:opacity-40">Next</button></div></div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

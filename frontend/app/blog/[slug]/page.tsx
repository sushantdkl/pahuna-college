"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { getPublishedBlogPostAction } from "@/lib/actions/blog-post-actions";
import type { BlogAuthor, BlogPost } from "@/lib/api/blog-posts";

const fallbackImage = "/images/hero/karnali-hero.jpg";

export default function BlogPostDetailPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    if (!params.slug) return;
    setLoading(true);
    setError("");
    try {
      const response = await getPublishedBlogPostAction(params.slug);
      setPost(response.data || null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load this blog post",
      );
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPost(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadPost]);

  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      {loading ? <div className="mx-auto flex min-h-[65vh] max-w-4xl items-center justify-center px-4 text-sm font-bold text-stone-500">Loading published story...</div> : error || !post ? (
        <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 text-center"><p className="text-2xl font-black">Story not available</p><p className="mt-3 text-sm text-stone-600">{error || "This story may be a draft or has been removed."}</p><div className="mt-6 flex gap-3"><button onClick={() => void loadPost()} className="rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800">Retry</button><Link href="/blog" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Back to blog</Link></div></div>
      ) : (
        <article>
          <section className="relative min-h-[430px] overflow-hidden bg-emerald-950">
            <Image src={post.featuredImage || fallbackImage} alt={post.title} fill priority sizes="100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent" />
            <div className="relative mx-auto flex min-h-[430px] max-w-5xl flex-col justify-end px-4 py-14 text-white sm:px-6 lg:px-8">
              <Link href="/blog" className="mb-8 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] backdrop-blur">← All stories</Link>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">{post.category || "Travel guide"}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/85">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/75"><span>By {authorName(post.authorId)}</span><time>{formatDate(post.publishedAt || post.createdAt)}</time></div>
            </div>
          </section>

          <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            {post.tags.length ? <div className="mb-8 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">#{tag}</span>)}</div> : null}
            <div className="whitespace-pre-wrap text-base leading-8 text-stone-700">{post.content}</div>
            <div className="mt-12 border-t border-emerald-900/10 pt-8"><Link href="/blog" className="inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Explore more stories</Link></div>
          </section>
        </article>
      )}
      <SiteFooter />
    </main>
  );
}

function authorName(author: string | BlogAuthor) {
  return typeof author === "string" ? "Pahuna team" : author.fullName;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

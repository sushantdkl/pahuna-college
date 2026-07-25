import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogPost, getBlogPosts, type BlogPost } from "@/lib/api/blog-posts";
import { demoBlogPosts, getBlogPostSlugs } from "@server/services";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const response = await getBlogPosts({ page: 1, limit: 50 });
    if (response.data?.length) return response.data.map((post) => ({ slug: post.slug }));
  } catch {
    return getBlogPostSlugs().map((slug) => ({ slug }));
  }

  return [];
}

async function loadPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await getBlogPost(slug);
    return response.data || null;
  } catch {
    return (demoBlogPosts as BlogPost[]).find((post) => post.slug === slug) || null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) notFound();

  return (
    <>
      <section className="bg-linear-to-br from-slate-100/80 via-indigo-50/40 to-background py-16">
        <Container>
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>

          <div className="mx-auto max-w-3xl">
            {post.category && (
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.authorName}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <article className="mx-auto max-w-3xl prose prose-neutral">
            <p className="text-lg font-medium text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
            <Separator className="my-8" />
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </article>

          <div className="mx-auto max-w-3xl mt-12">
            <Separator className="mb-8" />
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

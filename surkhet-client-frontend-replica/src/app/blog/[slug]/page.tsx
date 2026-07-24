import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag, Calendar, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { demoBlogPosts, getBlogPostSlugs } from "@server/services";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = demoBlogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = demoBlogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <>
      {/* Header */}
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

      {/* Content */}
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

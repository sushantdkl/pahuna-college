import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoBlogPosts } from "@server/services";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description:
    "Travel tips, destination guides, and insights for visiting Surkhet and the Karnali region of Nepal.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Guides",
    description: "Travel tips, destination guides, and insights for visiting Surkhet and the Karnali region of Nepal.",
  },
};

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-slate-100/80 via-indigo-50/40 to-background py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="mr-1 h-3 w-3" /> Blog & Guides
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Stories &amp; Insights
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Destination guides, travel tips, and stories from the heart of
              Karnali Province. Everything you need to plan your Surkhet
              adventure.
            </p>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {demoBlogPosts.map((post) => (
              <Card
                key={post.slug}
                className="group overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  <div className="h-full w-full relative transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <CardHeader>
                  {post.category && (
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                  )}
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.authorName}</span>
                    {post.tags && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {post.tags.slice(0, 2).join(", ")}
                      </div>
                    )}
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-primary hover:text-primary/80"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* More Content CTA */}
          <div className="mt-16 text-center rounded-2xl bg-primary/5 p-8">
            <h3 className="text-2xl font-bold">More Content Coming Soon</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              We&apos;re working on more destination guides, travel tips, and
              stories from the Karnali region. Subscribe to stay updated.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}



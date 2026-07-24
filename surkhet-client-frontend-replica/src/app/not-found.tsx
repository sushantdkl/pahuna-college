import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { GoBackButton } from "@/components/shared/go-back-button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="py-32">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <p className="text-8xl font-bold text-primary/20 leading-none">
            404
          </p>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Try going back or visiting our homepage.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/hotels">
                <Search className="mr-2 h-4 w-4" />
                Browse Hotels
              </Link>
            </Button>
          </div>
          <GoBackButton />
        </div>
      </Container>
    </section>
  );
}



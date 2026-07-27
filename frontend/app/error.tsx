"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to analytics/monitoring in production
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="py-32">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We encountered an unexpected error. This has been logged and our
            team will look into it.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground/60 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button onClick={reset} variant="default">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}



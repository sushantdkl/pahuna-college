import { Container } from "@/components/layout";

export default function HotelsLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-linear-to-br from-primary/[0.06] via-primary/[0.03] to-background py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <div className="mx-auto h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </Container>
      </div>
      {/* Grid skeleton */}
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}



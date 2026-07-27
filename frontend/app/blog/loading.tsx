import { Container } from "@/components/layout";

export default function BlogLoading() {
  return (
    <>
      <div className="bg-linear-to-br from-primary/10 via-primary/5 to-background py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <div className="mx-auto h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-10 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-5 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </Container>
      </div>
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}



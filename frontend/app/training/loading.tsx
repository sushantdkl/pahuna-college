import { Container } from "@/components/layout";

export default function TrainingLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-gray-900 py-28 lg:py-32">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-white/5"
                />
              ))}
            </div>
          </div>
        </Container>
      </div>
      {/* Course cards skeleton */}
      <Container className="py-24">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border bg-muted/30"
            />
          ))}
        </div>
      </Container>
    </>
  );
}



import { Container } from "@/components/layout";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-busy="true">
      <Container>
        <div className="mx-auto max-w-md text-center">
          {/* Animated spinner */}
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      </Container>
    </div>
  );
}



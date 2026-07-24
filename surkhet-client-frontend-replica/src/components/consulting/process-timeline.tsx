import { Container } from "@/components/layout";
import { consultingProcess } from "@server/services";

export function ProcessTimeline() {
  return (
    <section className="py-16 bg-muted/30">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            How We Work
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            A structured, transparent process from first conversation to
            measurable results.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

          <div className="space-y-8">
            {consultingProcess.map((item) => (
              <div
                key={item.step}
                className="relative sm:pl-16"
              >
                {/* Dot */}
                <div className="hidden sm:flex absolute left-4 top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-primary/20 -translate-x-1/2 items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>

                <div className="rounded-xl border bg-background p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {item.step}
                      </span>
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground sm:pl-0">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}



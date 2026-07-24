import { SectionShell } from "@/app/_components/pahuna-layout";

export default function HotelsLoading() {
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20">
        <SectionShell className="py-0">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded bg-stone-200" />
            <div className="mx-auto h-10 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-stone-100" />
          </div>
        </SectionShell>
      </div>

      <SectionShell>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[8px] border border-stone-200 bg-white">
              <div className="aspect-[4/3] animate-pulse bg-stone-100" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-100" />
                <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </>
  );
}

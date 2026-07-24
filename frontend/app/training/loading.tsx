import { SectionShell } from "@/app/_components/pahuna-layout";

export default function TrainingLoading() {
  return (
    <>
      <div className="bg-[#081124] py-20">
        <SectionShell className="py-0">
          <div className="max-w-3xl space-y-4">
            <div className="h-4 w-44 animate-pulse rounded bg-white/20" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-white/20" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        </SectionShell>
      </div>
      <SectionShell>
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="h-5 w-1/2 animate-pulse rounded bg-stone-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-stone-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </SectionShell>
    </>
  );
}

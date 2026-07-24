import Link from "next/link";
import { PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";

const roadmap = [
  ["Live", "Public tourism UI", "Homepage, stays, food, destinations, routes, training, consulting, and partner flows."],
  ["Live", "Final CRUD foundation", "The agreed core modules remain the active backend and dashboard scope."],
  ["In progress", "Provider verification", "Improve consent-safe listing confidence and map coverage as verified coordinates are added."],
  ["Next", "Route intelligence", "Add richer route context when transport route and segment data grows."],
  ["Next", "Human-reviewed planning", "Strengthen inquiry triage for customized Karnali travel plans."],
];

export default function RoadmapPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-[#081124] text-white">
        <SectionShell className="py-20 text-center">
          <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/75">Product roadmap</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Pahuna Platform Roadmap</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70">A public summary of what is live, what is being verified, and what comes next for Karnali tourism planning.</p>
        </SectionShell>
      </section>
      <SectionShell>
        <div className="grid gap-4 md:grid-cols-3">
          <Stat value="15" label="core CRUD modules" />
          <Stat value="OSM" label="interactive map standard" />
          <Stat value="Inquiry" label="public conversion flow" />
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {roadmap.map(([status, title, description]) => (
            <article key={title} className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm">
              <span className={`rounded-full px-3 py-1 text-xs font-black ${status === "Live" ? "bg-emerald-100 text-emerald-800" : status === "In progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-900"}`}>{status}</span>
              <h2 className="mt-4 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">{description}</p>
            </article>
          ))}
          <Link href="/contact" className="inline-flex rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Suggest an improvement</Link>
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-[8px] border border-emerald-100 bg-white p-5 text-center shadow-sm"><p className="text-3xl font-black text-emerald-700">{value}</p><p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-stone-500">{label}</p></div>;
}

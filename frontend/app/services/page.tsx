import { SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";

const services = ["Stay discovery", "Route and cost planning", "Food and cafe guidance", "Destination planning", "Travel inquiry support", "Local provider visibility"];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <SectionShell className="pt-16">
        <SectionHeader eyebrow="Services" title="Simple Pahuna services for travelers and local providers." description="A frontend-safe service overview page. No backend/admin flow changed." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <div key={service} className="rounded-[26px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">{service}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">Designed to make Surkhet-first Karnali tourism easier to understand and use.</p>
            </div>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}
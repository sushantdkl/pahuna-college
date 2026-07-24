import {
  ButtonLink,
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/components/pahuna-layout";
import { ConsultingClient } from "./consulting-client";

export default function ConsultingPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-br from-[#071121] via-slate-900 to-emerald-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-white/75">Hospitality business consultation</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Grow Your <br /><span className="text-emerald-300">Hospitality</span> Business</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Expert consulting for hotels, cafes, restaurants, and tourism operators in Nepal.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#request">Book Free Consultation</ButtonLink>
              <ButtonLink href="tel:+977083520000" variant="secondary">+977-083-520000</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["40+", "25%", "500+", "92%", "7", "Karnali"].map((value) => <div key={value} className="rounded-[8px] border border-white/15 bg-white/8 p-6 text-center"><p className="text-2xl font-black text-emerald-300">{value}</p><p className="mt-2 text-xs text-white/60">consulting metric</p></div>)}
          </div>
        </div>
      </section>
      <SectionShell className="pt-16">
        <div className="text-center">
          <h2 className="text-3xl font-black">Our Consulting Services</h2>
          <p className="mt-3 text-sm text-stone-600">Services are pulled from the active ConsultingService backend.</p>
        </div>
        <ConsultingClient />
      </SectionShell>
      <section className="bg-white">
        <SectionShell>
          <SectionHeader align="center" eyebrow="Real results" title="Case Studies" description="Static presentation cards retained from the reference without adding CaseStudy CRUD." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["Hotel Karnali View", "Improved room conversion, staff workflow, and package positioning."],
              ["Bulbule Cafe", "Menu engineering and local marketing raised repeat visitors."],
              ["Karnali Heritage Resort", "Operations audit helped simplify costs and guest communication."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[8px] border border-stone-200 bg-white shadow-sm">
                <div className="rounded-t-[8px] bg-[#071121] p-5 text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-200">Case study</p>
                  <h3 className="mt-2 text-lg font-black">{title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-6 text-stone-600">{text}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-[8px] bg-emerald-50 p-3"><p className="font-black text-emerald-700">42%</p><p className="text-xs text-stone-500">growth signal</p></div>
                    <div className="rounded-[8px] bg-amber-50 p-3"><p className="font-black text-amber-700">30 days</p><p className="text-xs text-stone-500">review cycle</p></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionShell>
      </section>
      <SectionShell className="pt-8">
        <SectionHeader align="center" eyebrow="Trusted by operators" title="What Our Clients Say" />
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {["Hotel owner", "Cafe founder", "Resort manager", "Tour operator"].map((role) => (
            <article key={role} className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-amber-500">*****</p>
              <p className="mt-3 text-sm leading-6 text-stone-600">The advice was practical, local, and easy for our team to implement.</p>
              <p className="mt-4 text-sm font-black">{role}</p>
            </article>
          ))}
        </div>
      </SectionShell>
      <section className="bg-emerald-50/60">
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <SectionHeader eyebrow="Why businesses choose us" title="Local hospitality growth support" description="Training, systems, service quality, pricing, and digital presence are reviewed together so operators get a usable plan." />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Nepal-first expertise", "Measurable results", "Built for Karnali", "Technology forward"].map((item) => (
                  <div key={item} className="rounded-[8px] border border-emerald-100 bg-white p-4 text-sm font-black">{item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-[8px] border border-emerald-200 bg-white p-6 text-center shadow-sm">
              <h3 className="text-xl font-black">Free Discovery Call</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">Book a short consultation and get a practical next-step recommendation.</p>
              <div className="mt-6 grid gap-2">
                <ButtonLink href="#request">Book Free Call</ButtonLink>
                <ButtonLink href="tel:+977083520000" variant="secondary">Call Now</ButtonLink>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>
      <SiteFooter />
    </PageShell>
  );
}

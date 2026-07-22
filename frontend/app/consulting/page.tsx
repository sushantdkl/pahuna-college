import {
  ButtonLink,
  PageShell,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
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
      <SiteFooter />
    </PageShell>
  );
}

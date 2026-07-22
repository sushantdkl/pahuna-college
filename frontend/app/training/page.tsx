import {
  ButtonLink,
  PageShell,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { TrainingClient } from "./training-client";

export default function TrainingPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-br from-[#071121] via-slate-900 to-emerald-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-white/75">Hospitality training academy</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Launch Your <br /><span className="text-emerald-300">Hospitality Career</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Professional courses in tourism, hotels, housekeeping, front desk, food service, and service excellence.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#enrollment">View Courses</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Need Help?</ButtonLink>
          </div>
        </div>
      </section>
      <div className="grid border-b border-stone-200 bg-white text-center sm:grid-cols-5">
        {["500+", "92%", "6+", "25+", "4.8/5"].map((value) => <div key={value} className="border-r border-stone-100 px-4 py-5 last:border-r-0"><p className="text-xl font-black text-emerald-700">{value}</p><p className="mt-1 text-xs text-stone-500">training metric</p></div>)}
      </div>
      <SectionShell className="pt-16">
        <div className="text-center">
          <h2 className="text-3xl font-black">Why Train With Us?</h2>
          <p className="mt-3 text-sm text-stone-600">We prepare you for the real world of hospitality.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Industry Certified Instructors", "Job Placement Assistance", "Hands-On Practical Training", "Recognized Certificates", "Small Batch Sizes", "Affordable & Flexible"].map((item) => (
            <div key={item} className="rounded-[8px] border border-stone-100 bg-white p-5 shadow-sm"><h3 className="font-black">{item}</h3><p className="mt-2 text-sm text-stone-600">Learn with practical modules and local market context.</p></div>
          ))}
        </div>
        <TrainingClient />
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

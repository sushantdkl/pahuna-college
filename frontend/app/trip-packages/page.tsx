import {
  ButtonLink,
  PageHero,
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/components/pahuna-layout";
import { images } from "@/lib/pahuna-content";
import { TripPackagesClient } from "./trip-packages-client";

export default function TripPackagesPage() {
  return (
    <PageShell>
      <SiteHeader />
      <PageHero
        eyebrow="Curated Karnali packages"
        title="Trip packages for Surkhet and beyond"
        description="Browse package ideas with duration, price, highlights, and a protected reserve inquiry flow connected to TripPackage management."
        image={images.rara}
      >
        <ButtonLink href="#packages">View Packages</ButtonLink>
        <ButtonLink href="/contact" variant="ghost">Ask Custom Package</ButtonLink>
      </PageHero>
      <SectionShell id="packages" className="pt-16">
        <SectionHeader
          eyebrow="Trip Packages"
          title="Ready-made Karnali package ideas for families, groups, and explorers."
          description="Browse active Pahuna packages publicly. Reserving a package creates a protected travel-support inquiry for the admin team."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {["Duration", "Price in NPR", "Highlights", "Reserve inquiry"].map((item) => (
            <div key={item} className="rounded-[8px] border border-emerald-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-stone-950">{item}</p>
              <p className="mt-2 text-xs leading-5 text-stone-600">Shown in the reference-style package cards below.</p>
            </div>
          ))}
        </div>
        <TripPackagesClient />
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

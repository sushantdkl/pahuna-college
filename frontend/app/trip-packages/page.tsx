import {
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { TripPackagesClient } from "./trip-packages-client";

export default function TripPackagesPage() {
  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-16">
        <SectionHeader
          eyebrow="Trip Packages"
          title="Ready-made Karnali package ideas for families, groups, and explorers."
          description="Browse active Pahuna packages publicly. Reserving a package creates a protected travel-support inquiry for the admin team."
        />
        <TripPackagesClient />
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

import {
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { TrainingClient } from "./training-client";

export default function TrainingPage() {
  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-16">
        <SectionHeader
          eyebrow="Training"
          title="Practical tourism and hospitality courses for Karnali providers."
          description="Browse active Pahuna training courses and submit an enrollment request when a course fits your goals."
        />
        <TrainingClient />
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

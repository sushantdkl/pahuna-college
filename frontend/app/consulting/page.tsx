import {
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { ConsultingClient } from "./consulting-client";

export default function ConsultingPage() {
  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-16">
        <SectionHeader
          eyebrow="Consulting"
          title="Growth support for hotels, homestays, tourism teams, and local providers."
          description="Explore active Pahuna consulting services and send a public request for onboarding, marketing, operations, or digital support."
        />
        <ConsultingClient />
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

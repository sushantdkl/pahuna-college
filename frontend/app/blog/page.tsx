import {
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { BlogListing } from "./blog-listing";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <SectionShell className="pt-16">
        <SectionHeader
          eyebrow="Blog"
          title="Traveler journal and practical Karnali notes."
          description="Published guides, destination stories, and useful planning notes from Pahuna."
        />
        <BlogListing />
      </SectionShell>
      <SiteFooter />
    </main>
  );
}

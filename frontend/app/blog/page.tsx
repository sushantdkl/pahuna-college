import { SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";

const posts = [
  "How to use Surkhet as your Karnali base",
  "What to confirm before a Rara trip",
  "Short Surkhet plan for first-time visitors",
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <SectionShell className="pt-16">
        <SectionHeader eyebrow="Blog" title="Traveler journal and practical notes." description="Static-friendly blog landing UI for future posts and travel updates." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post} className="rounded-[26px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Guide</p>
              <h2 className="mt-3 text-xl font-black">{post}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">Prepared as a clean UI card; connect to CMS/blog data later without changing the layout.</p>
            </article>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}
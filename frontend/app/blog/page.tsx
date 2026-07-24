import Link from "next/link";
import { PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";

const stories = [
  {
    tag: "Destination guide",
    title: "Why Surkhet Should Be Your Next Travel Destination",
    text: "Explore the gateway city that connects Surkhet, Karnali routes, lakes, temples, local food, and onward Himalayan journeys.",
  },
  {
    tag: "Travel tips",
    title: "10 Things to Do in Birendranagar",
    text: "A practical city guide for first-time visitors, from morning walks to local cafes and easy cultural stops.",
  },
  {
    tag: "Karnali route",
    title: "A Complete Guide to Karnali Province for First-Time Visitors",
    text: "Planning notes for Rara, Phoksundo, Dailekh, Jumla, and the routes that begin around Surkhet.",
  },
];

export default function BlogPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-b from-white to-[#fffaf0] px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="mx-auto inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Blog & insights</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight">Stories & Insights</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600">Local travel guides, route tips, and stories from the heart of Karnali. Everything you need to plan your Surkhet adventure.</p>
      </section>

      <SectionShell className="pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <article key={story.title} className="overflow-hidden rounded-[8px] border border-stone-200 bg-white shadow-sm">
              <div className="grid h-48 place-items-center bg-amber-50">
                <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-emerald-700 text-5xl font-light text-amber-500">+</div>
              </div>
              <div className="p-5">
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">{story.tag}</span>
                <h2 className="mt-4 text-lg font-black">{story.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{story.text}</p>
                <Link href="/contact" className="mt-5 inline-flex text-sm font-black text-emerald-800">Read More +</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-5xl rounded-[8px] bg-emerald-50 px-6 py-8 text-center">
          <h2 className="text-lg font-black">More Content Coming Soon</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-stone-600">We are working on more destination guides, travel tips, and stories from the Karnali region. Subscribe for blog updates.</p>
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

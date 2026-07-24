import Link from "next/link";
import { PageShell, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";

const sections = [
  ["Information we collect", "Pahuna collects account, inquiry, partner application, training enrollment, consulting lead, and public form details that you choose to submit."],
  ["How we use information", "We use submitted information to respond to travel, stay, food, route, training, partner, and consulting requests and to operate the final active CRUD modules."],
  ["No newsletter claim", "This site does not rely on an active newsletter subscriber CRUD in the public flow. Contact and inquiry CTAs are used instead."],
  ["Maps and locations", "Interactive tourism maps use OpenStreetMap and React Leaflet. The Contact page uses the supplied Google Maps iframe only for the office location section."],
  ["Authentication", "Login cookies and tokens are used to keep authenticated user and admin flows protected. Logout happens only from explicit logout actions."],
  ["Contact", "For privacy questions, contact Pahuna through the public Contact page."],
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-b from-white to-[#fffaf0]">
        <SectionShell className="py-16 text-center">
          <p className="mx-auto inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Privacy</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600">How Pahuna handles public inquiries, account data, partner applications, and training enrollment information.</p>
        </SectionShell>
      </section>
      <SectionShell>
        <div className="mx-auto max-w-3xl space-y-4">
          {sections.map(([title, text]) => (
            <section key={title} className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
            </section>
          ))}
          <Link href="/contact" className="inline-flex rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Contact Pahuna</Link>
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

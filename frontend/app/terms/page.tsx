import Link from "next/link";
import { PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";

const terms = [
  ["Inquiry-first platform", "Pahuna presents public tourism, stay, food, destination, route, training, consulting, and partner information for planning and inquiry. Final availability and commercial details must be confirmed."],
  ["Routes and costs", "Route times, prices, flights, road condition, and operator schedules can change due to weather, season, and local conditions."],
  ["Listings and verification", "Some records are verified while others are public planning listings. Direct contact details should only be used where consent and verification rules allow."],
  ["Accounts and dashboards", "Users and admins must use their own credentials. Admin routes and CRUD actions remain protected by the current backend and frontend flow."],
  ["Training and consulting", "Training enrollments and consulting leads are requests for follow-up unless confirmed by the Pahuna team."],
  ["Responsible use", "Do not misuse forms, attempt unauthorized access, or rely on route information without local confirmation."],
];

export default function TermsPage() {
  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="py-16 text-center">
        <SectionHeader align="center" eyebrow="Legal" title="Terms & Conditions" description="Clear terms for using Pahuna's public tourism, inquiry, training, consulting, and partner flows." />
      </SectionShell>
      <section className="bg-white">
        <SectionShell>
          <div className="mx-auto max-w-3xl space-y-4">
            {terms.map(([title, text]) => (
              <section key={title} className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
              </section>
            ))}
            <Link href="/contact" className="inline-flex rounded-md border border-emerald-200 px-5 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Ask a question</Link>
          </div>
        </SectionShell>
      </section>
      <SiteFooter />
    </PageShell>
  );
}

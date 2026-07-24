import Link from "next/link";
import { PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";

const faqItems = [
  {
    question: "Where is the booking service located?",
    answer: "Pahuna is based around Birendranagar, Surkhet, and helps travelers compare Karnali stays, food, destinations, training, consulting, and routes.",
  },
  {
    question: "Are these stays and food places verified?",
    answer: "Some listings are verified and others are public planning records. Availability, price, opening hours, and direct contact details should be confirmed through inquiry before travel.",
  },
  {
    question: "Do you offer accommodation for students from outside Surkhet?",
    answer: "Training students and hospitality partners can contact Pahuna for guidance on nearby stays and practical local support.",
  },
  {
    question: "Is Karnali route information always accurate?",
    answer: "Route times, weather, transport frequency, and operator schedules can change quickly. Pahuna presents planning estimates and encourages local confirmation.",
  },
  {
    question: "Can I use Pahuna for business?",
    answer: "Yes. Hospitality businesses can use the consulting, partner, training, and inquiry flows to connect with the Pahuna team.",
  },
  {
    question: "What if I cannot complete the online form?",
    answer: "Use the Contact page to call or email the team. The public forms remain the best way to send structured trip, food, stay, partner, and consulting details.",
  },
];

export default function FAQPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-b from-white to-[#fffaf0]">
        <SectionShell className="py-16 text-center">
          <p className="mx-auto inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
            Help center
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600">Common questions about Pahuna&apos;s public tourism, training, consulting, and inquiry flows.</p>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="mx-auto max-w-3xl">
          <SectionHeader align="center" eyebrow="Quick answers" title="Before you plan or submit an inquiry" />
          <div className="mt-8 divide-y divide-stone-200 rounded-[8px] border border-stone-200 bg-white shadow-sm">
            {faqItems.map((item, index) => (
              <details key={item.question} className="group p-5" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-stone-950 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="text-lg text-emerald-700 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 rounded-[8px] border border-emerald-100 bg-emerald-50 p-6 text-center">
            <h2 className="text-2xl font-black">Need a human answer?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">Send the team a message and Pahuna will route it through the correct inquiry flow.</p>
            <Link href="/contact" className="mt-5 inline-flex rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">
              Contact Pahuna
            </Link>
          </div>
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

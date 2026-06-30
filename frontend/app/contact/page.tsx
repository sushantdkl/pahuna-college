import Image from "next/image";
import { SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { images } from "@/lib/pahuna-content";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <SectionShell className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Contact Pahuna"
              title="Ask before you book."
              description="Use this page for stay availability, Surkhet questions, food stops, route planning, or a custom Karnali inquiry."
            />
            <div className="mt-8 overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
              <div className="relative h-64">
                <Image src={images.bheriBridge} alt="Bheri River route near Surkhet" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
              <div className="space-y-4 p-6 text-sm leading-6 text-stone-600">
                <p><strong className="text-stone-900">Email:</strong> hello@pahuna.com</p>
                <p><strong className="text-stone-900">Location:</strong> Surkhet / Karnali gateway</p>
                <p><strong className="text-stone-900">Response:</strong> Availability and route details should be confirmed before booking.</p>
              </div>
            </div>
          </div>
          <form action="mailto:hello@pahuna.com" method="post" encType="text/plain" className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" placeholder="Full name" />
              <input name="contact" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" placeholder="Phone or email" />
              <input name="topic" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:col-span-2" placeholder="Trip / stay / route topic" />
              <textarea name="message" className="min-h-36 rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:col-span-2" placeholder="Tell us what you need help with" />
            </div>
            <button type="submit" className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800">
              Send Inquiry
            </button>
          </form>
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}

import { GeneralContactForm } from "@/app/contact/general-contact-form";
import { HotelInquiryForm } from "@/app/contact/hotel-inquiry-form";
import { SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import type { InquiryKind } from "@/schemas/inquiry.schema";

type ContactSearchParams = Promise<{
  topic?: string | string[];
  hotel?: string | string[];
  type?: string | string[];
}>;

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

const hotelInquiryTypes = new Set<InquiryKind>([
  "HOTEL",
  "AVAILABILITY",
  "BOOKING",
  "RESERVATION",
]);

const contactCards = [
  ["\u{1F4CD}", "Visit Us", "Birendranagar, Surkhet, Karnali Province, Nepal"],
  ["\u{1F4DE}", "Call Us", "+977-083-520000"],
  ["\u{2709}\u{FE0F}", "Email Us", "hello@pahuna.com"],
  ["\u{1F552}", "Office Hours", "Sun - Fri: 9:00 AM - 6:00 PM (Nepal Time)"],
];

const softwaricaMapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3609923548934!2d85.32740427638603!3d27.70613837618334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a74aa1f23%3A0x74ebef82ad0e5c15!2sSoftwarica%20College%20of%20IT%20and%20E-Commerce!5e0!3m2!1sen!2snp!4v1784867879176!5m2!1sen!2snp";
const softwaricaDirectionsHref = "https://www.google.com/maps/search/?api=1&query=Softwarica%20College%20of%20IT%20and%20E-Commerce%2C%20Dillibazar%2C%20Kathmandu%2C%20Nepal";

export default async function ContactPage({ searchParams }: { searchParams: ContactSearchParams }) {
  const params = await searchParams;
  const hotelName = firstValue(params.hotel);
  const topic = firstValue(params.topic) || (hotelName ? `Availability for ${hotelName}` : "");
  const requestedType = firstValue(params.type) as InquiryKind | undefined;
  const inquiryType = requestedType && hotelInquiryTypes.has(requestedType)
    ? requestedType
    : "AVAILABILITY";

  return (
    <main className="min-h-screen bg-white text-stone-950">
      <SiteHeader />
      <section className="border-b border-stone-100 bg-white px-4 pb-28 pt-10 text-center sm:px-6 sm:pb-32 lg:px-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-[40px]">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600">Have a question, feedback, or business inquiry? We&apos;d love to hear from you. Fill out the form below or reach us directly.</p>
      </section>

      <section className="mx-auto -mt-16 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map(([icon, title, text]) => (
            <div key={title} className="min-h-[172px] rounded-[8px] border border-stone-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg" aria-hidden="true">{icon}</div>
              <h2 className="mt-4 text-sm font-black">{title}</h2>
              <p className="mx-auto mt-2 max-w-[170px] text-xs leading-5 text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fbfaf7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Send Us a Message</h2>
          <p className="mt-5 text-sm text-stone-600">We typically respond within 24 hours.</p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          {hotelName ? (
            <HotelInquiryForm hotelName={hotelName} initialTitle={topic} inquiryType={inquiryType} />
          ) : (
            <GeneralContactForm initialSubject={topic} />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Our Location</h2>
          <p className="mt-5 text-sm text-stone-600">Visit us at our office in Birendranagar, Surkhet</p>
        </div>
        <div className="mt-9 grid gap-5 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="h-[300px] overflow-hidden rounded-[8px] border border-stone-200 bg-white shadow-sm sm:h-[360px] lg:h-[430px]">
            <iframe
              src={softwaricaMapSrc}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Softwarica College of IT and E-Commerce location"
              className="block h-full w-full"
            />
          </div>
          <aside className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm lg:min-h-[430px]">
            <h3 className="text-base font-black">Find Us</h3>
            <p className="mt-3 text-xs leading-5 text-stone-600">Pahuna Tourism Office, Birendranagar</p>
            <div className="mt-5 grid gap-4 text-xs text-stone-600">
              <p className="flex gap-3"><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">{"\u{1F4CD}"}</span><span><strong className="block text-[10px] uppercase tracking-wide text-stone-500">Address</strong><span className="font-bold text-stone-900">Birendranagar, Surkhet, Karnali Province, Nepal</span></span></p>
              <p className="flex gap-3"><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">{"\u{1F4DE}"}</span><span><strong className="block text-[10px] uppercase tracking-wide text-stone-500">Phone</strong><a href="tel:+977083520000" className="font-bold text-stone-900 hover:text-emerald-700">+977-083-520000</a></span></p>
              <p className="flex gap-3"><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">{"\u{2709}\u{FE0F}"}</span><span><strong className="block text-[10px] uppercase tracking-wide text-stone-500">Email</strong><a href="mailto:hello@pahuna.com" className="break-all font-bold text-stone-900 hover:text-emerald-700">hello@pahuna.com</a></span></p>
              <p className="flex gap-3"><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">{"\u{1F552}"}</span><span><strong className="block text-[10px] uppercase tracking-wide text-stone-500">Hours</strong><span className="font-bold text-stone-900">Sun - Fri: 9 AM - 6 PM (NPT)</span></span></p>
            </div>
            <div className="mt-6 grid gap-2">
              <a href={softwaricaDirectionsHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-xs font-black text-white transition hover:bg-emerald-800">{"\u{1F9ED}"} Open in Google Maps</a>
              <a href="tel:+977083520000" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-emerald-700 px-4 text-xs font-black text-emerald-800 transition hover:bg-emerald-50">{"\u{1F4DE}"} Call Us</a>
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

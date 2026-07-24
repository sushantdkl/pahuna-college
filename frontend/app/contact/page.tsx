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
  ["📍", "Visit Us", "Birendranagar, Surkhet, Karnali Province, Nepal"],
  ["☎️", "Call Us", "+977-083-520000"],
  ["✉️", "Email Us", "hello@pahuna.com"],
  ["🕒", "Office Hours", "Sun - Fri, 10:00 AM - 6:00 PM"],
];

const softwaricaMapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3609923548934!2d85.32740427638603!3d27.70613837618334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a74aa1f23%3A0x74ebef82ad0e5c15!2sSoftwarica%20College%20of%20IT%20and%20E-Commerce!5e0!3m2!1sen!2snp!4v1784867879176!5m2!1sen!2snp";

export default async function ContactPage({ searchParams }: { searchParams: ContactSearchParams }) {
  const params = await searchParams;
  const hotelName = firstValue(params.hotel);
  const topic = firstValue(params.topic) || (hotelName ? `Availability for ${hotelName}` : "");
  const requestedType = firstValue(params.type) as InquiryKind | undefined;
  const inquiryType = requestedType && hotelInquiryTypes.has(requestedType)
    ? requestedType
    : "AVAILABILITY";

  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <section className="bg-gradient-to-b from-white to-[#fffaf0] px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600">Have a question, feedback, or business inquiry? We&apos;d love to hear from you. Fill out the form below or reach us directly.</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {contactCards.map(([icon, title, text]) => (
            <div key={title} className="rounded-[8px] border border-stone-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-lg" aria-hidden="true">{icon}</div>
              <h2 className="mt-4 font-black">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/55 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black">Send Us a Message</h2>
          <p className="mt-3 text-sm text-stone-600">We typically respond within 24 hours.</p>
        </div>
        <div className="mx-auto mt-8 max-w-xl">
          {hotelName ? (
            <HotelInquiryForm hotelName={hotelName} initialTitle={topic} inquiryType={inquiryType} />
          ) : (
            <GeneralContactForm initialSubject={topic} />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black">Our Location</h2>
          <p className="mt-3 text-sm text-stone-600">Visit us at our office in Birendranagar, Surkhet.</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-[8px] border border-stone-200 bg-white shadow-sm">
            <iframe
              src={softwaricaMapSrc}
              width="600"
              height="450"
              style={{ border: 0, width: "100%", height: "100%", minHeight: 340 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Softwarica College of IT and E-Commerce location"
              className="block h-[300px] w-full sm:h-[380px] lg:h-[420px]"
            />
          </div>
          <aside className="h-fit rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="font-black">Find Us</h3>
            <div className="mt-4 grid gap-3 text-sm text-stone-600">
              <p><strong className="text-stone-900">📍 Address:</strong><br />Softwarica College of IT and E-Commerce, Kathmandu, Nepal</p>
              <p><strong className="text-stone-900">☎️ Phone:</strong><br />+977-083-520000</p>
              <p><strong className="text-stone-900">✉️ Email:</strong><br />hello@pahuna.com</p>
              <p><strong className="text-stone-900">🕒 Hours:</strong><br />Sun - Fri, 10 AM - 6 PM</p>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=Softwarica%20College%20of%20IT%20and%20E-Commerce" target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white">🧭 Get Directions</a>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

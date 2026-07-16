import Image from "next/image";
import { SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { GeneralContactForm } from "@/app/contact/general-contact-form";
import { HotelInquiryForm } from "@/app/contact/hotel-inquiry-form";
import { images } from "@/lib/pahuna-content";
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
          {hotelName ? (
            <HotelInquiryForm hotelName={hotelName} initialTitle={topic} inquiryType={inquiryType} />
          ) : (
            <GeneralContactForm initialSubject={topic} />
          )}
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}

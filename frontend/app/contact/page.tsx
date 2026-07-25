import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@server/lib/constants";
import { ContactForm } from "@/components/forms/contact-form";
import { JsonLd, localBusinessJsonLd } from "@server/lib/structured-data";
import { contactCopy } from "@server/data/site-copy";
import { ContactMapSectionClient } from "@/components/maps/contact-map-client";

export const metadata: Metadata = {
  title: contactCopy.metadata.title,
  description: contactCopy.metadata.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: contactCopy.metadata.ogTitle,
    description: contactCopy.metadata.ogDescription,
  },
};

const contactInfo = [
  {
    title: contactCopy.contactCards.visit.title,
    description: SITE_CONFIG.address,
    icon: MapPin,
  },
  {
    title: contactCopy.contactCards.call.title,
    description: SITE_CONFIG.phone,
    icon: Phone,
  },
  {
    title: contactCopy.contactCards.email.title,
    description: SITE_CONFIG.email,
    icon: Mail,
  },
  {
    title: contactCopy.contactCards.hours.title,
    description: contactCopy.contactCards.hours.description,
    icon: Clock,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd data={localBusinessJsonLd()} />

      {/* Hero */}
      <section className="relative bg-linear-to-b from-slate-100/60 via-indigo-50/30 to-background py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
              {contactCopy.hero.heading}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {contactCopy.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => (
              <Card key={info.title} className="text-center hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{info.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              title={contactCopy.form.title}
              subtitle={contactCopy.form.subtitle}
            />
            <ContactForm />
          </div>
        </Container>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <Container>
          <SectionHeader
            title="Our Location"
            subtitle="Visit us at our office in Birendranagar, Surkhet"
          />
          <ContactMapSectionClient />
        </Container>
      </section>
    </>
  );
}



import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { Container } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@server/services";
import { JsonLd, faqPageJsonLd } from "@server/lib/structured-data";
import { faqCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: faqCopy.metadata.title,
  description: faqCopy.metadata.description,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: faqCopy.metadata.ogTitle,
    description: faqCopy.metadata.ogDescription,
  },
};

export default function FAQPage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd
        data={faqPageJsonLd(
          faqItems.map((f) => ({ question: f.question, answer: f.answer }))
        )}
      />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-slate-100/80 via-indigo-50/40 to-background py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="mr-1 h-3 w-3" /> FAQ
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {faqCopy.hero.heading}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {faqCopy.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a
                href="/contact"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Contact us
              </a>{" "}
              and we&apos;ll be happy to help.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}



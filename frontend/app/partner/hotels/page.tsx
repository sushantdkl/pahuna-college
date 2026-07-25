import type { Metadata } from "next";
import Link from "next/link";
import {
  Hotel,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Users,
  Globe,
  Shield,
  Star,
  PhoneCall,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HotelLeadForm } from "@/components/forms/hotel-lead-form";

export const metadata: Metadata = {
  title: "List Your Hotel — Partner With Pahuna",
  description:
    "Get your hotel listed on Pahuna. Receive qualified booking inquiries, boost visibility, and grow your business with our tourism platform.",
  alternates: { canonical: "/partner/hotels" },
  openGraph: {
    title: "List Your Hotel — Partner With Pahuna",
    description: "Get your hotel listed on Surkhet’s #1 hospitality platform.",
  },
};

const benefits = [
  {
    icon: TrendingUp,
    title: "More Bookings",
    description:
      "Receive direct booking inquiries from qualified travelers exploring Surkhet.",
  },
  {
    icon: Globe,
    title: "Online Presence",
    description:
      "Get a dedicated listing page with professional photography support.",
  },
  {
    icon: BarChart3,
    title: "Business Insights",
    description:
      "Track inquiries, views, and conversion data through your partner dashboard.",
  },
  {
    icon: Users,
    title: "Guest Network",
    description:
      "Access a growing community of domestic and international travelers.",
  },
  {
    icon: Shield,
    title: "Verified Badge",
    description:
      "Build trust with guests through our verification and review system.",
  },
  {
    icon: Star,
    title: "Featured Placement",
    description:
      "Eligible for homepage and category page featured placements.",
  },
];

const steps = [
  {
    step: "1",
    title: "Submit Your Details",
    description:
      "Fill out the form below with your property information and contact details.",
  },
  {
    step: "2",
    title: "Our Team Reviews",
    description:
      "We review your application, verify details, and may visit your property.",
  },
  {
    step: "3",
    title: "Go Live",
    description:
      "Your listing goes live on our platform. Start receiving booking inquiries!",
  },
];

export default function HotelPartnerPage() {
  return (
    <>
      <PageHero
        title="List Your Hotel on Pahuna"
        subtitle="Join Surkhet's premier tourism platform. Get qualified booking inquiries, increase your visibility, and grow your hospitality business with zero upfront cost."
        variant="gradient"
      />

      {/* ── WHY LIST ── */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title="Why List With Us?"
            subtitle="Join the growing network of hospitality partners building Surkhet's tourism future"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-muted/30">
        <Container>
          <SectionHeader
            title="How It Works"
            subtitle="Three simple steps to get your hotel online"
          />
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── LEAD CAPTURE FORM ── */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">
                Ready to Grow Your Business?
              </h2>
              <p className="text-muted-foreground">
                Fill out the form and our partnerships team will get in touch
                within 24 hours. No obligations, no upfront costs.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "Zero listing fees in Phase 1",
                  "Dedicated account manager",
                  "Professional listing creation support",
                  "Ongoing marketing and visibility assistance",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Card className="bg-primary/5 border-primary/20 mt-6">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <PhoneCall className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">
                      Prefer to talk?
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Call us at{" "}
                    <a
                      href="tel:+977-083-123456"
                      className="text-primary hover:underline font-medium"
                    >
                      083-123456
                    </a>{" "}
                    or email{" "}
                    <a
                      href="mailto:partners@pahuna.com"
                      className="text-primary hover:underline font-medium"
                    >
                      partners@pahuna.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-primary" />
                    Hotel Listing Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HotelLeadForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ-ISH ── */}
      <section className="py-16 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is there a cost to list my hotel?",
                  a: "No. During our launch phase, all hotel listings are completely free. We may introduce optional premium features later, but your base listing will always be free.",
                },
                {
                  q: "How do bookings work?",
                  a: "We operate an inquiry-first model. Guests submit booking inquiries through our platform, and we connect them with you. You handle the final confirmation and payment — we assist with the process.",
                },
                {
                  q: "What if my hotel is small or budget-category?",
                  a: "We welcome all property types — from budget guesthouses to premium resorts. Surkhet needs diverse accommodation options for different traveler segments.",
                },
                {
                  q: "Can I update my listing information?",
                  a: "Yes. Once onboarded, you'll have access to update your listing details, photos, pricing, and availability through our partner tools.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border bg-background p-5">
                  <h3 className="font-medium mb-2">{q}</h3>
                  <p className="text-sm text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}



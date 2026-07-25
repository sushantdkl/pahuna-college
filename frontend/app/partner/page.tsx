import type { Metadata } from "next";
import Link from "next/link";
import {
  Handshake,
  ArrowRight,
  CheckCircle,
  Hotel,
  Store,
  UtensilsCrossed,
  Plane,
  Bus,
  HelpCircle,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PartnerForm } from "@/components/forms/partner-form";
import { partnerCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: partnerCopy.metadata.title,
  description: partnerCopy.metadata.description,
  alternates: { canonical: "/partner" },
  openGraph: {
    title: partnerCopy.metadata.ogTitle,
    description: partnerCopy.metadata.ogDescription,
  },
};

const partnerTypes = [
  {
    title: partnerCopy.partnerTypes.types[0].title,
    description: partnerCopy.partnerTypes.types[0].description,
    icon: Hotel,
  },
  {
    title: partnerCopy.partnerTypes.types[1].title,
    description: partnerCopy.partnerTypes.types[1].description,
    icon: UtensilsCrossed,
  },
  {
    title: partnerCopy.partnerTypes.types[2].title,
    description: partnerCopy.partnerTypes.types[2].description,
    icon: Plane,
  },
  {
    title: partnerCopy.partnerTypes.types[3].title,
    description: partnerCopy.partnerTypes.types[3].description,
    icon: Bus,
  },
];

const benefits = partnerCopy.benefits.items;

export default function PartnerPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background py-20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Handshake className="mr-1 h-3 w-3" /> Partner Network
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {partnerCopy.hero.heading}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {partnerCopy.hero.description}
            </p>
            <Button asChild size="lg" className="mt-8">
              <a href="#apply">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Container>
      </section>

      {/* Partner Types */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title={partnerCopy.partnerTypes.title}
            subtitle={partnerCopy.partnerTypes.subtitle}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerTypes.map((type) => (
              <Card key={type.title} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <type.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{type.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/50">
        <Container>
          <SectionHeader
            title={partnerCopy.benefits.title}
            subtitle={partnerCopy.benefits.subtitle}
          />
          <div className="mx-auto max-w-3xl grid grid-cols-1 gap-4 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 rounded-lg bg-background p-4"
              >
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              title={partnerCopy.form.title}
              subtitle={partnerCopy.form.subtitle}
            />
            <PartnerForm />
          </div>
        </Container>
      </section>
    </>
  );
}



import type { Metadata } from "next";
import {
  Mountain,
  Users,
  Award,
  Target,
  Heart,
  Globe,
  MapPin,
  Phone,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@server/lib/constants";
import { aboutCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: aboutCopy.metadata.title,
  description: aboutCopy.metadata.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: aboutCopy.metadata.ogTitle,
    description: aboutCopy.metadata.ogDescription,
  },
};

const values = aboutCopy.values.items.map((item, i) => ({
  title: item.title,
  description: item.description,
  icon: [MapPin, Heart, Users, Award][i],
}));

const milestones = aboutCopy.journey.milestones;

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-linear-to-b from-slate-100/60 via-indigo-50/30 to-background py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-5">
              <Mountain className="mr-1 h-3 w-3" /> Our Story
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
              {aboutCopy.hero.heading}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {aboutCopy.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="rounded-2xl bg-primary/[0.04] p-8 border border-primary/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{aboutCopy.mission.heading}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {aboutCopy.mission.description}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{aboutCopy.vision.heading}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {aboutCopy.vision.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <Container>
          <SectionHeader
            title={aboutCopy.values.title}
            subtitle={aboutCopy.values.subtitle}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Journey / Milestones */}
      <section className="py-20">
        <Container>
          <SectionHeader
            title={aboutCopy.journey.title}
            subtitle={aboutCopy.journey.subtitle}
          />
          <div className="mx-auto max-w-2xl">
            <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
              {milestones.map((ms) => (
                <div key={ms.year} className="flex gap-6 items-start">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {ms.year.slice(-2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary">
                      {ms.year}
                    </p>
                    <p className="text-muted-foreground text-sm">{ms.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Quick Info */}
      <section className="py-20 bg-primary/[0.04]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold">{aboutCopy.contact.heading}</h2>
            <p className="mt-2 text-muted-foreground">
              {aboutCopy.contact.description}
            </p>
            <Separator className="my-6" />
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {SITE_CONFIG.address}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {SITE_CONFIG.phone}
              </p>
              <p>{SITE_CONFIG.email}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}



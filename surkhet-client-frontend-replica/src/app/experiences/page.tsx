import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, DollarSign, Mountain, ArrowRight, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";
import { demoExperiences } from "@server/services";
import { EXPERIENCE_CATEGORIES } from "@server/lib/constants";
import { ExperiencesMapSectionClient } from "@/components/maps/experiences-map-client";

export const metadata: Metadata = {
  title: "Things to Do in Surkhet",
  description:
    "Discover activities and experiences in Surkhet — from sunrise hikes and heritage walks to food trails and cultural evenings.",
  alternates: { canonical: "/experiences" },
  openGraph: {
    title: "Things to Do in Surkhet",
    description: "Curated experiences — adventure, culture, nature, and food in Karnali Province.",
  },
};

const categoryEmojis: Record<string, string> = {
  ADVENTURE: "🥾", CULTURE: "🎭", NATURE: "🦅", FOOD: "🍛", HERITAGE: "🏛️", WELLNESS: "🧘", RELIGIOUS: "🛕", EVENTS: "🎉",
};

export default function ExperiencesPage() {
  return (
    <>
      {/* ── HERO ── */}
      <PageHero
        badge={{ icon: <Compass className="h-3 w-3" />, label: "Curated Experiences" }}
        title="Things to Do in"
        highlight="Surkhet"
        subtitle="Curated experiences for every type of traveler — adventure seekers, culture enthusiasts, food lovers, and nature admirers."
      />

      {/* ── CATEGORIES ── */}
      <section className="py-10 border-b">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {EXPERIENCE_CATEGORIES.map((cat) => (
              <Badge key={cat.value} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 text-sm">
                {categoryEmojis[cat.value]} {cat.label}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      {/* ── EXPERIENCE MAP ── */}
      <section className="py-10">
        <Container>
          <ExperiencesMapSectionClient experiences={demoExperiences} />
        </Container>
      </section>

      {/* ── EXPERIENCES GRID ── */}
      <section className="py-16">
        <Container>
          {demoExperiences.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoExperiences.map((exp) => (
                <Card key={exp.slug} className="overflow-hidden border hover:shadow-lg transition-all group">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <div className="h-full w-full relative transition-transform duration-500 group-hover:scale-105">
                      <Image
                        src={exp.coverImage}
                        alt={exp.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-xs">{exp.category}</Badge>
                    {exp.isFeatured && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exp.shortDesc}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {exp.duration}</span>
                      <span className="flex items-center gap-1"><Mountain className="h-3.5 w-3.5" /> {exp.difficulty}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {exp.priceRange}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Compass className="h-14 w-14" />}
              title="No experiences available"
              description="We're curating new experiences in Surkhet. Check back soon!"
              action={{ label: "Explore Destinations", href: "/explore" }}
            />
          )}
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-3">Want a Customized Experience?</h2>
            <p className="text-white/70 mb-6">Tell us what kind of experience you&apos;re looking for and we&apos;ll design a personalized itinerary for you.</p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold">
                <Link href="/itineraries">View Trip Ideas <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}



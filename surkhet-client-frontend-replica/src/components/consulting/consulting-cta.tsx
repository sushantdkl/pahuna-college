import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@server/lib/constants";

interface ConsultingCtaProps {
  /** Primary heading */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Variant controls the color scheme */
  variant?: "gradient" | "dark" | "light";
}

export function ConsultingCta({
  title = "Ready to Transform Your Business?",
  subtitle = "Book a free discovery call. We\u2019ll analyze your challenges and outline a realistic plan — no commitment required.",
  variant = "gradient",
}: ConsultingCtaProps) {
  const bgClass =
    variant === "dark"
      ? "bg-slate-900 text-white"
      : variant === "light"
        ? "bg-muted/50 text-foreground"
        : "bg-linear-to-br from-primary via-primary/95 to-primary/80 text-white";

  const subtitleClass =
    variant === "light" ? "text-muted-foreground" : "text-white/70";

  const outlineClass =
    variant === "light"
      ? "border-primary text-primary hover:bg-primary/5"
      : "border-white/70 bg-transparent text-white hover:bg-white hover:text-primary";

  return (
    <section
      className={`py-20 ${bgClass} relative overflow-hidden`}
    >
      {variant !== "light" && (
        <div className="absolute top-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
      )}
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-3 leading-[1.15]">{title}</h2>
          <p className={`${subtitleClass} mb-8 max-w-lg mx-auto leading-relaxed`}>
            {subtitle}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              asChild
              size="lg"
              className={
                variant === "light"
                  ? "font-semibold px-8"
                  : "bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg"
              }
            >
              <Link href="/consulting#inquiry-form">
                <Calendar className="h-4 w-4 mr-2" />
                Book Discovery Call
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={`${outlineClass} font-semibold px-8`}
            >
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                {SITE_CONFIG.phone}
              </a>
            </Button>
          </div>

          <p className="text-xs mt-6 opacity-60">
            Free consultation · No obligation · Response within 24 hours
          </p>
        </div>
      </Container>
    </section>
  );
}



import Link from "next/link";
import { ArrowRight, Phone, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@server/lib/utils";
import { SITE_CONFIG } from "@server/lib/constants";

interface TrainingCtaProps {
  variant?: "gradient" | "dark" | "light";
  className?: string;
}

export function TrainingCta({ variant = "gradient", className }: TrainingCtaProps) {
  const styles = {
    gradient:
      "bg-linear-to-r from-primary to-primary/80 text-primary-foreground",
    dark: "bg-gray-900 text-white",
    light: "bg-muted/50 text-foreground border",
  };

  const btnVariant = variant === "light" ? "default" : "secondary";

  return (
    <div className={cn("rounded-2xl p-8 md:p-12 text-center", styles[variant], className)}>
      <div className="flex justify-center mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 dark:bg-white/10">
          <GraduationCap className="h-7 w-7" />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 leading-[1.15]">
        Ready to Start Your Hospitality Career?
      </h3>
      <p
        className={cn(
          "text-sm max-w-lg mx-auto mb-6",
          variant === "light" ? "text-muted-foreground" : "opacity-90"
        )}
      >
        Enroll today and join 500+ graduates who launched successful careers in
        Nepal&apos;s hospitality industry. Affordable fees with installment options.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant={btnVariant} size="lg">
          <Link href="/training#enroll">
            Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className={variant !== "light" ? "border-white/70 bg-transparent text-white hover:bg-white hover:text-primary" : ""}
        >
          <a href={`tel:${SITE_CONFIG.phone.replace(/-/g, "")}`}>
            <Phone className="mr-2 h-4 w-4" /> Call Us
          </a>
        </Button>
      </div>
    </div>
  );
}



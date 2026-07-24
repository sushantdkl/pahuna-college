// @ts-nocheck
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: {
    icon?: React.ReactNode;
    label: string;
  };
  title: string;
  highlight?: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: "gradient" | "light";
  align?: "left" | "center";
  className?: string;
}

export function PageHero({
  badge,
  title,
  highlight,
  subtitle,
  children,
  variant = "gradient",
  align = "center",
  className,
}: PageHeroProps) {
  const isGradient = variant === "gradient";

  return (
    <section
      className={cn(
        "relative py-24 overflow-hidden",
        isGradient
          ? "bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white"
          : "bg-linear-to-b from-slate-100/60 via-indigo-50/30 to-background",
        className
      )}
    >
      {/* Decorative blurs â€” refined for premium feel */}
      {isGradient && (
        <>
          <div className="absolute -top-20 right-0 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white/[0.02] rounded-full blur-3xl" />
        </>
      )}

      <Container className="relative z-10">
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto text-center"
          )}
        >
          {badge && (
            <Badge
              variant="secondary"
              className={cn(
                "mb-5 px-3 py-1",
                isGradient
                  ? "bg-white/[0.12] text-white border-white/20 backdrop-blur-sm"
                  : "bg-primary/8 text-primary border-primary/15"
              )}
            >
              {badge.icon && <span className="mr-1.5">{badge.icon}</span>}
              {badge.label}
            </Badge>
          )}

          <h1
            className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]",
              isGradient ? "text-white" : ""
            )}
          >
            {highlight ? (
              <>
                {title}{" "}
                <span className={cn(
                  "relative",
                  isGradient ? "text-amber-300" : "text-primary"
                )}>
                  {highlight}
                </span>
              </>
            ) : (
              title
            )}
          </h1>

          {subtitle && (
            <p
              className={cn(
                "mt-5 text-lg leading-relaxed sm:text-xl",
                isGradient ? "text-white/75" : "text-muted-foreground",
                align === "center" && "max-w-2xl mx-auto"
              )}
            >
              {subtitle}
            </p>
          )}

          {children && <div className="mt-10">{children}</div>}
        </div>
      </Container>
    </section>
  );
}



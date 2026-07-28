// @ts-nocheck
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "center",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3",
            align === "center" && "mx-auto"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem]",
          align === "center" && "mx-auto max-w-2xl"
        )}
      >
        {title}
      </h2>
      {/* Decorative accent line */}
      <div
        className={cn(
          "mt-4 h-1 w-12 rounded-full bg-primary/80",
          align === "center" && "mx-auto"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
      {action && (
        <div className={cn("mt-6", align === "center" && "flex justify-center")}>
          <Link
            href={action.href}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          >
            {action.label}
            <span className="transition-transform group-hover:translate-x-0.5">{"->"}</span>
          </Link>
        </div>
      )}
    </div>
  );
}



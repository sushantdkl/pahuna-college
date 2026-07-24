"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Header, Footer, Container } from "@/components/layout";
import { PageHero as NewPageHero } from "@/components/shared/page-hero";
import { SectionHeader as NewSectionHeader } from "@/components/shared/section-header";
import { EmptyState as NewEmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SiteHeader() {
  return <Header />;
}

export function SiteFooter() {
  return <Footer />;
}

export function PageShell({ children }: Readonly<{ children: ReactNode }>) {
  return <main className="min-h-screen bg-background text-foreground">{children}</main>;
}

export function SectionShell({
  children,
  className = "",
  id,
}: Readonly<{ children: ReactNode; className?: string; id?: string }>) {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  children,
  align = "center",
  image,
}: Readonly<{
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
  align?: "left" | "center";
  image?: string;
}>) {
  void image;
  return (
    <NewPageHero
      badge={eyebrow ? { label: eyebrow } : undefined}
      title={title}
      highlight={accent}
      subtitle={description}
      align={align}
    >
      {children}
    </NewPageHero>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  as?: string;
}>) {
  void as;
  return (
    <div className={`mb-8 flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <NewSectionHeader eyebrow={eyebrow} title={title} subtitle={description} align={align} />
      {action}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: Readonly<{
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
}>) {
  const buttonVariant = variant === "primary" ? "default" : variant === "outline" || variant === "ghost" ? "outline" : "secondary";
  return (
    <Button asChild variant={buttonVariant} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export function StatusBadge({ children }: Readonly<{ children: ReactNode }>) {
  return <Badge variant="secondary">{children}</Badge>;
}

export function EmptyState({
  title,
  description,
  action,
}: Readonly<{ title: string; description?: string; action?: ReactNode }>) {
  return (
    <div>
      <NewEmptyState title={title} description={description || ""} />
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  description,
  action,
}: Readonly<{ description: string; action?: ReactNode }>) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-5">
        <p className="text-sm text-destructive">{description}</p>
        {action ? <div className="mt-3">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export function LoadingSkeleton({ rows = 3 }: Readonly<{ rows?: number }>) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export function MapPanel({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">{children}</div>;
}

export function ImageTile({
  src,
  alt,
  title,
  subtitle,
  image,
  href,
  tall,
  className = "",
}: Readonly<{
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  href?: string;
  tall?: boolean;
  className?: string;
}>) {
  const content = (
    <div className={`relative overflow-hidden rounded-xl bg-muted ${tall ? "min-h-80" : "min-h-40"} ${className}`}>
      <Image src={src || image || "/images/placeholders/destination.svg"} alt={alt || title || "Pahuna image"} fill className="object-cover" />
      {title ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <p className="font-semibold">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-white/85">{subtitle}</p> : null}
        </div>
      ) : null}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 text-center">
      <p className="text-lg font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function DashboardFrame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="min-h-screen bg-muted/30 p-4 md:p-6">{children}</div>;
}

export type DashboardNavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

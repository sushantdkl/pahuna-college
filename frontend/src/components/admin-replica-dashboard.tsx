"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Header } from "@/components/layout/header";

export const adminReplicaNavItems = [
  { label: "Overview", href: "/admin", section: "OV" },
  { label: "Hotels / Stays", href: "/dashboard/hotels", section: "HT" },
  { label: "Destinations", href: "/dashboard/content", section: "DS" },
  { label: "Experiences", href: "/dashboard/experiences", section: "EX" },
  { label: "Itineraries", href: "/dashboard/trip-planner", section: "IT" },
  { label: "Trip Packages", href: "/dashboard/trip-packages", section: "PK" },
  { label: "Routes & Segments", href: "/dashboard/routes", section: "RT" },
  { label: "Food Providers", href: "/dashboard/food", section: "FD" },
  { label: "Training", href: "/dashboard/training", section: "TR" },
  { label: "Consulting", href: "/dashboard/consulting", section: "CO" },
  { label: "Leads & Inquiries", href: "/dashboard/leads", section: "LD" },
  { label: "Contact Messages", href: "/dashboard/messages", section: "MS" },
  { label: "Partner Applications", href: "/dashboard/partners", section: "PR" },
  { label: "Users", href: "/admin/users", section: "US" },
];

export function AdminReplicaFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-muted/30">
      <Header />
      <div className="grid min-h-[calc(100vh-64px)] md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r bg-card p-4 md:block">
          <div className="mb-4 text-sm font-semibold text-muted-foreground">Admin Workspace</div>
          <nav className="space-y-1">
            {adminReplicaNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0 p-4 md:p-6">{children}</section>
      </div>
    </main>
  );
}

export function ReplicaStatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return <StatCard title={title} value={value} subtitle={subtitle} icon={LayoutDashboard} />;
}

export function ReplicaDataCard({ title, description, count, children }: { title: string; description?: string; count?: number; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {typeof count === "number" ? <Badge variant="secondary">{count}</Badge> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ReplicaStatusBadge({ children }: { children: ReactNode }) {
  return <Badge variant="secondary">{children}</Badge>;
}

export function AdminReplicaOverviewContent({ title = "Dashboard" }: { title?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Manage Pahuna platform workflows from one product workspace.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ReplicaStatCard title="Public Modules" value={15} subtitle="Final connected scope" icon="modules" />
        <ReplicaStatCard title="Workspace" value="Live" subtitle="Admin flow protected" icon="status" />
        <ReplicaStatCard title="Actions" value="Ready" subtitle="View, edit, publish, archive" icon="actions" />
      </div>
      <Button asChild><Link href="/dashboard/hotels">Open Stays</Link></Button>
    </div>
  );
}

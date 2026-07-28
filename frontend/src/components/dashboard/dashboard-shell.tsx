"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  Handshake,
  Home,
  ImageIcon,
  Layers3,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminDashboardOverviewAction,
} from "@/lib/actions/admin-dashboard-actions";
import type {
  DashboardOverview,
  DashboardRange,
  DashboardSubmission,
  DashboardTrend,
} from "@/lib/api/admin-dashboard";
import { DashboardHeader } from "./dashboard-header";
import { DashboardMobileNav, DashboardSidebar } from "./dashboard-sidebar";

const ranges: Array<{ label: string; value: DashboardRange }> = [
  { label: "Today", value: "today" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

const metricLabels: Record<string, string> = {
  users: "Users",
  inquiries: "Inquiries",
  reservations: "Reservations",
  messages: "Messages",
  partners: "Partners",
  training: "Training",
  consulting: "Consulting",
};

const cardIcons: Record<string, LucideIcon> = {
  users: Users,
  activeListings: Layers3,
  inquiries: MessageSquare,
  reservations: CalendarCheck,
  partners: Handshake,
  messages: Mail,
  training: BookOpen,
  consulting: BriefcaseBusiness,
};

const submissionLabels: Record<string, string> = {
  inquiries: "Inquiries",
  messages: "Messages",
  partners: "Partner Applications",
  training: "Training Enrollments",
  consulting: "Consulting Leads",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value || 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en", {
    currency: "NPR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value || 0);
}

function formatDate(value?: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value?: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function statusLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AdminReplicaFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin) {
      router.replace("/profile");
    }
  }, [isAdmin, loading, pathname, router, user]);

  if (loading || !user || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] px-4">
        <div className="rounded-xl border border-stone-200 bg-white px-6 py-4 text-sm font-medium text-stone-600 shadow-sm">
          Checking admin session...
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#f7f4ed] text-stone-950">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <DashboardSidebar />
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader user={user} onLogout={() => logout("/admin/login")} />
          <DashboardMobileNav />
          <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

export function AdminReplicaOverviewContent({ title = "Dashboard" }: { title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [range, setRange] = useState<DashboardRange>(() => {
    if (typeof window === "undefined") return "30d";
    const current = new URLSearchParams(window.location.search).get("range") as DashboardRange | null;
    return current && ranges.some((item) => item.value === current) ? current : "30d";
  });
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState("inquiries");
  const [pipeline, setPipeline] = useState("inquiries");
  const [submissionType, setSubmissionType] = useState("inquiries");

  useEffect(() => {
    let active = true;

    getAdminDashboardOverviewAction(range)
      .then((response) => {
        if (!active) return;
        setOverview(response.data);
        const firstMetric = response.data?.trends[0]?.metric;
        const firstPipeline = response.data?.pipelines[0]?.id;
        const firstSubmissions = Object.keys(response.data?.recentSubmissions || {})[0];
        if (firstMetric && !response.data?.trends.some((item) => item.metric === metric)) {
          setMetric(firstMetric);
        }
        if (firstPipeline && !response.data?.pipelines.some((item) => item.id === pipeline)) {
          setPipeline(firstPipeline);
        }
        if (firstSubmissions && !response.data?.recentSubmissions[submissionType]) {
          setSubmissionType(firstSubmissions);
        }
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || "Unable to load dashboard data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [metric, pipeline, range, submissionType]);

  function updateRange(nextRange: DashboardRange) {
    setOverview(null);
    setLoading(true);
    setError("");
    setRange(nextRange);
    const params = new URLSearchParams(window.location.search);
    params.set("range", nextRange);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function refresh() {
    setOverview(null);
    setLoading(true);
    getAdminDashboardOverviewAction(range)
      .then((response) => {
        setOverview(response.data);
        toast.success("Dashboard data refreshed");
      })
      .catch((err: Error) => {
        setError(err.message || "Unable to refresh dashboard data");
        toast.error(err.message || "Unable to refresh dashboard data");
      })
      .finally(() => setLoading(false));
  }

  const selectedTrend = overview?.trends.find((item) => item.metric === metric) || overview?.trends[0];
  const selectedPipeline = overview?.pipelines.find((item) => item.id === pipeline) || overview?.pipelines[0];
  const selectedSubmissions = overview?.recentSubmissions[submissionType] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
            {user?.fullName ? `Welcome, ${user.fullName}` : "Pahuna Admin"}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-stone-950">{title} Overview</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Real account, booking, content, lead, and publication activity from the Pahuna database.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-1">
            {ranges.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateRange(item.value)}
                className={`rounded-md px-3 py-2 text-xs font-bold transition ${
                  range === item.value ? "bg-white text-emerald-700 shadow-sm" : "text-stone-500 hover:text-stone-950"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800"
          >
            <Home className="h-4 w-4" />
            Public Site
          </Link>
        </div>
      </div>

      {error ? <DashboardError message={error} onRetry={refresh} /> : null}
      {loading ? <DashboardSkeleton /> : overview ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {overview.cards.map((card) => {
              const Icon = cardIcons[card.id] || Database;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">{card.label}</p>
                      <p className="mt-3 text-3xl font-black text-stone-950">{formatNumber(card.value)}</p>
                    </div>
                    <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{card.comparison}</p>
                  {card.breakdown?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {card.breakdown.slice(0, 4).map((item) => (
                        <span key={item.label} className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                          {item.label}: {item.count}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Panel
              title="Activity Trend"
              description={`Records created from ${formatDate(overview.dateFrom)} to ${formatDate(overview.dateTo)}`}
              action={
                <div className="flex flex-wrap gap-1">
                  {overview.trends.map((item) => (
                    <button
                      key={item.metric}
                      type="button"
                      onClick={() => setMetric(item.metric)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${
                        metric === item.metric ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {metricLabels[item.metric] || item.metric}
                    </button>
                  ))}
                </div>
              }
            >
              <TrendChart trend={selectedTrend} />
            </Panel>

            <Panel title="Content Distribution" description="Active public records by section">
              <div className="space-y-3">
                {overview.contentDistribution.map((item) => (
                  <DistributionRow key={item.label} item={item} max={Math.max(...overview.contentDistribution.map((row) => row.count), 1)} />
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel
              title="Pipeline Status"
              description="Open workflows grouped by real status"
              action={
                <div className="flex flex-wrap gap-1">
                  {overview.pipelines.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPipeline(item.id)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${
                        pipeline === item.id ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              }
            >
              <PipelineChart pipeline={selectedPipeline} />
            </Panel>

            <Panel title="Reservations" description="Booking volume, rooms, value, and next check-in" action={<PanelLink href={overview.reservationSummary.href} label="Manage" />}>
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric label="Requests" value={formatNumber(overview.reservationSummary.total)} />
                <MiniMetric label="Rooms" value={formatNumber(overview.reservationSummary.roomsReserved)} />
                <MiniMetric label="Value" value={formatCurrency(overview.reservationSummary.estimatedValue)} />
              </div>
              <div className="mt-4 space-y-2">
                {overview.reservationSummary.statuses.map((item) => (
                  <StatusRow key={item.status} status={item.status} count={item.count} href={`${overview.reservationSummary.href}?status=${item.status}`} />
                ))}
              </div>
              {overview.reservationSummary.nextCheckIn ? (
                <Link href={overview.reservationSummary.href} className="mt-4 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm">
                  <span>
                    <span className="block font-bold text-emerald-950">Next check-in</span>
                    <span className="text-emerald-800">
                      {overview.reservationSummary.nextCheckIn.guestName} on {formatDate(overview.reservationSummary.nextCheckIn.checkIn)}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-emerald-700" />
                </Link>
              ) : null}
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <Panel title="Needs Attention" description="Records waiting on an admin action">
              {overview.attention.length ? (
                <div className="space-y-2">
                  {overview.attention.map((item) => (
                    <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-lg border border-stone-200 p-3 hover:border-amber-200 hover:bg-amber-50">
                      <span className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-bold text-stone-800">{item.label}</span>
                      </span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-800">{item.count}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState icon={ShieldCheck} title="No urgent records" text="All tracked workflows are clear for this range." />
              )}
            </Panel>

            <Panel
              title="Recent Submissions"
              description="Latest private submissions across admin workflows"
              action={
                <div className="flex flex-wrap gap-1">
                  {Object.keys(overview.recentSubmissions).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSubmissionType(key)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${
                        submissionType === key ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {submissionLabels[key] || key}
                    </button>
                  ))}
                </div>
              }
            >
              <SubmissionTable rows={selectedSubmissions} />
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Recent Activity" description="Newest database records from connected modules">
              <div className="space-y-3">
                {overview.recentActivity.length ? overview.recentActivity.map((item) => (
                  <Link key={`${item.type}-${item.createdAt}-${item.text}`} href={item.href} className="block rounded-lg border border-stone-200 p-3 hover:border-emerald-200 hover:bg-emerald-50">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{item.type}</p>
                    <p className="mt-1 text-sm font-semibold text-stone-800">{item.text}</p>
                    <p className="mt-1 text-xs text-stone-500">{formatDateTime(item.createdAt)}</p>
                  </Link>
                )) : <EmptyState icon={ClipboardList} title="No activity yet" text="New records will appear here after users and admins create them." />}
              </div>
            </Panel>

            <Panel title="Published Content" description="Newest public records available to visitors">
              <div className="space-y-3">
                {overview.recentlyPublished.length ? overview.recentlyPublished.map((item) => (
                  <Link key={`${item.type}-${item.title}-${item.createdAt}`} href={item.href} className="flex items-center gap-3 rounded-lg border border-stone-200 p-3 hover:border-emerald-200 hover:bg-emerald-50">
                    <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-stone-100 text-stone-400">
                      <ImageIcon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-stone-900">{item.title}</span>
                      <span className="text-xs text-stone-500">{item.type} - {formatDate(item.createdAt)}</span>
                    </span>
                  </Link>
                )) : <EmptyState icon={FileText} title="No published content" text="Published records from content modules will appear here." />}
              </div>
            </Panel>

            <Panel title="Actions And Health" description="Useful entry points plus data quality checks">
              <div className="grid gap-2">
                {overview.quickActions.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                    {item.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-stone-200 pt-4">
                {overview.health.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2">
                    <span>
                      <span className="block text-sm font-bold text-stone-800">{item.label}</span>
                      <span className="text-xs text-stone-500">{item.detail}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-black ${
                      item.status === "Healthy" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function AdminReplicaModulePage({ moduleKey }: { moduleKey: string }) {
  return (
    <AdminReplicaFrame>
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-stone-950">Dashboard Section</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          The {moduleKey} workflow is managed by its dedicated dashboard route in the sidebar.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
        >
          Open Overview
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </AdminReplicaFrame>
  );
}

function Panel({
  action,
  children,
  description,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black tracking-tight text-stone-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-emerald-50 hover:text-emerald-700">
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function TrendChart({ trend }: { trend?: DashboardTrend }) {
  const points = trend?.points || [];
  const values = points.map((item) => item.value);
  const max = Math.max(...values, 1);
  const path = points
    .map((item, index) => {
      const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
      const y = 92 - (item.value / max) * 78;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  if (!points.length) {
    return <EmptyState icon={BarChart3} title="No records in this range" text="Choose a wider range or create records in the related module." />;
  }

  return (
    <div>
      <div className="h-72 w-full rounded-lg border border-stone-200 bg-stone-50 p-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <path d="M 0 92 H 100" stroke="#d6d3d1" strokeWidth="0.5" />
          <path d="M 0 66 H 100" stroke="#e7e5e4" strokeWidth="0.35" />
          <path d="M 0 40 H 100" stroke="#e7e5e4" strokeWidth="0.35" />
          <path d="M 0 14 H 100" stroke="#e7e5e4" strokeWidth="0.35" />
          <path d={`${path} L 100 92 L 0 92 Z`} fill="#d1fae5" opacity="0.65" />
          <path d={path} fill="none" stroke="#047857" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-stone-500">
        <span>{points[0]?.label}</span>
        <span>Peak {formatNumber(max)}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

function DistributionRow({ item, max }: { item: { label: string; count: number; href: string }; max: number }) {
  const width = Math.max((item.count / max) * 100, item.count ? 8 : 0);
  return (
    <Link href={item.href} className="block rounded-lg border border-stone-200 p-3 hover:border-emerald-200 hover:bg-emerald-50">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-stone-800">{item.label}</span>
        <span className="text-sm font-black text-stone-950">{formatNumber(item.count)}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-100">
        <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${width}%` }} />
      </div>
    </Link>
  );
}

function PipelineChart({ pipeline }: { pipeline?: { href: string; statuses: Array<{ status: string; count: number }> } }) {
  const statuses = pipeline?.statuses || [];
  const total = statuses.reduce((sum, item) => sum + item.count, 0);

  if (!statuses.length) {
    return <EmptyState icon={Search} title="No pipeline data" text="Records with statuses will appear here." />;
  }

  return (
    <div className="space-y-3">
      {statuses.map((item) => (
        <StatusRow key={item.status} status={item.status} count={item.count} total={total} href={`${pipeline?.href}?status=${item.status}`} />
      ))}
    </div>
  );
}

function StatusRow({ count, href, status, total }: { count: number; href: string; status: string; total?: number }) {
  const width = total ? Math.max((count / total) * 100, count ? 8 : 0) : 0;
  return (
    <Link href={href} className="block rounded-lg border border-stone-200 p-3 hover:border-emerald-200 hover:bg-emerald-50">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-stone-800">{statusLabel(status)}</span>
        <span className="text-sm font-black text-stone-950">{formatNumber(count)}</span>
      </div>
      {typeof total === "number" ? (
        <div className="h-2 rounded-full bg-stone-100">
          <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${width}%` }} />
        </div>
      ) : null}
    </Link>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 text-xl font-black text-stone-950">{value}</p>
    </div>
  );
}

function SubmissionTable({ rows }: { rows: DashboardSubmission[] }) {
  if (!rows.length) {
    return <EmptyState icon={ClipboardList} title="No submissions yet" text="New public form submissions will appear in this table." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left">
            <th className="pb-2 pr-4 font-bold text-stone-500">Name</th>
            <th className="pb-2 pr-4 font-bold text-stone-500">Type</th>
            <th className="pb-2 pr-4 font-bold text-stone-500">Status</th>
            <th className="pb-2 pr-4 font-bold text-stone-500">Submitted</th>
            <th className="pb-2 pr-4 font-bold text-stone-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-stone-100 last:border-0">
              <td className="py-3 pr-4 font-bold text-stone-900">{row.name}</td>
              <td className="py-3 pr-4 text-stone-600">{row.type}</td>
              <td className="py-3 pr-4">
                <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-black text-stone-700">{statusLabel(row.status)}</span>
              </td>
              <td className="py-3 pr-4 text-stone-500">{formatDateTime(row.createdAt)}</td>
              <td className="py-3 pr-4">
                <Link href={row.href} className="font-bold text-emerald-700 hover:text-emerald-900">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon: Icon, text, title }: { icon: LucideIcon; text: string; title: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50 p-6 text-center">
      <div>
        <Icon className="mx-auto h-7 w-7 text-stone-400" />
        <p className="mt-3 font-black text-stone-900">{title}</p>
        <p className="mt-1 max-w-sm text-sm leading-6 text-stone-500">{text}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="h-3 w-24 rounded bg-stone-200" />
            <div className="mt-6 h-8 w-20 rounded bg-stone-200" />
            <div className="mt-5 h-3 w-full rounded bg-stone-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-xl border border-stone-200 bg-white" />
        <div className="h-96 animate-pulse rounded-xl border border-stone-200 bg-white" />
      </div>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

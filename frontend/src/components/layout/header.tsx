// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, ChevronDown, LogOut, Settings, UserRound, CalendarCheck, LayoutDashboard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Container } from "@/components/layout/container";
import { mainNavigation } from "@/lib/data/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const initials = (user?.fullName || user?.email || "User")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const navLabel = (item: { label?: string; title?: string }) => item.label || item.title || "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo/pahuna-icon.svg"
              alt="Pahuna"
              width={36}
              height={36}
              className="h-9 w-9 sm:hidden"
              priority
            />
            <Image
              src="/logo/pahuna-logo-clean.svg"
              alt="Pahuna"
              width={180}
              height={84}
              className="hidden h-10 w-auto sm:block"
              priority
            />
            <span className="sr-only">{SITE_CONFIG.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
            {mainNavigation.map((item) => {
              const label = navLabel(item);
              const key = item.href || label;

              return item.children ? (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    aria-expanded={openDropdown === key}
                    aria-haspopup="true"
                    onFocus={() => setOpenDropdown(key)}
                    onBlur={(e) => {
                      if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                        setOpenDropdown(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setOpenDropdown(null);
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === key ? null : key);
                      }
                    }}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50">
                    {label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" style={{
                      transform: openDropdown === key ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                  </button>
                  {openDropdown === key && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1">
                      <div className="w-72 rounded-xl border bg-popover/95 backdrop-blur-xl p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150" role="menu">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            onBlur={(e) => {
                              if (!e.currentTarget.closest('[role="menu"]')?.contains(e.relatedTarget)) {
                                setOpenDropdown(null);
                              }
                            }}
                            className="block rounded-lg px-3.5 py-2.5 hover:bg-accent transition-colors"
                          >
                            <div className="text-sm font-medium">
                              {navLabel(child)}
                            </div>
                            {child.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {child.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={key}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-2.5">
            {loading ? (
              <div className="hidden h-9 w-20 rounded-lg bg-muted sm:block" aria-hidden="true" />
            ) : user ? (
              <ProfileMenu
                user={user}
                initials={initials}
                isAdmin={isAdmin}
                onLogout={() => logout("/login")}
              />
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button asChild size="sm" className="hidden sm:inline-flex shadow-sm">
              <Link href="/contact">Get in Touch</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b px-4 py-4">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Image
                        src="/logo/pahuna-icon.svg"
                        alt="Pahuna"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                      <span className="font-bold">{SITE_CONFIG.name}</span>
                    </Link>
                  </div>
                  <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-1">
                      {mainNavigation.map((item) => {
                        const label = navLabel(item);
                        const key = item.href || label;

                        return item.children ? (
                          <div key={key} className="space-y-1">
                            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {label}
                            </div>
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                              >
                                {navLabel(child)}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={key}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </nav>
                  <div className="border-t p-4">
                    <div className="grid gap-2">
                      {loading ? (
                        <div className="h-10 rounded-lg bg-muted" aria-hidden="true" />
                      ) : user ? (
                        <>
                          {isAdmin ? (
                            <MobileMenuLink href="/admin" label="Dashboard" onClick={() => setMobileOpen(false)} />
                          ) : null}
                          <MobileMenuLink href="/profile" label="My Profile" onClick={() => setMobileOpen(false)} />
                          <MobileMenuLink href="/profile#reservations" label="My Reservations" onClick={() => setMobileOpen(false)} />
                          <MobileMenuLink href="/dashboard/leads" label="My Inquiries" onClick={() => setMobileOpen(false)} />
                          <MobileMenuLink href="/account-settings" label="Account Settings" onClick={() => setMobileOpen(false)} />
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setMobileOpen(false);
                              logout("/login");
                            }}
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                      )}
                      <Button
                        asChild
                        className="w-full"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link href="/contact">Get in Touch</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}

function ProfileMenu({
  user,
  initials,
  isAdmin,
  onLogout,
}: {
  user: { fullName?: string; email?: string; profileImage?: string };
  initials: string;
  isAdmin: boolean;
  onLogout: () => void;
}) {
  const profileImage = resolveProfileImageUrl(user.profileImage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex" aria-label="Open profile menu">
          <Avatar className="h-8 w-8">
            {profileImage ? <AvatarImage src={profileImage} alt={`${user.fullName || "Pahuna user"} profile photo`} /> : null}
            <AvatarFallback className="bg-emerald-700 text-xs font-black text-white">{initials || <UserRound className="h-4 w-4" />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate">{user.fullName || "Pahuna user"}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/profile"><UserRound className="h-4 w-4" /> My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile#reservations"><CalendarCheck className="h-4 w-4" /> My Reservations</Link>
        </DropdownMenuItem>
        {!isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/leads"><MessageSquare className="h-4 w-4" /> My Inquiries</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/account-settings"><Settings className="h-4 w-4" /> Account Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function resolveProfileImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${path.startsWith("/") ? path : `/${path}`}`;
}

function MobileMenuLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Button asChild variant="outline" className="w-full" onClick={onClick}>
      <Link href={href}>{label}</Link>
    </Button>
  );
}



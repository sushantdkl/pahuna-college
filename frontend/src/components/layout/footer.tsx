// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SITE_CONFIG } from "@/lib/constants";
import { footerNavigation } from "@/lib/data/navigation";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-foreground text-background">
      {/* Main Footer */}
      <Container className="py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex flex-col gap-2">
              <Image
                src="/logo/pahuna-logo-clean.svg"
                alt="Pahuna"
                width={200}
                height={94}
                className="h-11 w-auto"
              />
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-background/50">
                {SITE_CONFIG.tagline}
              </span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              {SITE_CONFIG.description}
            </p>
            <div className="space-y-3 text-sm text-background/60">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-2.5 hover:text-background transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                {SITE_CONFIG.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2.5 hover:text-background transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                {SITE_CONFIG.email}
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>{SITE_CONFIG.address}</span>
              </div>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/40 mb-5">
              Discover
            </h3>
            <ul className="space-y-3">
              {footerNavigation.discover.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/65 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/40 mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/65 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/40 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/65 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Social */}
            <div className="mt-8 flex gap-3">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/8 hover:bg-background/15 transition-all duration-200 hover:scale-105"
                aria-label="Facebook"
              >
                <span aria-hidden="true" className="text-xs font-semibold">f</span>
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/8 hover:bg-background/15 transition-all duration-200 hover:scale-105"
                aria-label="Instagram"
              >
                <span aria-hidden="true" className="text-xs font-semibold">ig</span>
              </a>
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/8 hover:bg-background/15 transition-all duration-200 hover:scale-105"
                aria-label="Twitter"
              >
                <span aria-hidden="true" className="text-xs font-semibold">x</span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <Separator className="bg-background/8" />
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-background/40">
          <p>&copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>Built with heart in Surkhet, Nepal</p>
        </div>
      </Container>
    </footer>
  );
}



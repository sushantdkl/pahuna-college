"use client";

/**
 * Analytics integration placeholder.
 *
 * Replace the GA_MEASUREMENT_ID with your actual Google Analytics 4 ID,
 * or swap this component for Vercel Analytics, PostHog, Plausible, etc.
 *
 * Supported providers (uncomment the one you use):
 *   - Google Analytics 4 (gtag.js)
 *   - Vercel Analytics (@vercel/analytics)
 *   - PostHog (posthog-js)
 *   - Plausible (plausible-tracker)
 */

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA_ID_VALID = GA_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);

// ── Analytics event helper ──────────────────────────────────────────────────
// Use this throughout the app to track custom events.
// Example: trackEvent("click_cta", { label: "Book Now", page: "/hotels" })

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && "gtag" in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag("event", eventName, params);
  }
}

// ── Analytics Component ─────────────────────────────────────────────────────

export function Analytics() {
  // Don't load analytics in development
  if (process.env.NODE_ENV !== "production") return null;

  // Skip if no GA ID is configured or invalid
  if (!GA_ID_VALID) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>

      {/* ── Vercel Analytics (alternative) ──
      import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
      <VercelAnalytics /> */}

      {/* ── PostHog (alternative) ──
      import posthog from 'posthog-js';
      import { PostHogProvider } from 'posthog-js/react';
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      }); */}
    </>
  );
}



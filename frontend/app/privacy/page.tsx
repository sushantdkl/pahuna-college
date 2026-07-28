import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { SITE_CONFIG } from "@server/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_CONFIG.name}`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl prose prose-neutral">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>

          <h2 className="text-xl font-semibold mt-8">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly — such as your name,
            email, phone number, and messages when you submit inquiry forms,
            contact forms, partner applications, or newsletter sign-ups.
          </p>

          <h2 className="text-xl font-semibold mt-8">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            Your information is used to respond to inquiries, process partner
            applications, deliver training enrollment confirmations, send
            newsletters (if opted in), and improve our services.
          </p>

          <h2 className="text-xl font-semibold mt-8">3. Data Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your personal data. We may share information with
            hotel partners to fulfill booking inquiries, or with service
            providers who assist in operating our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use essential cookies for site functionality and analytics
            cookies to understand usage patterns. You can manage cookie
            preferences in your browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. Data Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures to protect your
            data, including encryption in transit (HTTPS) and secure database
            access controls.
          </p>

          <h2 className="text-xl font-semibold mt-8">6. Your Rights</h2>
          <p className="text-muted-foreground">
            You can request access to, correction of, or deletion of your
            personal data at any time by contacting us at{" "}
            {SITE_CONFIG.email}.
          </p>

          <h2 className="text-xl font-semibold mt-8">7. Contact</h2>
          <p className="text-muted-foreground">
            For privacy-related questions, contact us at {SITE_CONFIG.email} or
            write to: {SITE_CONFIG.address}.
          </p>
        </div>
      </Container>
    </section>
  );
}



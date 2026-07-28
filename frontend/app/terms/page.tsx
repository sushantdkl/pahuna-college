import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { SITE_CONFIG } from "@server/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${SITE_CONFIG.name}`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl prose prose-neutral">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>

          <h2 className="text-xl font-semibold mt-8">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using {SITE_CONFIG.name} ({SITE_CONFIG.url}), you
            agree to be bound by these terms. If you do not agree, please do
            not use our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8">2. Services</h2>
          <p className="text-muted-foreground">
            {SITE_CONFIG.name} provides tourism information, hotel listings,
            inquiry-based booking facilitation, B2B consulting services,
            hospitality training programs, and partner network services for
            the Surkhet and Karnali region of Nepal.
          </p>

          <h2 className="text-xl font-semibold mt-8">3. Booking & Inquiries</h2>
          <p className="text-muted-foreground">
            Currently, our platform operates an inquiry-based model. Submitting
            a booking inquiry does not guarantee availability or pricing.
            Confirmed bookings are subject to direct communication with the
            respective hotel or our team.
          </p>

          <h2 className="text-xl font-semibold mt-8">4. Content Accuracy</h2>
          <p className="text-muted-foreground">
            We strive to keep all information accurate and up-to-date. However,
            prices, availability, amenities, and other details may change
            without notice. Please confirm details before making travel plans.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. User Conduct</h2>
          <p className="text-muted-foreground">
            You agree not to misuse the platform, submit false information,
            or use our services for any unlawful purpose. We reserve the right
            to reject or remove submissions that violate these terms.
          </p>

          <h2 className="text-xl font-semibold mt-8">6. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content on this platform — including text, images, designs,
            logos, and code — is the property of {SITE_CONFIG.name} unless
            otherwise noted. Unauthorized reproduction is prohibited.
          </p>

          <h2 className="text-xl font-semibold mt-8">7. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            {SITE_CONFIG.name} acts as an information and facilitation platform.
            We are not liable for the quality, safety, or service of third-party
            hotels, restaurants, or tour operators listed on our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8">8. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these terms from time to time. Continued use of the
            platform after changes constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-xl font-semibold mt-8">9. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these terms, contact us at {SITE_CONFIG.email}.
          </p>
        </div>
      </Container>
    </section>
  );
}



export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function localBusinessJsonLd() {
  return { "@context": "https://schema.org", "@type": "LocalBusiness", name: "Pahuna" };
}

export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
}

export const organizationJsonLd = () => ({ "@context": "https://schema.org", "@type": "Organization", name: "Pahuna" });
export const websiteJsonLd = () => ({ "@context": "https://schema.org", "@type": "WebSite", name: "Pahuna" });

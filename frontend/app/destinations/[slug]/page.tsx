import { DestinationDetailClient } from "./destination-detail-client";

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DestinationDetailClient slug={slug} />;
}

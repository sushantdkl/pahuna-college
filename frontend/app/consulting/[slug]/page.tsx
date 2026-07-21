import { ConsultingDetailClient } from "./consulting-detail-client";

export default async function ConsultingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ConsultingDetailClient slug={slug} />;
}

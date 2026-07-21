import { HotelDetailClient } from "./hotel-detail-client";

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <HotelDetailClient slug={slug} />;
}

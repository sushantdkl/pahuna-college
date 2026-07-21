import { TripPackageDetailClient } from "./trip-package-detail-client";

export default async function TripPackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TripPackageDetailClient slug={slug} />;
}

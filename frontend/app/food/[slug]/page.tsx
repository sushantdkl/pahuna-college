import { FoodDetailClient } from "./food-detail-client";

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FoodDetailClient slug={slug} />;
}

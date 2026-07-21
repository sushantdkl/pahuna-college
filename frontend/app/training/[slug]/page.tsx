import { TrainingDetailClient } from "./training-detail-client";

export default async function TrainingDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <TrainingDetailClient slug={slug} />; }

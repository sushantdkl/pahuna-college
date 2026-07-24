import { DistrictDestinationClient } from "./district-destination-client";

export default async function DistrictDestinationPage({ params }: { params: Promise<{ districtSlug: string }> }) {
  const { districtSlug } = await params;
  return <DistrictDestinationClient districtSlug={districtSlug} />;
}

import { NextResponse } from "next/server";
import { serviceProviders } from "@server/services/service-providers";

export async function POST() {
  return NextResponse.json({
    recommendations: serviceProviders.map((provider) => ({
      name: provider.name,
      slug: provider.slug,
      type: provider.type,
      verificationLabel: "Verified",
      priceFrom: provider.priceFrom,
      currency: provider.currency,
      bestFor: ["Comfort", "Surkhet base"],
      reasons: ["Good location", "Useful services"],
      score: 92,
    })),
    summary: "Recommended stays around Surkhet.",
  });
}

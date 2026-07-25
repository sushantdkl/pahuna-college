import { NextResponse } from "next/server";
import { serviceProviders } from "@server/services/service-providers";

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = process.env.MISTRAL_MODEL || "mistral-small-latest";

function fallbackRecommendations(input: Record<string, any>, summary?: string) {
  const budgetMin = Number(input.budgetPerNightMin || 0);
  const budgetMax = Number(input.budgetPerNightMax || Number.MAX_SAFE_INTEGER);

  const ranked = serviceProviders
    .map((provider, index) => {
      const price = Number(provider.priceFrom || 0);
      const priceMatch = !price || (price >= budgetMin && price <= budgetMax);
      const districtMatch =
        !input.destinationDistrict ||
        String(provider.district).toLowerCase() === String(input.destinationDistrict).toLowerCase();

      return {
        provider,
        score: 70 + (priceMatch ? 12 : 0) + (districtMatch ? 10 : 0) + (provider.featured ? 5 : 0) - index,
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    recommendations: ranked.map(({ provider, score }, index) => ({
      id: provider.id,
      rank: index + 1,
      name: provider.name,
      slug: provider.slug,
      type: provider.type,
      verificationLabel: provider.verificationLabel || "Verified",
      rating: provider.rating,
      contactLabel: "Contact via Pahuna",
      district: provider.district,
      area: provider.area,
      priceFrom: provider.priceFrom,
      currency: provider.currency || "NPR",
      bestFor: provider.amenities || ["Comfort", "Route base"],
      aiExplanation: `${provider.name} is a useful match for this stay request based on location, price, and listed services.`,
      matchedReasons: ["Location fit", "Budget aware", "Verified listing"],
      missingInfoWarnings: ["Confirm current room availability and final price before booking."],
      ctas: { viewDetails: `/hotels/${provider.slug}`, inquiry: "/contact" },
      score,
    })),
    summary: summary || "Recommended stays around Surkhet based on your route, budget, and stay preferences.",
    disclaimer: "AI rankings are guidance only. Confirm availability, exact price, and amenities with Pahuna or the stay provider.",
    warnings: ["Availability and prices can change quickly."],
  };
}

function extractJson(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced || content;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  return JSON.parse(raw.slice(start, end + 1));
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => ({}));
  const fallback = fallbackRecommendations(input);

  if (!process.env.MISTRAL_API_KEY) {
    return NextResponse.json(fallback);
  }

  try {
    const response = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are Pahuna AI. Rank stay listings for Karnali travelers. Return only valid JSON. Keep slugs exactly as provided and never invent contact details.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "Rank these stay listings and explain matches.",
              input,
              requiredShape: fallback,
              availableStays: serviceProviders,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json(fallback);
    }

    const ai = extractJson(content);
    return NextResponse.json(ai ? { ...fallback, ...ai } : fallback);
  } catch {
    return NextResponse.json(fallback);
  }
}

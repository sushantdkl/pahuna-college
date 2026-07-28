import { NextResponse } from "next/server";
import { foodProviders } from "@server/services/food";
import { serviceProviders } from "@server/services/service-providers";

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = process.env.MISTRAL_MODEL || "mistral-small-latest";

function fallbackPlan(input: Record<string, any>) {
  const days = Number(input.numberOfDays || input.days || 3);
  const destination = String(input.destinationInterest || input.destination || "Surkhet");

  return {
    summary: `A practical ${Math.max(1, days)} day ${destination} and Karnali travel plan.`,
    difficultyScore: destination === "Surkhet" ? "EASY" : "MODERATE",
    familyFriendliness: "HIGH",
    recommendedRoute: [
      {
        step: 1,
        from: String(input.startingCity || "Surkhet"),
        to: destination,
        mode: String(input.transportPreference || "Mixed"),
        durationRange: destination === "Surkhet" ? "30 min - 1 hr" : "1-2 days",
        costRange: String(input.budgetRange || "Depends on route"),
        reliability: "Medium",
        notes: "Confirm road and weather conditions before travel.",
      },
    ],
    days: Array.from({ length: Math.min(Math.max(1, days), 7) }, (_, index) => ({
      day: index + 1,
      title: index === 0 ? "Explore Surkhet" : `${destination} route day ${index + 1}`,
      morning: "Start early and confirm local transport.",
      afternoon: "Visit nearby destinations and keep time for meals.",
      evening: "Return to your stay and review the next day route.",
      suggestedDestinations: [destination],
      estimatedDailyCostRange: String(input.budgetRange || "NPR 5,000 - 10,000"),
    })),
    suggestedStays: serviceProviders.slice(0, 2).map((stay) => ({
      slug: stay.slug,
      name: stay.name,
      type: stay.typeLabel || stay.type,
      district: stay.district,
      area: stay.area,
      priceFrom: stay.priceFrom,
      currency: stay.currency || "NPR",
      verificationLabel: stay.verificationLabel || "Verified",
      reason: "Useful base for this route and travel style.",
    })),
    suggestedServices: serviceProviders.slice(0, 2).map((provider) => ({
      slug: provider.slug,
      name: provider.name,
      type: provider.typeLabel || provider.type,
      district: provider.district,
      area: provider.area,
      verificationLabel: provider.verificationLabel || "Verified",
      reason: "Relevant local support for the selected route.",
    })),
    suggestedFoodProviders: foodProviders.slice(0, 2).map((provider) => ({
      slug: provider.slug,
      name: provider.name,
      type: provider.type,
      area: provider.area,
      cuisines: provider.cuisines || [],
      verificationLabel: provider.verificationLabel || "Verified",
      reason: "Good local stop for meals or coffee.",
    })),
    estimatedCost: {
      transport: "NPR 1,500 - 8,000",
      stay: "NPR 2,500 - 12,000 per night",
      food: "NPR 800 - 2,500 per day",
      activities: "NPR 500 - 5,000",
      totalRange: String(input.budgetRange || "NPR 10,000 - 35,000"),
    },
    warnings: ["Routes and availability require local confirmation."],
    disclaimer: "AI suggestions are planning guidance only. Confirm prices, routes, permits, and availability with Pahuna or local providers.",
  };
}

function fallbackAnswer(input: Record<string, any>) {
  const question = String(input.question || input.prompt || "Pahuna travel question");
  return {
    mode: "ask",
    answer: `Here is the practical Pahuna guidance for: "${question}". Use Surkhet as the easiest Karnali base, confirm route conditions locally, compare verified stays and food providers on Pahuna, and treat prices or availability as estimates until the Pahuna team or provider confirms them.`,
    notes: [
      "Information is planning guidance, not a confirmed booking or live availability result.",
      "Provider contact details should only be used when consent is published.",
    ],
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
  if (input.mode === "ask") {
    const fallback = fallbackAnswer(input);

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
          messages: [
            {
              role: "system",
              content:
                "You are Pahuna AI for Karnali Nepal travel, stays, food, routes, training, and consulting. Give concise, cautious answers. Do not invent live availability, exact prices, or private contact details.",
            },
            {
              role: "user",
              content: JSON.stringify({
                question: input.question,
                availableStays: serviceProviders.slice(0, 8),
                availableFoodProviders: foodProviders.slice(0, 8),
              }),
            },
          ],
        }),
      });

      if (!response.ok) return NextResponse.json(fallback);
      const payload = await response.json();
      const answer = payload?.choices?.[0]?.message?.content;
      return NextResponse.json({
        ...fallback,
        answer: typeof answer === "string" ? answer : fallback.answer,
      });
    } catch {
      return NextResponse.json(fallback);
    }
  }

  const fallback = fallbackPlan(input);

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
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are Pahuna AI, a Karnali Nepal travel concierge. Return only valid JSON matching the provided shape. Use cautious local-travel guidance and never invent direct phone numbers.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "Create a practical travel plan.",
              input,
              requiredShape: fallback,
              availableStays: serviceProviders,
              availableFoodProviders: foodProviders,
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

    return NextResponse.json({ ...fallback, ...extractJson(content) });
  } catch {
    return NextResponse.json(fallback);
  }
}

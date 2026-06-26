import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are DietDost, a nutrition expert specialised in Indian food.
Your job is to analyse a meal description written in plain English (or Hinglish) and return structured nutritional data.

RULES:
- Identify every dish/drink mentioned. If quantities are vague, use standard Indian portion sizes.
- All calorie/macro values should be realistic for the Indian versions of these dishes.
- Return ONLY a valid JSON object — no markdown, no prose, no code fences.
- Use this exact JSON shape:

{
  "dishes": [
    {
      "name": "string — dish name in English",
      "servingLabel": "string — e.g. '1 plate', '1 cup', '2 pieces'",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "notes": "string — 2-3 sentence practical tip about this meal for an Indian diet"
}`;

export async function POST(req: NextRequest) {
  try {
    const geminiModel = getGeminiModel();
    if (!geminiModel) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 503 },
      );
    }

    const body = await req.json() as { meal?: string };
    const meal = body.meal?.trim();

    if (!meal) {
      return NextResponse.json({ error: "meal description is required" }, { status: 400 });
    }

    const prompt = `${SYSTEM_PROMPT}\n\nMeal description: "${meal}"`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any accidental markdown code fences
    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const parsed = JSON.parse(clean) as {
      dishes: Array<{
        name: string;
        servingLabel: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }>;
      total_calories: number;
      total_protein: number;
      total_carbs: number;
      total_fat: number;
      notes: string;
    };

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during meal analysis";
    console.error("[/api/ai/analyse] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

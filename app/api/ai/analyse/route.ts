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

type ParsedAnalysis = {
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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientGeminiError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /503|Service Unavailable|high demand|temporar|overload|rate/i.test(message);
}

function parseGeminiJson(text: string): ParsedAnalysis {
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(clean) as ParsedAnalysis;
}

async function generateAnalysis(geminiModel: NonNullable<ReturnType<typeof getGeminiModel>>, meal: string) {
  const prompt = `${SYSTEM_PROMPT}\n\nMeal description: "${meal}"`;
  try {
    const result = await geminiModel.generateContent(prompt);
    return parseGeminiJson(result.response.text().trim());
  } catch (error) {
    if (!isTransientGeminiError(error)) throw error;
    await wait(900);
    const result = await geminiModel.generateContent(prompt);
    return parseGeminiJson(result.response.text().trim());
  }
}

function splitMealInput(meal: string) {
  return meal
    .split(/\s*(?:,|\+|&|\band\b|\bwith\b)\s*/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 2)
    .slice(0, 8);
}

function combineAnalyses(results: ParsedAnalysis[], notes: string) {
  const dishes = results.flatMap((result) => result.dishes || []);
  return {
    dishes,
    total_calories: dishes.reduce((sum, dish) => sum + Number(dish.calories || 0), 0),
    total_protein: dishes.reduce((sum, dish) => sum + Number(dish.protein || 0), 0),
    total_carbs: dishes.reduce((sum, dish) => sum + Number(dish.carbs || 0), 0),
    total_fat: dishes.reduce((sum, dish) => sum + Number(dish.fat || 0), 0),
    notes,
  };
}

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

    try {
      const parsed = await generateAnalysis(geminiModel, meal);
      return NextResponse.json(parsed);
    } catch (err) {
      if (!isTransientGeminiError(err)) throw err;

      const parts = splitMealInput(meal);
      if (parts.length <= 1) throw err;

      const settled = await Promise.allSettled(parts.map((part) => generateAnalysis(geminiModel, part)));
      const successes = settled
        .filter((result): result is PromiseFulfilledResult<ParsedAnalysis> => result.status === "fulfilled")
        .map((result) => result.value)
        .filter((result) => result.dishes?.length);

      if (successes.length === 0) throw err;

      return NextResponse.json({
        ...combineAnalyses(successes, "Gemini was busy, so DietDost saved the dishes it could parse. Review the items before adding them."),
        partial: successes.length < parts.length,
        warning: successes.length < parts.length
          ? "Gemini is under high demand. Some dishes could not be analysed right now."
          : undefined,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during meal analysis";
    console.error("[/api/ai/analyse] error:", message);
    const friendly = isTransientGeminiError(err)
      ? "Gemini is busy right now. Your meal text is saved here, so wait a moment and try again."
      : message;
    return NextResponse.json({ error: friendly }, { status: isTransientGeminiError(err) ? 503 : 500 });
  }
}

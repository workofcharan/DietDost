import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are DietDost, a friendly and knowledgeable AI nutrition assistant specialised in Indian food and South Asian dietary habits.

PERSONA & STYLE:
- Warm, encouraging, and practical.
- Use relatable Indian food references naturally (dal, roti, sabzi, chai, etc.).
- Give clear, actionable advice — not generic disclaimers.
- Keep responses concise (3-5 sentences max unless a list is genuinely useful).
- Use bullet points for lists of items or steps; otherwise, use natural prose.
- NEVER suggest medical diagnoses or replace a doctor.

KNOWLEDGE AREAS:
- Indian food macros and calorie counts (regional variations welcome)
- Healthy food swaps for common Indian meals
- Indian diet for fitness goals: weight loss, muscle gain, maintenance
- Practical meal timing, hydration, and portion control in Indian context`;

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { messages?: ChatMessage[]; query?: string };
    const { messages = [], query } = body;

    if (!query?.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    // Build conversation history as a flat prompt
    const history = messages
      .map((m) => `${m.sender === "user" ? "User" : "DietDost"}: ${m.text}`)
      .join("\n");

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${history ? `Conversation so far:\n${history}\n\n` : ""}User: ${query.trim()}\nDietDost:`;

    const result = await geminiModel.generateContent(fullPrompt);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error in chat";
    console.error("[/api/ai/chat] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

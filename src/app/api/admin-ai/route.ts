import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === "true";
const MODEL_NAME = "gemini-2.5-flash";

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not configured. AI assistant endpoint will remain disabled.");
}

export async function POST(request: Request) {
  if (!AI_ENABLED) {
    return NextResponse.json(
      { error: "AI features are disabled. Enable NEXT_PUBLIC_AI_ENABLED=true." },
      { status: 503 }
    );
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 503 });
  }

  try {
    const payload = await request.json();
    const question = String(payload?.question ?? "").trim();
    const context = payload?.context ?? {};

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const systemPrompt = `You are an executive analytics assistant for a premium e-commerce storefront. Use only the anonymous store metrics in the provided context. Answer the user clearly, provide action-oriented insights, and do not mention internal implementation details. If the question is in Arabic, answer in Arabic; otherwise answer in English.`;

    const contextText = `Store snapshot:\n${context.summary || "No summary available."}\nRevenue series: ${JSON.stringify(
      context.revenueSeries ?? []
    )}\nChannel breakdown: ${JSON.stringify(context.channelBreakdown ?? [])}`;

    const requestBody = {
      messages: [
        {
          role: "system",
          content: [{ type: "text", text: `${systemPrompt}\n\n${contextText}` }],
        },
        {
          role: "user",
          content: [{ type: "text", text: question }],
        },
      ],
      temperature: 0.45,
      maxOutputTokens: 400,
    };

    const response = await fetch(
      `https://generativeai.googleapis.com/v1/models/${MODEL_NAME}:generateMessage?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `Gemini API request failed: ${response.status} ${errorBody}` },
        { status: 502 }
      );
    }

    const result = (await response.json()) as {
      candidates?: Array<{
        message?: {
          content?: Array<{ text?: string }>;
        };
      }>;
    };
    const answer = result?.candidates?.[0]?.message?.content
      ?.map((item) => item.text)
      .join(" ")
      .trim();

    return NextResponse.json({ answer: answer || "Unable to interpret the AI response." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === "true";
const MODEL_NAMES = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not configured. AI assistant endpoint will remain disabled.");
}

async function callGemini(model: string, requestBody: unknown) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return response;
    }

    if (response.status !== 503) {
      return response;
    }

    if (attempt < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
    }
  }

  return null;
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
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\n${contextText}\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 400,
      },
    };

    let response = null;
    let lastErrorBody = null;

    for (const model of MODEL_NAMES) {
      const res = await callGemini(model, requestBody);
      if (!res) {
        continue;
      }

      if (res.ok) {
        response = res;
        break;
      }

      if (res.status === 503) {
        lastErrorBody = await res.text();
        continue;
      }

      const errorBody = await res.text();
      return NextResponse.json(
        { error: `Gemini API request failed: ${res.status} ${errorBody}` },
        { status: 502 }
      );
    }

    if (!response) {
      return NextResponse.json(
        {
          error: "خدمة الذكاء الاصطناعي مشغولة مؤقتًا. يُرجى المحاولة مرة أخرى بعد قليل.",
          details: lastErrorBody || "Gemini service unavailable.",
        },
        { status: 503 }
      );
    }

    const result = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const answer = result?.candidates?.[0]?.content?.parts
      ?.map((item) => item.text)
      .join("\n")
      .trim();

    return NextResponse.json({ answer: answer || "Unable to interpret the AI response." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { NextRequest } from "next/server";

const SUPPORTED_SYMBOLS = ["BHD", "SAR", "AED", "KWD", "OMR", "QAR", "USD"];

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get("base") ?? "BHD";
  const symbols = request.nextUrl.searchParams.get("symbols") ?? SUPPORTED_SYMBOLS.join(",");

  const apiUrl = new URL("https://api.exchangerate.host/latest");
  apiUrl.searchParams.set("base", base);
  apiUrl.searchParams.set("symbols", symbols);

  const response = await fetch(apiUrl.toString(), { next: { revalidate: 3600 } });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Unable to fetch exchange rates" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

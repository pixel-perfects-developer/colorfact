import { NextResponse } from "next/server";

// ✅ Force Node.js runtime (so it can use standard fetch & modules properly on Vercel)
export const runtime = "nodejs";

// ✅ Keep forced dynamic rendering
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const color = searchParams.get("color");
    const clothing_type = searchParams.get("clothing_type");
    const gender = searchParams.get("gender");

    // ✅ Validate query params
    if (!color || !clothing_type || !gender) {
      return NextResponse.json(
        { message: "Missing required parameters: color, clothing_type, or gender" },
        { status: 400 }
      );
    }

    // ✅ Build upstream API URL
    const apiUrl = `https://api.madtech-group.com/outfit_by_color/?color=${encodeURIComponent(
      color
    )}&clothing_type=${encodeURIComponent(clothing_type)}&gender=${encodeURIComponent(gender)}`;

    // ✅ Forward request to external API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store", // ensures fresh data on Vercel
    });

    // ✅ Parse response safely
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // ✅ Return response with correct status
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("💥 Proxy error:", err);
    return NextResponse.json(
      { message: "Proxy request failed", error: err.message },
      { status: 500 }
    );
  }
}

// ✅ Handle CORS preflight and avoid 405 on Vercel
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const color = searchParams.get("color");
    const clothing_type = searchParams.get("clothing_type");
    const gender = searchParams.get("gender");

    if (!color || !clothing_type || !gender) {
      return NextResponse.json(
        { message: "Missing required parameters: color, clothing_type, or gender" },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.madtech-group.com/outfit_by_color/?color=${encodeURIComponent(
      color
    )}&clothing_type=${encodeURIComponent(clothing_type)}&gender=${encodeURIComponent(gender)}`;

    const response = await fetch(apiUrl, { method: "GET", headers: { Accept: "application/json" } });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { message: "Proxy request failed", error: err.message },
      { status: 500 }
    );
  }
}

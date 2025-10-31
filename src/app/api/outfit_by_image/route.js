import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Parse form data (Next.js auto handles multipart)
    const formData = await req.formData();
    const file = formData.get("file");
    const clothing_type = formData.get("clothing_type");
    const gender = formData.get("gender");

    if (!file || !clothing_type || !gender) {
      return NextResponse.json(
        { message: "Missing required form data: file, clothing_type or gender" },
        { status: 400 }
      );
    }
    // Build form to send to external API
    const forwardForm = new FormData();
    forwardForm.append("file", file);
    forwardForm.append("clothing_type", clothing_type);
    forwardForm.append("gender", gender);

    const apiUrl = "https://api.madtech-group.com/outfit_by_image/";

    const response = await fetch(
      `${apiUrl}?clothing_type=${encodeURIComponent(clothing_type)}&gender=${encodeURIComponent(gender)}`,
      {
        method: "POST",
        body: forwardForm,
        duplex: "half", // required for streaming form data
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      console.error("❌ Upstream API error:", data);
      return NextResponse.json(
        { message: "Upstream API error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("💥 Proxy error:", err);
    return NextResponse.json(
      { message: "Proxy request failed", error: err.message },
      { status: 500 }
    );
  }
}

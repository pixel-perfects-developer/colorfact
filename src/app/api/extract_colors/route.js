import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // ✅ Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file found in the request" },
        { status: 400 }
      );
    }

    // ✅ Build new form for external API
    const forwardForm = new FormData();
    forwardForm.append("file", file);

    // ✅ Forward to external API
    const response = await fetch("https://api.madtech-group.com/extract_colors/", {
      method: "POST",
      body: forwardForm,
      duplex: "half", // required for streaming multipart uploads
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // ✅ Forward external response directly
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("💥 Proxy error:", err);
    return NextResponse.json(
      { message: "Proxy request failed", error: err.message },
      { status: 500 }
    );
  }
}

// ✅ Add OPTIONS to fix “405 Method Not Allowed” on Vercel preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

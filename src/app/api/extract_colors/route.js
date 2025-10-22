import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Parse multipart form data from the incoming request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file found in the request" },
        { status: 400 }
      );
    }

    // Build a new FormData to send to the external API
    const forwardForm = new FormData();
    forwardForm.append("file", file);

    // Forward to external API
    const response = await fetch("https://api.madtech-group.com/extract_colors/", {
      method: "POST",
      body: forwardForm,
      duplex: "half",
    });

    const data = await response.text();
    return new NextResponse(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { message: "Proxy request failed", error: err.message },
      { status: 500 }
    );
  }
}

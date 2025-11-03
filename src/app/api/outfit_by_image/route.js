import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    // Parse form data from the incoming request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Extract query parameters (e.g., clothing_type, gender)
    const { searchParams } = new URL(req.url);
    const clothing_type = searchParams.get("clothing_type");
    const gender = searchParams.get("gender");
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ;
    // Construct the external API URL with query params
    const externalApi = `${BACKEND_URL}outfit_by_image/?clothing_type=${clothing_type}&gender=${gender}`;

    // Forward the request to the external API
    const response = await fetch(externalApi, {
      method: "POST",
      body: formData,
    });

    // Get response text and parse as JSON if possible
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // Return the API response back to frontend
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Proxy failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

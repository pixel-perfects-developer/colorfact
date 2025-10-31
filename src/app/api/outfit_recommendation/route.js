import { NextResponse } from "next/server";
import axios from "axios";

// ✅ Force Node.js runtime (Edge runtime can't load axios.cjs)
export const runtime = "nodejs";

// ✅ Optional: keep your forced dynamic behavior if needed
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.madtech-group.com";

export async function GET(req) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    // ✅ Get all query parameters
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    // ✅ Forward GET request to backend API
    const response = await axios.get(`${BACKEND_URL}outfit_recommendation`, {
      params: query,
      timeout: 20000, // safety timeout
    });

    console.log("✅ Forwarded to backend successfully");
    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("❌ Proxy error (outfit_recommendation):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return NextResponse.json(
      {
        error:
          error.response?.data ||
          error.message ||
          "Failed to fetch outfit recommendation",
      },
      { status: error.response?.status || 500 }
    );
  }
}

// ✅ Add OPTIONS to fix “Method Not Allowed” preflight issues on Vercel
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

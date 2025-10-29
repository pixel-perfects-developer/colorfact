import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Forward all query params to your real backend API
    const response = await axios.get(`${BACKEND_URL}/outfit_recommendation`, {
      params: Object.fromEntries(searchParams.entries()),
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("❌ Proxy error (outfit_recommendation):", error);
    return NextResponse.json(
      { error: "Failed to fetch outfit recommendation" },
      { status: error.response?.status || 500 }
    );
  }
}

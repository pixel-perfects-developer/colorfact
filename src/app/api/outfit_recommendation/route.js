import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; // should be https://api.madtech-group.com

export async function GET(req) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    // get all query params
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    // forward request to backend
    const response = await axios.get(`${BACKEND_URL}outfit_recommendation`, {
      params: query,
      timeout: 20000, // 20s safety timeout
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
        error: error.response?.data || error.message || "Failed to fetch outfit recommendation" 
      },
      { status: error.response?.status || 500 }
    );
  }
}

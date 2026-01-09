import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
// Example: https://api.colorfact.ai/

export const getOutfitByColor = async ({ color, clothing_type, gender }) => {
  try {
    // ✅ Directly call the backend API with query params
    const res = await axios.get(`${BACKEND_URL}outfit_by_color/`, {
      params: {
        color,
        clothing_type,
        gender,
      },
      headers: {
        Accept: "application/json",
      },
    });

    // ✅ Parse response safely
    const data =
      typeof res.data === "string" ? JSON.parse(res.data) : res.data;

    return data;
  } catch (error) {
    console.error("Error calling outfit_by_color directly:", error);
    return {
      error: error.message || "Failed to fetch outfit suggestions",
    };
  }
};

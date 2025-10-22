import { customAxios } from "./instance";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ correct prefix for frontend

export const outfitByColor = async ({ color, clothing_type, gender }) => {
  try {
    const res = await customAxios.get(`${API_URL}outfit_by_color/`, {
      params: { color, clothing_type, gender },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching outfit by color:", err);
    throw err;
  }
};

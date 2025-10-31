import { customAxios } from "../../api/instance";

export const getOutfitByColor = async ({ color, clothing_type, gender }) => {
  try {
    const res = await customAxios.get("/api/outfit_by_color", {
      params: { color, clothing_type, gender },
      headers: { Accept: "application/json" },
    });

    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    return data;
  } catch (err) {
    console.error("Error fetching outfit by color:", err);
    return { error: err.message || "Failed to fetch outfit suggestions" };
  }
};

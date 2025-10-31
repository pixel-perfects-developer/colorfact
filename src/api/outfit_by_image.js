import axios from "axios";

export const getOutfitByImage = async (file, clothing_type, gender) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // 👇 send clothing_type and gender as query params, not form fields
    const res = await axios.post(
      `/api/outfit_by_image?clothing_type=${encodeURIComponent(clothing_type)}&gender=${encodeURIComponent(gender)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    return data;
  } catch (err) {
    console.error("Error fetching outfit by image:", err);
    return { error: err.message || "Failed to fetch outfit suggestions" };
  }
};

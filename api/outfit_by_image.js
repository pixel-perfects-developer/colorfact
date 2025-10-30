import { customAxios } from "./instance";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const outfitByImage = async (file, clothing_type, gender) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("clothing_type", clothing_type);
  formData.append("gender", gender);

  try {
    const res = await customAxios.post(`${API_URL}/outfit_by_image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching outfit by image:", err);
    throw err;
  }
};

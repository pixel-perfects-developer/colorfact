import { customAxios } from "./instance";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const extractColors = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await customAxios.post(`${API_URL}/extract_colors/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Color extraction failed:", err);
    throw err;
  }
};

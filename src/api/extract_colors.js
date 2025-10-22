import axios from "axios";

export const extractColors = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/api/extract_colors", formData, {
    headers: {
      Accept: "application/json",
    },
  });

  try {
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    return data.colors?.[0] || data.color || data;
  } catch {
    return res.data;
  }
};

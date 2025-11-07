// import axios from "axios";

// export const extractColors = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await axios.post("/api/extract_colors", formData, {
//     headers: {
//       Accept: "application/json",
//     },
//   });

//   try {
//     const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
//     return data.colors || data.color || data;
//   } catch {
//     return res.data;
//   }
// };
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; // Example: https://api.colorfact.ai/

export const extractColors = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ Call your backend endpoint directly
    const res = await axios.post(`${BACKEND_URL}extract_colors/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    // ✅ Parse response safely
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    return data.colors || data.color || data;
  } catch (error) {
    console.error("Error calling backend directly:", error);
    return { error: error.message || "Failed to extract colors" };
  }
};

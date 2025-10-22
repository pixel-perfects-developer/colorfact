// import { customAxios } from "./instance";

const { customAxios } = require("./instance");

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const extractColors = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const res = await customAxios.post(`${API_URL}/extract_colors/`, formData);
//     return res.data.colors?.[0] || null;
//   } catch (err) {
//     console.error("❌ Color extraction failed:", err.response?.data || err);
//     throw err;
//   }
// };

const formData = new FormData();
formData.append("file", file);

const res = await customAxios.post("/api/extract_colors", formData);
console.log(res.data);

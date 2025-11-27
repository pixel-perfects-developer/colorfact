// import axios from "axios";

// export const getOutfitByImage = async (file, clothing_type, gender) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);

//     // 👇 send clothing_type and gender as query params, not form fields
//     const res = await axios.post(
//       `/api/outfit_by_image?clothing_type=${encodeURIComponent(clothing_type)}&gender=${encodeURIComponent(gender)}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Accept: "application/json",
//         },
//       }
//     );

//     const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
//     return data;
//   } catch (err) {
//     console.error("Error fetching outfit by image:", err);
//     return { error: err.message || "Failed to fetch outfit suggestions" };
//   }
// };
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; 
// Example: https://api.colorfact.ai/

export const getOutfitByImage = async (file, clothing_type, gender) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ Call the backend API directly
    const response = await axios.post(
      `${BACKEND_URL}outfit_by_image/?clothing_type=${encodeURIComponent(clothing_type)}&gender=${encodeURIComponent(gender)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;

    return data;
  } catch (error) {
    console.error("Error calling outfit_by_image directly:", error);
    return {
      error: error.message || "Failed to get outfit recommendations",
    };
  }
};

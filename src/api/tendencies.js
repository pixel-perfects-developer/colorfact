import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;


export const getAllTendencies = async () => {

  try {
    const response = await axios.get(`${BACKEND_URL}tendances/?published=true`);
    return response.data;
  } catch (error) {
    console.error("❌ API ERROR:", error);
    throw error;
  }
};
export const getTendenciesById = async (id) => {

  try {
    const response = await axios.get(`${BACKEND_URL}tendances/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ API ERROR:", error);
    throw error;
  }
};


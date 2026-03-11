import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const getAllTendencies = async () => {

  try {
    const response = await api.get("/tendances/?published=true");
    return response.data;
  } catch (error) {
    console.error("❌ API ERROR:", error);
    throw error;
  }
};
export const getTendenciesById = async (id) => {

  try {
    const response = await api.get(`/tendances/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ API ERROR:", error);
    throw error;
  }
};


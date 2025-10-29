import { customAxios } from "../../api/instance";

/**
 * Calls the outfit recommendation API.
 * @param {Object} options
 * @param {string[]} options.inputColors - Array of hex colors (e.g. ['#AABBCC'])
 * @param {string} [options.type] - Outfit type (e.g. 'Casual été')
 * @param {number} [options.minPrice=0] - Minimum price filter
 * @param {number} [options.maxPrice=1000] - Maximum price filter
 * @param {string[]} [options.wantedBrands=[]] - Brands to include
 * @param {string[]} [options.removedBrands=[]] - Brands to exclude
 * @returns {Promise<Object>} - API response data
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ correct prefix for frontend

export const getOutfitRecommendation = async ({
    inputColors,
    type,
    minPrice = 0,
    maxPrice = 1000,
    wantedBrands = [],
    removedBrands = [],
}) => {
    try {
        const params = new URLSearchParams();

        // Required
        if (!inputColors || inputColors.length === 0) {
            throw new Error("Missing input colors for outfit recommendation.");
        }
        params.append("input_colors", inputColors.join(","));

        // Optional
        if (type) params.append("type", type);
        if (minPrice !== undefined) params.append("minPrice", minPrice);
        if (maxPrice !== undefined) params.append("maxPrice", maxPrice);
        if (wantedBrands.length > 0)
            params.append("wanted_brands", wantedBrands.join(","));
        if (removedBrands.length > 0)
            params.append("removed_brands", removedBrands.join(","));

        // 🔗 Call the real endpoint
        const response = await axios.get(`${API_URL}/outfit_recommendation`, { params });

        return response.data;
    } catch (error) {
        console.error("❌ Error calling outfit recommendation API:", error);
        throw error;
    }
};

import axios from "axios";

/**
 * Get AI outfit recommendations.
 * This calls your local API route: /api/outfit_recommendation
 * which proxies the real backend endpoint.
 *
 * @param {Object} options
 * @param {string[]} options.inputColors - Array of hex colors (e.g. ['#AABBCC'])
 * @param {string} [options.type] - Outfit type (optional)
 * @param {number} [options.minPrice=0] - Minimum price filter
 * @param {number} [options.maxPrice=1000] - Maximum price filter
 * @param {string[]} [options.wantedBrands=[]] - Brands to include
 * @param {string[]} [options.removedBrands=[]] - Brands to exclude
 * @returns {Promise<Object>} - Outfit recommendation response data
 */

export const getOutfitRecommendation = async ({
  inputColors,
  type,
  minPrice = 0,
  maxPrice = 1000,
  wantedBrands = [],
  removedBrands = [],
}) => {
  try {
    if (!inputColors || inputColors.length === 0) {
      throw new Error("❌ Missing input colors for outfit recommendation.");
    }

    const params = {
      input_colors: inputColors.join(","),
      type,
      minPrice,
      maxPrice,
      wanted_brands: wantedBrands.join(","),
      removed_brands: removedBrands.join(","),
    };

    const res = await axios.get("/api/outfit_recommendation", { params });
    return res.data;
  } catch (error) {
    console.error("🔥 Error fetching outfit recommendation:", error);
    throw error;
  }
};

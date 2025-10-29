import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Async thunk — calls outfit recommendation endpoint (through local proxy)
 */
export const fetchOutfitRecommendation = createAsyncThunk(
  "outfitRecommendation/fetch",
  async (
    { inputColors, type, minPrice = 0, maxPrice = 1000, wantedBrands = [], removedBrands = [] },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (!inputColors || inputColors.length === 0)
        throw new Error("No input colors provided.");

      params.append("input_colors", inputColors.join(","));
      if (type) params.append("type", type);
      params.append("minPrice", minPrice);
      params.append("maxPrice", maxPrice);
      if (wantedBrands.length > 0) params.append("wanted_brands", wantedBrands.join(","));
      if (removedBrands.length > 0) params.append("removed_brands", removedBrands.join(","));

      const response = await axios.get(`${API_URL}/outfit_recommendation`, { params });
      return response.data;
    } catch (err) {
      console.error("❌ fetchOutfitRecommendation error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const outfitRecommendationSlice = createSlice({
  name: "outfitRecommendation",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearRecommendation: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutfitRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutfitRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOutfitRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching outfit recommendations.";
      });
  },
});

export const { clearRecommendation } = outfitRecommendationSlice.actions;
export default outfitRecommendationSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  outfits: [],          // Stores all outfit types returned (e.g., Casual été, Professionnel)
  selectedOutfit: null, // Currently selected outfit (for details page)
  articles: [],          // List of detailed articles fetched from /outfit_recommendation
  loading: false,        // For async state
  error: null,           // To store API errors
};

const outfitRecommendationSlice = createSlice({
  name: "outfitRecommendation",
  initialState,
  reducers: {
    setOutfits: (state, action) => {
      state.outfits = action.payload;
    },
    setSelectedOutfit: (state, action) => {
      state.selectedOutfit = action.payload;
    },
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearOutfitData: (state) => {
      state.outfits = [];
      state.selectedOutfit = null;
      state.articles = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOutfits,
  setSelectedOutfit,
  setArticles,
  setLoading,
  setError,
  clearOutfitData,
} = outfitRecommendationSlice.actions;

export default outfitRecommendationSlice.reducer;

// src/features/color/colorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colors: [], // All extracted or selected colors
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColors: (state, action) => {
      state.colors = action.payload;
    },
    addColor: (state, action) => {
      state.colors.push(action.payload);
    },
    clearColors: (state) => {
      state.colors = [];
    },
  },
});

export const { setColors, addColor, clearColors } = colorSlice.actions;
export default colorSlice.reducer;

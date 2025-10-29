// src/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import colorReducer from "./slices/colorSlice";
import imageDetailsReducer from "./slices/imageDetailsSlice";
import outfitRecommendationReducer from "./slices/outfitRecommendationSlice";

const rootReducer = combineReducers({
  color: colorReducer,
  imageDetails: imageDetailsReducer,
      outfitRecommendation: outfitRecommendationReducer,

});

export default rootReducer;

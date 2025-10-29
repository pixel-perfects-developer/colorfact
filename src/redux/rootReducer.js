// src/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import colorReducer from "./slices/colorSlice";
import imageDetailsReducer from "./slices/imageDetailsSlice";

const rootReducer = combineReducers({
  color: colorReducer,
  imageDetails: imageDetailsReducer,
});

export default rootReducer;

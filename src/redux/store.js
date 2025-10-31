"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import colorReducer from "./slices/colorSlice";
import imageDetailsReducer from "./slices/imageDetailsSlice";
import outfitRecommendationReducer from "./slices/outfitRecommendationSlice";

const rootReducer = combineReducers({
  color: colorReducer,
  imageDetails: imageDetailsReducer,
  outfitRecommendation: outfitRecommendationReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

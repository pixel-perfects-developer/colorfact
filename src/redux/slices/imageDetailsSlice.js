import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    details: null, // store outfit API response here
    status: "idle", // idle | loading | success | error
    error: null,
};

const imageDetailsSlice = createSlice({
    name: "imageDetails",
    initialState,
    reducers: {
        setImageDetails: (state, action) => {
            state.details = action.payload;
            state.status = "success";
        },
        clearImageDetails: (state) => {
            state.details = null;
            state.status = "idle";
            state.error = null;
        },
        setLoading: (state) => {
            state.status = "loading";
        },
        setError: (state, action) => {
            state.status = "error";
            state.error = action.payload;
        },
    },
});

export const { setImageDetails, clearImageDetails, setLoading, setError } =
    imageDetailsSlice.actions;
export default imageDetailsSlice.reducer;

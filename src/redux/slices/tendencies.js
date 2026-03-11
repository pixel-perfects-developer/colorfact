import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tendancesList: [],
    selectedTendance: null,
};

const tendenciesSlice = createSlice({
    name: "tendencies",
    initialState,
    reducers: {
        setTendances: (state, action) => {
            state.tendancesList = action.payload;
        },
        setSelectedTendance: (state, action) => {
            state.selectedTendance = action.payload;
        },
        clearSelectedTendance: (state) => {
            state.selectedTendance = null;
        },
    },
});

export const { setTendances, setSelectedTendance, clearSelectedTendance } =
    tendenciesSlice.actions;

export default tendenciesSlice.reducer;
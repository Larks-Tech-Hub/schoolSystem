import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    termsList: [],
    loading: false,
    error: null,
    response: null,
};

const termSlice = createSlice({
    name: 'term',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.termsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError
} = termSlice.actions;

export const termReducer = termSlice.reducer;
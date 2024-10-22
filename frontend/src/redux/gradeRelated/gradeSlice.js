import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gradingList: [],
    loading: false,
    error: null,
    response: null,
};

const gradingSlice = createSlice({
    name: 'grading',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.gradingList = action.payload;
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
} = gradingSlice.actions;

export const gradingReducer = gradingSlice.reducer;
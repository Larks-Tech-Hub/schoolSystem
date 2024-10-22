import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    HeadTeacherCommentList: [],
    loading: false,
    error: null,
    response: null,
};

const HeadTeacherCommentSlice = createSlice({
    name: 'HeadTeacherComment',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.HeadTeacherCommentList = action.payload;
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
} = HeadTeacherCommentSlice.actions;

export const HeadTeacherCommentReducer = HeadTeacherCommentSlice.reducer;
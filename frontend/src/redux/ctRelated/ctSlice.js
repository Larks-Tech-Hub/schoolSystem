import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ClassTeacherCommentList: [],
    loading: false,
    error: null,
    response: null,
};

const ClassTeacherCommentSlice = createSlice({
    name: 'ClassTeacherComment',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.ClassTeacherCommentList = action.payload;
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
} = ClassTeacherCommentSlice.actions;

export const ClassTeacherCommentReducer = ClassTeacherCommentSlice.reducer;
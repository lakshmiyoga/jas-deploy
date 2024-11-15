import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        postloading: false,
        postcategory: null,
        posterror: null,
        getloading: false,
        getcategory: null,
        geterror: null,
        deleteloading: false,
        deletecategory: null,
        deleteerror: null,
        updateloading: false,
        updatecategory: null,
        updateerror: null,
        singleCategory: null,     // State to hold single category data
        singleLoading: false,     // Loading state for fetching single category
        singleError: null,        // Error state for single category fetch
        isCategoryUpdated: false,
    },
    reducers: {
        categoryPostRequest(state) {
            state.postloading = true;
        },
        categoryPostSuccess(state, action) {
            state.postloading = false;
            state.postcategory = action.payload;
        },
        categoryPostFail(state, action) {
            state.postloading = false;
            state.posterror = action.payload;
        },
        categoryGetRequest(state) {
            state.getloading = true;
        },
        categoryGetSuccess(state, action) {
            state.getloading = false;
            state.getcategory = action.payload;
        },
        categoryGetFail(state, action) {
            state.getloading = false;
            state.geterror = action.payload;
        },
        cleargetCategory(state, action) {
            state.getloading = false;
            state.geterror = null;
            state.getcategory = null;
        },
        clearPostCategory(state, action) {
            state.postloading = false;
            state.postcategory = null;
            state.posterror = null;
        },
        categoryDeleteRequest(state) {
            state.deleteloading = true;
        },
        categoryDeleteSuccess(state, action) {
            state.deleteloading = false;
            state.deletecategory = action.payload;
        },
        categoryDeleteFail(state, action) {
            state.deleteloading = false;
            state.deleteerror = action.payload;
        },
        clearDeleteCategory(state, action) {
            state.deleteloading = false;
            state.deleteerror = null;
            state.deletecategory = null;
        },
        categoryUpdateRequest(state) {
            state.updateloading = true;
        },
        categoryUpdateSuccess(state, action) {
            state.updateloading = false;
            state.updatecategory = action.payload;
            state.isCategoryUpdated = true;
        },
        categoryUpdateFail(state, action) {
            state.updateloading = false;
            state.updateerror = action.payload;
        },
        clearupdateCategory(state, action) {
            state.updateloading = false;
            state.updateerror = null;
            state.updatecategory = null;
            state.isCategoryUpdated = false;
        },
        categorySingleRequest: (state) => {
            state.singleLoading = true;
            state.singleError = null;
        },
        categorySingleSuccess: (state, action) => {
            state.singleLoading = false;
            state.singleCategory = action.payload;
        },
        categorySingleFail: (state, action) => {
            state.singleLoading = false;
            state.singleError = action.payload;
        },

    },
});

const { actions, reducer } = categorySlice;

export const {
    categoryPostRequest,
    categoryPostSuccess,
    categoryPostFail,
    categoryGetRequest,
    categoryGetSuccess,
    categoryGetFail,
    clearPostCategory,
    categoryDeleteRequest,
    categoryDeleteSuccess,
    categoryDeleteFail,
    clearDeleteCategory,
    cleargetCategory,
    clearupdateCategory,
    categoryUpdateRequest,
    categoryUpdateSuccess,
    categoryUpdateFail,
    categorySingleRequest,
    categorySingleSuccess,
    categorySingleFail,

} = actions;

export default reducer;

import { createSlice } from "@reduxjs/toolkit";

const AddressSlice = createSlice({
    name: 'address',
    initialState: {
        postloading: false,
        postdata: null,
        posterror: null,
        getloading:false,
        getdata:null,
        geterror:null,
        deleteloading:false,
        deleteSuccess:null,
        deleteerror:null,
        defaultSuccess:null,
        defaultloading:false,
        defaulterror:null,
        updateloading:false,
        updatedata:null,
        updateerror:null,
    },
    reducers: {
        addressPostRequest(state) {
            state.postloading = true;
        },
        addressPostSuccess(state, action) {
            state.postloading = false;
            state.postdata = action.payload;
        },
        addressPostFail(state, action) {
            state.postloading = false;
            state.posterror = action.payload;
        },
        addressGetRequest(state) {
            state.getloading = true;
        },
        addressGetSuccess(state, action) {
            state.getloading = false;
            state.getdata = action.payload;
        },
        addressGetFail(state, action) {
            state.getloading = false;
            state.geterror = action.payload;
        },
        cleargetAddress(state, action) {
            state.getloading = false;
            state.geterror = null;
            state.getdata = null;
        },
        clearPostAddress(state, action) {
            state.postloading = false;
            state.postdata = null;
            state.posterror=null;
        },
        addressDeleteRequest(state) {
            state.deleteloading = true;
        },
        addressDeleteSuccess(state, action) {
            state.deleteloading = false;
            state.deleteSuccess = action.payload;
        },
        addressDeleteFail(state, action) {
            state.deleteloading = false;
            state.deleteerror = action.payload;
        },
        clearDeleteAddress(state, action) {
            state.deleteloading = false;
            state.deleteerror = null;
            state.deleteSuccess = null;
        },
        addressDefaultRequest(state) {
            state.defaultloading = true;
        },
        addressDefaultSuccess(state, action) {
            state.defaultloading = false;
            state.defaultSuccess = action.payload;
        },
        addressDefaultFail(state, action) {
            state.defaultloading = false;
            state.defaulterror = action.payload;
        },
        clearDefaultAddress(state, action) {
            state.defaultloading = false;
            state.defaulterror = null;
            state.defaultSuccess = null;
        },
        addressUpdateRequest(state) {
            state.updateloading = true;
        },
        addressUpdateSuccess(state, action) {
            state.updateloading = false;
            state.updatedata = action.payload;
        },
        addressUpdateFail(state, action) {
            state.updateloading = false;
            state.updateerror = action.payload;
        },
        clearupdateAddress(state, action) {
            state.updateloading = false;
            state.updateerror = null;
            state.updatedata = null;
        },

    },
});

const { actions, reducer } = AddressSlice;

export const {
    addressPostRequest,
    addressPostSuccess,
    addressPostFail,
    addressGetRequest,
    addressGetSuccess,
    addressGetFail,
    clearPostAddress,
    addressDeleteRequest,
    addressDeleteSuccess,
    addressDeleteFail,
    clearDeleteAddress,
    cleargetAddress,
    addressDefaultRequest,
    addressDefaultSuccess,
    addressDefaultFail,
    clearDefaultAddress,
    clearupdateAddress,
    addressUpdateRequest,
    addressUpdateSuccess,
    addressUpdateFail,
     
} = actions;

export default reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        sendLoading:false,
        sendError:null,
        error: null,
        sendMessage:null,
        message: null,
        isAuthenticated: false,
        token: null,
    },
    reducers: {
        sendOtpRequest(state) {
            state.sendLoading = true;
            // state.isAuthenticated = false;
            state.sendError = null;
        },
        sendOtpSuccess(state, action) {
            state.sendLoading = false;
            // state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.sendMessage = action.payload;
        },
        sendOtpFailure(state, action) {
            state.sendLoading = false;
            // state.isAuthenticated = false;
            state.sendError = action.payload;
        },
        clearSendOtp(state, action) {
            state.sendLoading = false;
            // state.isAuthenticated = false;
            state.sendMessage = null;
            state.sendError = null;
        },
        verifyOtpRequest(state) {
            state.verifyLoading = true;
            state.isAuthenticated = false;
            state.user = null;
            state.verifyError = null;
        },
        verifyOtpSuccess(state, action) {
            state.verifyLoading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
            // state.token = action.payload.token;
            state.message = action.payload;
        },
        verifyOtpFailure(state, action) {
            state.verifyLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.verifyError = action.payload;
        },
        clearVerifyError(state) {
            state.verifyError = null;
            state.verifyLoading=false;
            // state.isAuthenticated = false;
            // state.user = null;
        },
    },
});

export const {
    sendOtpRequest,
    sendOtpSuccess,
    sendOtpFailure,
    verifyOtpRequest,
    verifyOtpSuccess,
    verifyOtpFailure,
    clearVerifyError,
    clearSendOtp,
} = authSlice.actions;

export default authSlice.reducer;
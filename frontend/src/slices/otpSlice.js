import { createSlice } from "@reduxjs/toolkit";

const otpSlice = createSlice({
  name: 'otps',
  initialState: {
    loading: false,
    dummyisAuthenticated: false,
    dummyuser:null,
    otpdata: null,
    otperror: null,
    mailVerifiedData: null,
    verifyloading: false,
    mobileOtpdata: null,
    mobileVerifiedData: null,
    mobileOtploading: false,
    mobileVerifyloading: false,
  },
  reducers: {
    otpClear(state) {
      state.loading = false;
      state.otpdata = null;
      state.otperror = null;
      // state.mailVerifiedData = null;
      // state.verifyloading = false;
    },
    otpErrorClear(state){
        state.mailVerifyError=null;
        state.mobileOtperror=null;

    },
    mailOtpRequest(state) {
      state.otploading = true;
    },
    mailOtpSuccess(state, action) {
      state.otploading = false;
      state.otpdata = action.payload;
    },
    mailOtpFail(state, action) {
      state.otploading = false;
      state.otperror = action.payload;
    },
    mailVerifyRequest(state) {
      state.verifyloading = true;
    },
    mailVerifySuccess(state, action) {
      state.verifyloading = false;
      state.mailVerifiedData = action.payload;
      state.dummyisAuthenticated= true;
      state.dummyuser= action.payload.user;
    },
    mailVerifyFail(state, action) {
      state.verifyloading = false;
      state.mailVerifyError = action.payload;
    },
    mailClearError(state, action) {
      state.verifyloading = false;
      state.mailVerifyError = null;
      state.otperror = null;

    },
    mobileOtpRequest(state) {
      state.mobileOtploading = true;
    },
    mobileOtpSuccess(state, action) {
      state.mobileOtploading = false;
      state.mobileOtpdata = action.payload;
    },
    mobileOtpFail(state, action) {
      state.mobileOtploading = false;
      state.mobileOtperror = action.payload;
    },
    mobileVerifyRequest(state) {
      state.mobileVerifyloading = true;
    },
    mobileVerifySuccess(state, action) {
      state.mobileVerifyloading = false;
      state.mobileVerifiedData = action.payload;
    },
    mobileVerifyFail(state, action) {
      state.mobileVerifyloading = false;
      state.mobileVerifyError = action.payload;
    },
    mobileClearError(state, action) {
      state.mobileVerifyloading = false;
      state.mobileVerifyError = null;
      state.mobileOtperror = null;
    },
  },
});

const { actions, reducer } = otpSlice;

export const { 
  mailOtpRequest,
  mailOtpSuccess,
  mailOtpFail,
  mailVerifyRequest,
  mailVerifySuccess,
  mailVerifyFail,
  mobileOtpRequest,
  mobileOtpSuccess,
  mobileOtpFail,
  mobileVerifyRequest,
  mobileVerifySuccess,
  mobileVerifyFail,
  otpClear,
  otpErrorClear,
  mailClearError,
  mobileClearError,
} = actions;

export default reducer;

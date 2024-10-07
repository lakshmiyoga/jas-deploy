import { createSlice } from "@reduxjs/toolkit";


const otpSlice = createSlice({
    name: 'enrolls',
    initialState: {
        // otpdata:null,
        loading: false
    },
    reducers: {
        otpClear(state,action){
            return {
                loading: false,
                data: null,
                error:  null
            }
        },
        mailOtpRequest(state, action){
            return {
                otploading: true,
            }
        },
        mailOtpSuccess(state, action){
            return {
                otploading: false,
                otpdata: action.payload,
            }
        },
        mailOtpFail(state, action){
            return {
                otploading: false,
                otperror:  action.payload
            }
        },
        mailVerifyRequest(state, action){
            return {
                verifyloading: true,
            }
        },
        mailVerifySuccess(state, action){
            return {
                verifyloading: false,
                mailVerifiedData: action.payload,
            }
        },
        mailVerifyFail(state, action){
            return {
                verifyloading: false,
                mailVerifyError:  action.payload
            }
        },
        mobileOtpRequest(state, action){
            return {
                mobileOtploading: true,
            }
        },
        mobileOtpSuccess(state, action){
            return {
                mobileOtploading: false,
                mobileOtpdata: action.payload,
            }
        },
        mobileOtpFail(state, action){
            return {
                mobileOtploading: false,
                mobileOtperror:  action.payload
            }
        },
        mobileVerifyRequest(state, action){
            return {
                mobileVerifyloading: true,
            }
        },
        mobileVerifySuccess(state, action){
            return {
                mobileVerifyloading: false,
                mobileVerifiedData: action.payload,
            }
        },
        mobileVerifyFail(state, action){
            return {
                mobileVerifyloading: false,
                mobileVerifyError:  action.payload
            }
        },
    }
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
} = actions;

export default reducer;
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { sendOtpRequest, sendOtpSuccess, sendOtpFailure, verifyOtpRequest, verifyOtpSuccess, verifyOtpFailure } from '../slices/authSlice';

// Action to send OTP
export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async ({input,inputType}, { dispatch }) => {
        try {
            dispatch(sendOtpRequest());
            const response = await axios.post('/api/v1/send-otp', { input,inputType });
            console.log("success message",response);
            dispatch(sendOtpSuccess(response.data.message));
        } catch (error) {
            dispatch(sendOtpFailure(error.response?.data?.error || 'Failed to send OTP'));
        }
    }
);

// Action to verify OTP
// export const verifyOtp = createAsyncThunk(
//     'auth/verifyOtp',
//     async ({ input, otp }, { dispatch }) => {
//         console.log("input",input,otp)
//         try {
//             dispatch(verifyOtpRequest());
//             const response = await axios.post('/api/v1/verify-otp', { input, otp });
//             console.log("response",response)
//             dispatch(verifyOtpSuccess(response.data));

//         } catch (error) {
//             dispatch(verifyOtpFailure(error.response?.data?.error || 'Failed to verify OTP'));
//         }
//     }
// );


export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ input, otp }, { dispatch }) => {
        try {
            // Dispatch the initial request action
            dispatch(verifyOtpRequest());

            // Sending OTP verification request to the backend
            const  { data } = await axios.post('/api/v1/verify-otp', { input, otp });
            console.log("response", data); // Log the response

            // Dispatch the success action
            dispatch(verifyOtpSuccess(data));
            
            // return data;  // Return the response data to be used in the component
        } catch (error) {
            // Dispatch failure action if an error occurs
            const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
            dispatch(verifyOtpFailure(errorMessage));

            // Throw the error to be caught in the component
            throw new Error(errorMessage);
        }
    }
);
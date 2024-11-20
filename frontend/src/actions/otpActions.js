import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
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
} from '../slices/otpSlice';


//mail otp request
// export const sendMailOtp = createAsyncThunk('sendotp/mail', async ({email},{dispatch}) => {

//     try {  
//         console.log(email)
//         dispatch(mailOtpRequest()) 
//         const config = {
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             withCredentials: true,
//         }
//         let link = `/api/v1/generateOTP/mail/`;
//         const { data }  =  await axios.post(link,{ email: email }, config);
//         // console.log(data);
//         dispatch(mailOtpSuccess(data))
//     } catch (error) {
//         dispatch(mailOtpFail(error.response.data.message))
//     }
    
// })

export const sendMailOtp = createAsyncThunk('post/register/dummy', async (userData,{dispatch}) => {
    try {
       
              dispatch(mailOtpRequest());
           
              const config = {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            }
              const {data} = await axios.post(`/api/v1/generateOTP/mail/`, userData, config);
              console.log(data);
              dispatch(mailOtpSuccess(data));
        } catch (error) {
              dispatch(mailOtpFail(error.response.data.message));
        }
           
  })


// verify mailotp 
export const verifyMailOtp = createAsyncThunk('verifyotp/mail', async ({email,otp,otpdata},{dispatch}) => {

    try {  
        dispatch(mailVerifyRequest()) 
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
            withCredentials: true,
        }
        let link = `/api/v1/verifyOTP/mail/`;
        const { data }  =  await axios.post(link,{ email: email ,hashedOTP:otp,otpdata:otpdata }, config);
        console.log("verified data",data);
        dispatch(mailVerifySuccess(data))
    } catch (error) {
        dispatch(mailVerifyFail(error.response.data.message))
    }
    
})

//send mobile otp
export const sendMObileOtp = createAsyncThunk('sendotp/mobile', async ({mobileNumber},{dispatch}) => {

    try {  
        dispatch(mobileOtpRequest()) 
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
            withCredentials: true,
        }
        let link =`/api/v1/generateOTP/mobile/`;
        const { data }  =  await axios.post(link,{ mobileNumber: mobileNumber }, config);
        dispatch(mobileOtpSuccess(data))
    } catch (error) {
        dispatch(mobileOtpFail(error.response.data.message))
    }
    
})

//verify mobile otp 
export const verifyMobileOtp = createAsyncThunk('verifyotp/mobile', async ({mobileNumber,otp},{dispatch}) => {

    try {  
        console.log(mobileNumber)
        console.log(otp)
        dispatch(mobileVerifyRequest()) 
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
            withCredentials: true,
        }
        let link = `/api/v1/verifyOTP/mobile/`;
        const { data }  =  await axios.post(link,{ mobileNumber: mobileNumber ,hashedOTP:otp }, config);
        console.log(data);
        dispatch(mobileVerifySuccess(data))
    } catch (error) {
        dispatch(mobileVerifyFail(error.response.data.message))
    }
    
})
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { deleteEnquiryFail, deleteEnquiryRequest, deleteEnquirySuccess, getEnquiryFail, getEnquiryRequest, getEnquirySuccess, postEnquiryFail, postEnquiryRequest, postEnquirySuccess } from '../slices/enquirySlice';



export const postEnquiryDetails = createAsyncThunk('post/postenquiry', async (formData, { dispatch }) => {
    // console.log(formData)
    try {
              dispatch(postEnquiryRequest());
            //   console.log(formData)
              const {data} = await axios.post(`/api/v1/enquiry`, formData);
              console.log(data)
              dispatch(postEnquirySuccess(data));
        } catch (error) {
              dispatch(postEnquiryFail(error.response.data.message));
            
        }
          
        
  })

  export const getEnquiryDetails = createAsyncThunk('get/getenquiry', async (_, { dispatch }) => {
    // console.log(formData)
    try {
              dispatch(getEnquiryRequest());
            //   console.log(formData)
              const {data} = await axios.get(`/api/v1/getenquiry`);
              console.log(data)
              dispatch(getEnquirySuccess(data));
        } catch (error) {
              dispatch(getEnquiryFail(error.response.data.message));
            
        }
          
        
  })

  export const deleteEnquiryDetails = createAsyncThunk('delete/deleteenquiry', async ({ id }, { dispatch }) => {

    try {
      dispatch(deleteEnquiryRequest())
      await axios.delete(`/api/v1/enquiry/${id}`);
      dispatch(deleteEnquirySuccess())
    } catch (error) {
      //handle error
      dispatch(deleteEnquiryFail(error.response.data.message))
    }
  })

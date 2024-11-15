import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { productFail, productRequest, productSuccess } from "../slices/productSlice";



export const getProduct = createAsyncThunk('get/getproduct', async (id,{dispatch}) => {
      console.log("id",id)
    try {
              dispatch(productRequest());
              const {data} = await axios.get(`/api/v1/product/${id}`);
              dispatch(productSuccess(data));
        } catch (error) {
              dispatch(productFail(error.response.data.message));
            
        }
          
        
  })

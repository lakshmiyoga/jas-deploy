import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addressPostRequest ,addressPostSuccess, addressPostFail ,addressGetRequest ,addressGetSuccess, addressGetFail, addressDeleteRequest, addressDeleteSuccess, addressDeleteFail,addressDefaultRequest, addressDefaultSuccess, addressDefaultFail, addressUpdateRequest, addressUpdateSuccess, addressUpdateFail  } from '../slices/AddressSlice';


export const postAddress = createAsyncThunk('address/post', async ( {userId, addressData } , { dispatch }) => {
    try {
      dispatch(addressPostRequest());
      const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
      const {data} = await axios.post(`/api/v1/user/${userId}/address`, addressData);
      console.log("post address response",data)
      dispatch(addressPostSuccess(data));
    } catch (error) {
      dispatch(addressPostFail(error.response.data.message));
    }
  });

//   getUserAddresses

  export const getUserAddresses = createAsyncThunk('address/get', async ( {userId } , { dispatch }) => {
    try {
      dispatch(addressGetRequest());
      const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
      const {data} = await axios.get(`/api/v1/user/${userId}/address`);
      console.log("post address response",data)
      dispatch(addressGetSuccess(data));
    } catch (error) {
      dispatch(addressGetFail(error.response.data.message));
    }
  });

//   delete specific address 
export const deleteAddress = createAsyncThunk('address/delete', async ({ userId, addressId }, { dispatch }) => {
    try {
        dispatch(addressDeleteRequest());
        const {data} = await axios.delete(`/api/v1/user/${userId}/address/${addressId}`);
        dispatch(addressDeleteSuccess(data));
    } catch (error) {
        dispatch(addressDeleteFail(error.response.data.message));
    }
});

//set as default address

export const setDefaultAddress  = createAsyncThunk('address/setdefault', async ({ userId, addressId }, { dispatch }) => {
    try {
        dispatch(addressDefaultRequest());
        const { data } = await axios.put(`/api/v1/user/${userId}/address/${addressId}/default`);
        dispatch(addressDefaultSuccess(data));
    } catch (error) {
        dispatch(addressDefaultFail(error.response.data.message));
    }
});

// update address
export const updateAddress = createAsyncThunk('address/update', async ({ userId, addressId, addressData }, { dispatch }) => {
    try {
        dispatch(addressUpdateRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        const { data } = await axios.put(`/api/v1/user/${userId}/address/${addressId}`, addressData, config);
        dispatch(addressUpdateSuccess(data));
    } catch (error) {
        dispatch(addressUpdateFail(error.response.data.message));
    }
});

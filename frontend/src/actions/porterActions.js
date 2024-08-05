import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    porterRequest,
    porterSuccess,
    porterFail,
    porterOrderResponseRequest,
    porterOrderResponseSuccess,
    porterOrderResponseFail,
    porterCancelRequest,
    porterCancelSuccess,
    porterCancelFail,
    porterRemoveRequest,
    porterRemoveSuccess,
    porterRemoveFail,

} from '../slices/porterSlice';


export const getporterOrder = createAsyncThunk('init/order/create', async ({order_id}, { dispatch }) => {
    try {
        console.log("request_id",order_id)
      dispatch(porterRequest());
      const { data } = await axios.post('/api/v1/admin/porter/orders', {order_id},{withCredentials: true });
      console.log("data",data)
      dispatch(porterSuccess(data));
    } catch (error) {
      dispatch(porterFail(error.response.data.message));
    }
  });

  export const createPorterOrderResponse = createAsyncThunk('/order/createResponse', async ({order_id,porterOrder_id}, { dispatch }) => {
    try {
        console.log("request_id",order_id,porterOrder_id)
      dispatch(porterOrderResponseRequest());
      const { data } = await axios.post('/api/v1/admin/porter/createResponse', {order_id,porterOrder_id},{withCredentials: true });
      console.log("porterResponse",data)
      dispatch(porterOrderResponseSuccess(data));
    } catch (error) {
      dispatch(porterOrderResponseFail(error.response.data.message));
    }
  });

  export const CancelOrderResponse = createAsyncThunk('/order/cancelResponse', async ({order_id,porterOrder_id}, { dispatch }) => {
    try {
        // console.log("request_id",order_id,porterOrder_id)
      dispatch(porterCancelRequest());
      const { data } = await axios.post('/api/v1/admin/porter/cancelOrder', {order_id,porterOrder_id},{withCredentials: true });
      // console.log("cancelresponseData",data)
      dispatch(porterCancelSuccess(data));
    } catch (error) {
      dispatch(porterCancelFail(error.response.data.message));
    }
  });

  export const RemoveOrderResponse = createAsyncThunk('/order/cancelResponse', async ({order_id,removalReason}, { dispatch }) => {
    try {
        console.log("request_id",order_id,removalReason)
      dispatch(porterRemoveRequest());
      const { data } = await axios.post('/api/v1/admin/removeOrder', {order_id, removalReason},{withCredentials: true });
      console.log("removeresponseData",data)
      dispatch(porterRemoveSuccess(data));
    } catch (error) {
      dispatch(porterRemoveFail(error.response.data.message));
    }
  });


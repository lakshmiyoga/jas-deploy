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
    packedOrderRequest,
    packedOrderSuccess,
    packedOrderFail,
    getpackedOrderRequest,
    getpackedOrderSuccess,
    getpackedOrderFail,
    allpackedOrderRequest,
    allpackedOrderSuccess,
    allpackedOrderFail,
    refundRequest,
    refundSuccess,
    refundFail,
    updatepackedOrderRequest,
    updatepackedOrderSuccess,
    updatepackedOrderFail,

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

  export const packedOrder = createAsyncThunk('/order/postpackedOrderResponse', async ({reqPackedData}, { dispatch }) => {
    try {
        console.log("reqPackedData",reqPackedData)
      dispatch(packedOrderRequest());
      const { data } = await axios.post('/api/v1/admin/packedOrder', reqPackedData,{withCredentials: true });
      console.log("postpackedresponseData",data)
      dispatch(packedOrderSuccess(data));
    } catch (error) {
      dispatch(packedOrderFail(error.response.data.message));
    }
  });

  export const getPackedOrder = createAsyncThunk('/order/getpackedOrderResponse', async ({order_id}, { dispatch }) => {
    try {
        console.log("order_id",order_id)
      dispatch(getpackedOrderRequest());
      const { data } = await axios.post('/api/v1/admin/getPackedOrder', {order_id} ,{withCredentials: true });
      console.log("getpackedresponseData",data)
      dispatch(getpackedOrderSuccess(data));
    } catch (error) {
      dispatch(getpackedOrderFail(error.response.data.message));
    }
  });


  export const allPackedOrder = createAsyncThunk('/order/allpackedOrderResponse', async ({}, { dispatch }) => {
    try {
        // console.log("order_id",order_id)
      dispatch(allpackedOrderRequest());
      const { data } = await axios.get('/api/v1/admin/PackedOrder/all',{withCredentials: true });
      console.log("allpackedresponseData",data)
      dispatch(allpackedOrderSuccess(data));
    } catch (error) {
      dispatch(allpackedOrderFail(error.response.data.message));
    }
  });

  export const updatedPackedOrder = createAsyncThunk('/order/allpackedOrderResponse', async ({}, { dispatch }) => {
    try {
        // console.log("order_id",order_id)
      dispatch(updatepackedOrderRequest());
      const { data } = await axios.get('/api/v1/admin/PackedOrder/all',{withCredentials: true });
      console.log("allpackedresponseData",data)
      dispatch(updatepackedOrderSuccess(data));
    } catch (error) {
      dispatch(updatepackedOrderFail(error.response.data.message));
    }
  });

  export const initRefund = createAsyncThunk('/order/initRefund', async ({order_id,RefundableAmount }, { dispatch }) => {
    try {
        console.log("order_id",order_id,RefundableAmount)
      dispatch(refundRequest());
      const { data } = await axios.post('/api/v1/admin/refund', {order_id,RefundableAmount} ,{withCredentials: true });
      console.log("refundData",data)
      dispatch(refundSuccess(data));
    } catch (error) {
      dispatch(refundFail(error.response.data.message));
    }
  });



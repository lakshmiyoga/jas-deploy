import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    orderFail,
    orderSuccess,
    orderRequest,
  adminOrdersRequest,
  adminOrdersSuccess,
  adminOrdersFail,
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFail,
  orderDetailRequest,
  orderDetailSuccess,
  orderDetailFail,
  updateOrderRequest,
  updateOrderSuccess,
  updateOrderFail,
  porterOrderRequest,
  porterOrderSuccess,
  porterOrderFail,
  userOrdersRequest,
  userOrdersSuccess,
  userOrdersFail,
  orderSummaryRequest,
  orderSummarySuccess,
  userSummaryRequest,
  userSummaryFail,
  userSummarySuccess,
  adminOrderRemoveRequest,
  adminOrderRemoveSuccess,
  adminOrderRemoveFail,
  updateadminOrdersRequest,
  updateadminOrdersSuccess,
  updateadminOrdersFail,
} from '../slices/orderSlice';


export const initOrder = createAsyncThunk('init/order/create', async (order, { dispatch }) => {
    try {
        // console.log(order)
      dispatch(orderRequest());
      const { data } = await axios.post('/api/v1/payment/orders', order);
    //   console.log(data)
      dispatch(orderSuccess(data));
    } catch (error) {
      dispatch(orderFail(error.response.data.message));
    }
  });

export const createOrder = createAsyncThunk('order/create', async (order, { dispatch }) => {
    // console.log(order);
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post('/api/v1/order/new', order);
    console.log(data)
    dispatch(createOrderSuccess(data));
  } catch (error) {
    dispatch(createOrderFail(error.response.data.message));
  }
});

export const userOrders = createAsyncThunk('order/userOrders', async (_, { dispatch }) => {
  try {
    dispatch(userOrdersRequest());
    const { data } = await axios.get('/api/v1/myorders');
    // console.log(data)
    dispatch(userOrdersSuccess(data));
  } catch (error) {
    dispatch(userOrdersFail(error.response.data.message));
  }
});



export const orderDetail = createAsyncThunk('order/orderDetail', async (id, { dispatch }) => {
  try {
    dispatch(orderDetailRequest());
    const { data } = await axios.get(`/api/v1/order/${id}`);
    console.log(data)
    dispatch(orderDetailSuccess(data));  
  } catch (error) {
    dispatch(orderDetailFail(error.response.data.message));
  }
});

export const adminOrders = createAsyncThunk('order/adminOrders', async (_, { dispatch }) => {
  try {
    dispatch(adminOrdersRequest());
    const { data } = await axios.get('/api/v1/admin/orders',{ withCredentials: true })
    // console.log(data)
    dispatch(adminOrdersSuccess(data));
  } catch (error) {
    dispatch(adminOrdersFail(error.response.data.message));
  }
});

export const updateadminOrders = createAsyncThunk('order/adminOrders', async (_, { dispatch }) => {
  try {
    dispatch(updateadminOrdersRequest());
    const { data } = await axios.get('/api/v1/admin/orders',{ withCredentials: true })
    console.log(data)
    dispatch(updateadminOrdersSuccess(data));
  } catch (error) {
    dispatch(updateadminOrdersFail(error.response.data.message));
  }
});

export const deleteOrder = createAsyncThunk('order/delete', async (id, { dispatch }) => {
  try {
    dispatch(deleteOrderRequest());
    await axios.delete(`/api/v1/admin/order/${id}`,{ withCredentials: true });
    dispatch(deleteOrderSuccess());
  } catch (error) {
    dispatch(deleteOrderFail(error.response.data.message));
  }
});

export const porterOrder = createAsyncThunk('order/porter', async ({  reqPorterData }, { dispatch }) => {
  // console.log(id)
  try {
    dispatch(porterOrderRequest());
    const { data } = await axios.post(`/api/v1/admin/porter/create/orders`, reqPorterData, {withCredentials: true } );
    // console.log(data.porterOrder)
    dispatch(porterOrderSuccess(data));
  } catch (error) {
    // console.log(error)
    dispatch(porterOrderFail(error.response.data.message));
  }
});


export const updateOrder = createAsyncThunk('order/update', async ({ id, orderData }, { dispatch }) => {
  console.log("orderStatus",orderData)
  try {
    dispatch(updateOrderRequest());
    const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData, { withCredentials: true });
    dispatch(updateOrderSuccess(data));
  } catch (error) {
    dispatch(updateOrderFail(error.response.data.message));
  }
});

export const fetchOrderSummary = createAsyncThunk ('ordersummary/get', async (date,{dispatch}) => {
  try {
    dispatch(orderSummaryRequest());

    const  {data}  = await axios.get(`/api/v1/admin/orders-summary?date=${date}`,{ withCredentials: true });
    console.log('Order Summary Data:', data.orderSummary); 
    dispatch(orderSummarySuccess(data.orderSummary));
  } catch (error) {
    dispatch(orderSummarySuccess());
  }
});


export const fetchUserSummary = createAsyncThunk ('usersummary/get', async (date,{dispatch}) => {
  try {
    dispatch(userSummaryRequest());

    const  {data}  = await axios.get(`/api/v1/admin/user-summary?date=${date}`,{ withCredentials: true });
    console.log('Order Summary Data:', data.userSummary); 
    dispatch(userSummarySuccess(data.userSummary));
  } catch (error) {
    dispatch(userSummaryFail());
  }
});

export const RemoveOrderResponse = createAsyncThunk('/order/cancelResponse', async ({order_id,removalReason}, { dispatch }) => {
  try {
      console.log("request_id",order_id,removalReason)
    dispatch(adminOrderRemoveRequest());
    const { data } = await axios.post('/api/v1/admin/removeOrder', {order_id, removalReason},{withCredentials: true });
    console.log("removeresponseData",data)
    dispatch(adminOrderRemoveSuccess(data));
  } catch (error) {
    dispatch(adminOrderRemoveFail(error.response.data.message));
  }
});
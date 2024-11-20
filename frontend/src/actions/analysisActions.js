import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { analysisFail, analysisRequest, analysisSuccess } from '../slices/analysisSlice';


export const analysisOrders = createAsyncThunk('order/adminOrders', async ({ startDate, endDate }, { dispatch }) => {
    try {
      dispatch(analysisRequest());
      const { data } = await axios.get('/api/v1/admin/orders/analysis', {
        params: { startDate, endDate },
        withCredentials: true
      });
      dispatch(analysisSuccess(data));
    } catch (error) {
      dispatch(analysisFail(error.response.data.message));
    }
  });

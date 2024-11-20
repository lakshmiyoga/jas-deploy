// categoryActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { measurementDeleteFail, measurementDeleteRequest, measurementDeleteSuccess, measurementGetFail, measurementGetRequest, measurementGetSuccess, measurementPostFail, measurementPostRequest, measurementPostSuccess, measurementSingleFail, measurementSingleRequest, measurementSingleSuccess, measurementUpdateFail, measurementUpdateRequest, measurementUpdateSuccess } from "../slices/measurementSlice";

// Create a new measurement
export const createMeasurement = createAsyncThunk('measurement/createMeasurement', async (measurementData, { dispatch }) => {
    
  try {
    dispatch(measurementPostRequest());
    console.log("measurementData",measurementData)
    const { data } = await axios.post('/api/v1/measurement/create', measurementData,{ headers: {'Content-Type': 'application/json', } });
    dispatch(measurementPostSuccess(data.newMeasurement));
  } catch (error) {
    dispatch(measurementPostFail(error.response?.data?.message || 'Error creating measurement'));
  }
});

// Get all measurements
export const getMeasurements = createAsyncThunk('measurement/getmeasurements', async (_, { dispatch }) => {
  try {
    dispatch(measurementGetRequest());
    const { data } = await axios.get('/api/v1/measurement');
    dispatch(measurementGetSuccess(data.measurements));
  } catch (error) {
    dispatch(measurementGetFail(error.response?.data?.message || 'Error fetching measurements'));
  }
});

// Update a measurement
export const updateMeasurement = createAsyncThunk('measurement/updatemeasurement', async ({ id, formData }, { dispatch }) => {
    console.log("measurement",formData)
  try {
    dispatch(measurementUpdateRequest());
    const { data } = await axios.put(`/api/v1/measurement/${id}`, formData,{ headers: {'Content-Type': 'application/json', } });
    console.log("measurement",formData)
    dispatch(measurementUpdateSuccess(data.measurement));
  } catch (error) {
    dispatch(measurementUpdateFail(error.response?.data?.message || 'Error updating measurement'));
  }
});

// Delete a measurement
export const deleteMeasurement = createAsyncThunk('measurement/deletemeasurement', async ({id}, { dispatch }) => {
    console.log("id",id)
  try {
    dispatch(measurementDeleteRequest());
    await axios.delete(`/api/v1/measurement/${id}`);
    dispatch(measurementDeleteSuccess(id));
  } catch (error) {
    dispatch(measurementDeleteFail(error.response?.data?.message || 'Error deleting measurement'));
  }
});

//get single measurement

export const getSingleMeasurement = createAsyncThunk('get/getSinglemeasurement', async (id,{dispatch}) => {
    console.log("id",id)
    try {
              dispatch(measurementSingleRequest());
              const {data} = await axios.get(`/api/v1/measurement/${id}`);
              dispatch(measurementSingleSuccess(data));
        } catch (error) {
              dispatch(measurementSingleFail(error.response.data.message));
            
        }
          
        
  })

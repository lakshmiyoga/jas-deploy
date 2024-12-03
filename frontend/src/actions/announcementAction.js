import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { announcementDeleteFail, announcementDeleteRequest, announcementDeleteSuccess, announcementGetFail, announcementGetRequest, announcementGetSuccess, announcementPostFail, announcementPostRequest, announcementPostSuccess, announcementSingleFail, announcementSingleRequest, announcementSingleSuccess, announcementUpdateFail, announcementUpdateRequest, announcementUpdateSuccess } from "../slices/announcementSlice";

// Create a new category
export const createAnnouncement = createAsyncThunk('announcement/createAnnouncement', async (formData, { dispatch }) => {
  try {
    dispatch(announcementPostRequest());
    const { data } = await axios.post('/api/v1/announcement/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    dispatch(announcementPostSuccess(data.newAnnouncement));
  } catch (error) {
    dispatch(announcementPostFail(error.response?.data?.message || 'Error creating announcement'));
  }
});

// Get all announcement
export const getAnnouncements = createAsyncThunk('announcement/getAnnouncements', async (_, { dispatch }) => {
  try {
    dispatch(announcementGetRequest());
    const { data } = await axios.get('/api/v1/announcement');
    dispatch(announcementGetSuccess(data.announcement));
  } catch (error) {
    dispatch(announcementGetFail(error.response?.data?.message || 'Error fetching announcement'));
  }
});

// Update a announcement
export const updateAnnouncement = createAsyncThunk('announcement/updateAnnouncement', async ({ id, formDataToSend }, { dispatch }) => {
    console.log("formDataToSend",formDataToSend)
  try {
    dispatch(announcementUpdateRequest());
    const { data } = await axios.put(`/api/v1/announcement/${id}`, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.log("formDataToSend",formDataToSend)
    dispatch(announcementUpdateSuccess(data.announcement));
  } catch (error) {
    dispatch(announcementUpdateFail(error.response?.data?.message || 'Error updating announcement'));
  }
});

// Delete a announcement
export const deleteAnnouncements = createAsyncThunk('announcement/deleteAnnouncement', async ({id}, { dispatch }) => {
    console.log("id",id)
  try {
    dispatch(announcementDeleteRequest());
    await axios.delete(`/api/v1/announcement/${id}`);
    dispatch(announcementDeleteSuccess(id));
  } catch (error) {
    dispatch(announcementDeleteFail(error.response?.data?.message || 'Error deleting announcement'));
  }
});

//get single Announcement

export const getSingleAnnouncement = createAsyncThunk('get/getSingleAnnouncement', async (id,{dispatch}) => {
    console.log("id",id)
    try {
              dispatch(announcementSingleRequest());
              const {data} = await axios.get(`/api/v1/announcement/${id}`);
              dispatch(announcementSingleSuccess(data));
        } catch (error) {
              dispatch(announcementSingleFail(error.response.data.message));
            
        }
          
        
  })
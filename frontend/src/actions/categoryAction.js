// categoryActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  categoryPostRequest,
  categoryPostSuccess,
  categoryPostFail,
  categoryGetRequest,
  categoryGetSuccess,
  categoryGetFail,
  categoryDeleteRequest,
  categoryDeleteSuccess,
  categoryDeleteFail,
  categoryUpdateRequest,
  categoryUpdateSuccess,
  categoryUpdateFail,
  categorySingleRequest,
  categorySingleSuccess,
  categorySingleFail,
} from "../slices/categorySlice";

// Create a new category
export const createCategory = createAsyncThunk('category/createCategory', async (formData, { dispatch }) => {
  try {
    dispatch(categoryPostRequest());
    const { data } = await axios.post('/api/v1/category/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    dispatch(categoryPostSuccess(data.newCategory));
  } catch (error) {
    dispatch(categoryPostFail(error.response?.data?.message || 'Error creating category'));
  }
});

// Get all categories
export const getCategories = createAsyncThunk('category/getCategories', async (_, { dispatch }) => {
  try {
    dispatch(categoryGetRequest());
    const { data } = await axios.get('/api/v1/category');
    dispatch(categoryGetSuccess(data.categories));
  } catch (error) {
    dispatch(categoryGetFail(error.response?.data?.message || 'Error fetching categories'));
  }
});

// Update a category
export const updateCategory = createAsyncThunk('category/updateCategory', async ({ id, formDataToSend }, { dispatch }) => {
    console.log("formDataToSend",formDataToSend)
  try {
    dispatch(categoryUpdateRequest());
    const { data } = await axios.put(`/api/v1/category/${id}`, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.log("formDataToSend",formDataToSend)
    dispatch(categoryUpdateSuccess(data.category));
  } catch (error) {
    dispatch(categoryUpdateFail(error.response?.data?.message || 'Error updating category'));
  }
});

// Delete a category
export const deleteCategory = createAsyncThunk('category/deleteCategory', async ({id}, { dispatch }) => {
    console.log("id",id)
  try {
    dispatch(categoryDeleteRequest());
    await axios.delete(`/api/v1/category/${id}`);
    dispatch(categoryDeleteSuccess(id));
  } catch (error) {
    dispatch(categoryDeleteFail(error.response?.data?.message || 'Error deleting category'));
  }
});

//get single category

export const getSingleCategory = createAsyncThunk('get/getSingleCategory', async (id,{dispatch}) => {
    console.log("id",id)
    try {
              dispatch(categorySingleRequest());
              const {data} = await axios.get(`/api/v1/category/${id}`);
              dispatch(categorySingleSuccess(data));
        } catch (error) {
              dispatch(categorySingleFail(error.response.data.message));
            
        }
          
        
  })

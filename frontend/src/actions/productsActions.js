import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  productsFail,
  productsRequest,
  productsSuccess,
  adminProductsFail,
  adminProductsRequest,
  adminProductsSuccess,
} from "../slices/productsSlice";
import { newProductRequest, newProductFail, newProductSuccess, deleteProductRequest, deleteProductSuccess, deleteProductFail, updateProductRequest, updateProductFail, updateProductSuccess } from "../slices/productSlice"



export const getProducts = createAsyncThunk('get/getproducts', async (_, { dispatch }) => {

  try {
    dispatch(productsRequest());
    let link = '/api/v1/getproducts'

    // if (keyword) {
    //   link += `?keyword=${encodeURIComponent(keyword)}`
    //   // link += `&keyword=${keyword}`
    // }
    // if(category) {
    //   link += `?category=${encodeURIComponent(category)}`
    //   // link += `&category=${category}`
    // }
    // if (keyword && category) {
    //   // Both keyword and category are present
    //   link += `?category=${encodeURIComponent(category)}`;
    // } else if (!keyword && category) {
    //   // Only category is present
    //   link += `?category=${encodeURIComponent(category)}`;
    // }

  //   if (keyword || category) {
  //     link += '?';
  
  //     if (keyword && category) {
  //         link += `category=${encodeURIComponent(category)}`;
  //     } else if (keyword) {
  //         link += `keyword=${encodeURIComponent(keyword)}`;
  //     } else if (category) {
  //         link += `category=${encodeURIComponent(category)}`;
  //     }
  // }
    const { data } = await axios.get(link);
    console.log(data)
    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFail(error.response.data.message));

  }
})

export const getAdminProducts = createAsyncThunk('get/admingetproducts', async (_, { dispatch }) => {

  try {
    dispatch(adminProductsRequest())
    const { data } = await axios.get(`/api/v1/admin/products`);
    dispatch(adminProductsSuccess(data))
  } catch (error) {
    //handle error
    dispatch(adminProductsFail(error.response.data.message))
  }

})

export const createNewProduct = createAsyncThunk('post/adminCreateproducts', async (productData, { dispatch }) => {

  try {
    dispatch(newProductRequest())
    const { data } = await axios.post(`/api/v1/admin/product/new`, productData);
    dispatch(newProductSuccess(data))
  } catch (error) {
    //handle error
    dispatch(newProductFail(error.response.data.message))
  }

})

export const deleteProduct = createAsyncThunk('delete/adminDeleteproducts', async ({ id }, { dispatch }) => {

  try {
    dispatch(deleteProductRequest())
    await axios.delete(`/api/v1/admin/product/${id}`);
    dispatch(deleteProductSuccess())
  } catch (error) {
    //handle error
    dispatch(deleteProductFail(error.response.data.message))
  }
})

export const updateProduct = createAsyncThunk('update/adminUpdateproducts', async ({ id, formDataToSend }, { dispatch }) => {

  try {
    dispatch(updateProductRequest())
    const config = {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }

    const { data } = await axios.put(`/api/v1/admin/product/${id}`, formDataToSend, config);
    dispatch(updateProductSuccess(data))
  } catch (error) {
    //handle error
    dispatch(updateProductFail(error.response.data.message))
  }
})



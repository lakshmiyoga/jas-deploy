import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginFail,
    loginRequest, 
    loginSuccess, 
    clearError,
    registerFail,
    registerRequest,
    registerSuccess,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail, 
    logoutSuccess, 
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    logoutRequest} from "../slices/authSlice";


    import {
      usersRequest,
      usersSuccess,
      usersFail,
      userRequest,
      userSuccess,
      userFail,
      deleteUserRequest,
      deleteUserSuccess,
      deleteUserFail,
      updateUserRequest,
      updateUserSuccess,
      updateUserFail
  
  } from '../slices/userSlice'
 



export const login = createAsyncThunk('post/login', async ({email,password},{dispatch}) => {
  // console.log(email,password)
    try {
       
              dispatch(loginRequest());
              const {data} = await axios.post(`/api/v1/login`, {email, password});
              console.log(data);
              dispatch(loginSuccess(data));
        } catch (error) {
              dispatch(loginFail(error.response.data.message));
        }
           
  })

  export const clearAuthError = dispatch =>{
    dispatch(clearError())
  }

  export const register = createAsyncThunk('post/register', async (userData,{dispatch}) => {
    try {
       
              dispatch(registerRequest());
              // console.log(userData)
              const config = {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            }
              const {data} = await axios.post(`/api/v1/register`, userData, config);
              console.log(data);
              dispatch(registerSuccess(data));
        } catch (error) {
              dispatch(registerFail(error.response.data.message));
        }
           
  })

  export const loadUser = createAsyncThunk ('get/loadUser', async (_, { dispatch }) => {

    try {
        dispatch(loadUserRequest())
        const { data }  = await axios.get(`/api/v1/myProfile`);
        // console.log(data)
        dispatch(loadUserSuccess(data))
        
    } catch (error) {
        dispatch(loadUserFail(error.response.data.message))
    }

})

export const logout =  async (dispatch) => {

  try {
      dispatch(logoutRequest())
      await axios.get(`/api/v1/logout`);
      // sessionStorage.removeItem('redirectPath');
      dispatch(logoutSuccess())
  } catch (error) {
      dispatch(logoutFail())
  }

}

export const updateProfile = createAsyncThunk('put/updateProfile', async (userData,{dispatch}) => {
  try {
     
            dispatch(updateProfileRequest());

            const config = {
              headers: {
                  'Content-type': 'multipart/form-data'
              }
          }
            const {data} = await axios.put(`/api/v1/update`, userData, config);
            console.log(data);
            dispatch(updateProfileSuccess(data));
      } catch (error) {
            dispatch(updateProfileFail(error.response.data.message));
      }
         
})

export const updatePassword = createAsyncThunk('put/updatePassword', async (userData,{dispatch}) => {
  try {
     
            dispatch(updatePasswordRequest());
            const config = {
              headers: {
                  'Content-type': 'application/json'
              }
            }
            await axios.put(`/api/v1//password/change`, userData,config);         
            dispatch(updatePasswordSuccess());
      } catch (error) {
            dispatch(updatePasswordFail(error.response.data.message));
      }
         
})

export const forgotPassword = createAsyncThunk('post/forgotPassword', async(formData,{dispatch}) => {

  try {
      dispatch(forgotPasswordRequest())
      const config = {
          headers: {
              'Content-type': 'application/json'
          }
      }
      const { data} =  await axios.post(`/api/v1/password/forgot`, formData, config);
      dispatch(forgotPasswordSuccess(data))
  } catch (error) {
      dispatch(forgotPasswordFail(error.response.data.message))
  }

})

export const resetPassword = createAsyncThunk('post/resetPassword', async({formData, token},{dispatch}) => {

  try {
      dispatch(resetPasswordRequest())
      const config = {
          headers: {
              'Content-type': 'application/json'
          }
      }
      const { data} =  await axios.post(`/api/v1/password/reset/${token}`, formData, config);
      dispatch(resetPasswordSuccess(data))
  } catch (error) {
      dispatch(resetPasswordFail(error.response.data.message))
  }

})

export const getUsers = createAsyncThunk('get/getUsers', async (_,{dispatch}) => {

  try {
      dispatch(usersRequest())
      const { data }  = await axios.get(`/api/v1/admin/users`);
      dispatch(usersSuccess(data))
  } catch (error) {
      dispatch(usersFail(error.response.data.message))
  }

})

export const getUser = createAsyncThunk('get/getUser', async (id,{dispatch}) => {

  try {
      dispatch(userRequest())
      const { data }  = await axios.get(`/api/v1/admin/user/${id}`);
      dispatch(userSuccess(data))
  } catch (error) {
      dispatch(userFail(error.response.data.message))
  }

})

export const deleteUser = createAsyncThunk('delete/deleteUser', async ({id},{dispatch}) => {

  try {
      dispatch(deleteUserRequest())
      await axios.delete(`/api/v1/admin/user/${id}`);
      dispatch(deleteUserSuccess())
  } catch (error) {
      dispatch(deleteUserFail(error.response.data.message))
  }

})

export const updateUser = createAsyncThunk('update/updateUser', async ({userId, formData},{dispatch}) => {
console.log("id:",userId)
console.log("formData:",formData)
  
  try {
      dispatch(updateUserRequest())
      const config = {
          headers: {
              'Content-type': 'multipart/form-data'
          }
      }
      await axios.put(`/api/v1/admin/user/${userId}`, formData, config);
      dispatch(updateUserSuccess())
  } catch (error) {
      dispatch(updateUserFail(error.response.data.message))
  }

})




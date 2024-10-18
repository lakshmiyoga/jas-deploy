import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        isAuthenticated: false,
        user:null,
        error:null,
    },
    reducers: {
        loginRequest(state, action) {
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
                user:null,
                error:null,
            }
        },
        loginSuccess(state, action) {
            return {
                loading: false,
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        loginFail(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user:null,
                error: action.payload,  
            }
        },
        clearError(state, action) {
            return {
                ...state,
                loading: false,
                error: null,
                // user:null
            }
        },
        registerRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        registerSuccess(state, action) {
            return {
                loading: false,
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        registerFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        loadUserRequest(state, action) {
            return {
                ...state,
                isAuthenticated: false,
                loading: true,
                user:null,
            }
        },
        loadUserSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        loadUserFail(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user:null,
                // error:action.payload
            }
        },
        logoutRequest(state, action) {
            return {
                ...state,
                loading: false,
                // isAuthenticated: false,
                // user:null,
            }
        },
        logoutSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null, 
            }
        },
        logoutFail(state, action) {
            return {
                ...state,
                error: action.payload,
                // isAuthenticated: false,
                // user:null,
            }
        },
        clearUser(state, action) {
            return {
                ...state,
                error: null,
                isAuthenticated: false,
                user: null, 
            }
        },
        updateProfileRequest(state, action) {
            return {
                ...state,
                profileupdateloading: true,
                isUpdated: false
            }
        },
        updateProfileSuccess(state, action) {
            return {
                ...state,
                profileupdateloading: false,
                user: action.payload.user,
                isUpdated: true
            }
        },
        updateProfileFail(state, action) {
            return {
                ...state,
                profileupdateloading: false,
                error: action.payload
            }
        },
        clearUpdateProfile(state, action) {
            return {
                ...state,
                isUpdated: false,
                error:null
            }
        },

        updatePasswordRequest(state, action) {
            return {
                ...state,
                updatepasswordloading: true,
                isUpdated: false
            }
        },
        updatePasswordSuccess(state, action) {
            return {
                ...state,
                updatepasswordloading: false,
                isUpdated: true
            }
        },
        updatePasswordFail(state, action) {
            return {
                ...state,
                updatepasswordloading: false,
                error: action.payload
            }
        },
        clearUpdatePassword(state, action){
            return {
                ...state,
                loading: false,
                isUpdated: false,
                error: null
            }
        },
        forgotPasswordRequest(state, action) {
            return {
                ...state,
                loading: true,
                message: null
            }
        },
        forgotPasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        },
        forgotPasswordFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        resetPasswordRequest(state, action) {
            return {
                ...state,
                resetloading: true,
            }
        },
        resetPasswordSuccess(state, action) {
            return {
                ...state,
                resetloading: false,
                isAuthenticated: true,
                user: action.payload.user
            }
        },
        resetPasswordFail(state, action) {
            return {
                ...state,
                resetloading: false,
                error: action.payload
            }
        },
        clearResetPassword(state,actions){
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: null,
            }
        },


    }

});

const { actions, reducer } = authSlice;

export const { loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileFail,
    updateProfileRequest,
    updateProfileSuccess,
    clearUpdateProfile,
    updatePasswordFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    forgotPasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    clearResetPassword,
    clearUpdatePassword,
    logoutRequest,
    clearUser,
 } = actions;

export default reducer;
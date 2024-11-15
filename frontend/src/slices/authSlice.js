
// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         loading: false,
//         isAuthenticated: false,
//         user: null,
//         error: null,
//         isloggedout: false,
//         loggedoutmessage: null,
//         profileupdateloading: false,
//         isUpdated: false,
//         updatepasswordloading: false,
//         resetloading: false,
//         message: null,
//     },
//     reducers: {
//         loginRequest(state) {
//             state.loading = true;
//             state.isAuthenticated = false;
//             state.user = null;
//             state.error = null;
//         },
//         loginSuccess(state, action) {
//             state.loading = false;
//             state.isAuthenticated = action.payload.success ? action.payload.success : false;
//             state.user = action.payload.user;
//         },
//         loginFail(state, action) {
//             state.loading = false;
//             state.isAuthenticated = false;
//             state.user = null;
//             state.error = action.payload;
//         },
//         clearError(state) {
//             state.loading = false;
//             state.error = null;
//         },
//         registerRequest(state) {
//             state.loading = true;
//         },
//         registerSuccess(state, action) {
//             state.loading = false;
//             state.isAuthenticated = action.payload.success ? action.payload.success : false;
//             state.user = action.payload.user;
//         },
//         registerFail(state, action) {
//             state.loading = false;
//             state.error = action.payload;
//         },
//         loadUserRequest(state) {
//             state.isAuthenticated = false;
//             state.loading = true;
//             state.user = null;
//         },
//         loadUserSuccess(state, action) {
//             state.loading = false;
//             state.isAuthenticated = action.payload.success ? action.payload.success : false;
//             state.user = action.payload.user;
//         },
//         loadUserFail(state) {
//             state.loading = false;
//             state.isAuthenticated = false;
//             state.user = null;
//         },
//         logoutRequest(state) {
//             state.loading = false; // If you want to show a loading state
//         },
//         logoutSuccess(state, action) {
//             state.loading = true;
//             state.isAuthenticated = false;
//             state.isloggedout = action.payload.success ? action.payload.success : false;
//             state.loggedoutmessage = action.payload.message;
//             state.user = null;
//         },
//         logoutFail(state, action) {
//             state.error = action.payload;
//         },
//         clearlogout(state, action) {
//             state.loading = false;
//             state.isAuthenticated = false;
//             state.isloggedout = false;
//             state.loggedoutmessage = null;
//             state.user = null;
//         },
//         clearUser(state) {
//             state.error = null;
//             state.isAuthenticated = false;
//             state.user = null;
//         },
//         updateProfileRequest(state) {
//             state.profileupdateloading = true;
//             state.isUpdated = false;
//         },
//         updateProfileSuccess(state, action) {
//             state.profileupdateloading = false;
//             state.user = action.payload.user;
//             state.isUpdated = true;
//         },
//         updateProfileFail(state, action) {
//             state.profileupdateloading = false;
//             state.error = action.payload;
//         },
//         clearUpdateProfile(state) {
//             state.isUpdated = false;
//             state.error = null;
//         },
//         updatePasswordRequest(state) {
//             state.updatepasswordloading = true;
//             state.isUpdated = false;
//         },
//         updatePasswordSuccess(state) {
//             state.updatepasswordloading = false;
//             state.isUpdated = true;
//         },
//         updatePasswordFail(state, action) {
//             state.updatepasswordloading = false;
//             state.error = action.payload;
//         },
//         clearUpdatePassword(state) {
//             state.loading = false;
//             state.isUpdated = false;
//             state.error = null;
//         },
//         forgotPasswordRequest(state) {
//             state.loading = true;
//             state.message = null;
//         },
//         forgotPasswordSuccess(state, action) {
//             state.loading = false;
//             state.message = action.payload.message;
//         },
//         forgotPasswordFail(state, action) {
//             state.loading = false;
//             state.error = action.payload;
//         },
//         resetPasswordRequest(state) {
//             state.resetloading = true;
//         },
//         resetPasswordSuccess(state, action) {
//             state.resetloading = false;
//             state.isAuthenticated = true;
//             state.user = action.payload.user;
//         },
//         resetPasswordFail(state, action) {
//             state.resetloading = false;
//             state.error = action.payload;
//         },
//         clearResetPassword(state) {
//             state.loading = false;
//             state.isAuthenticated = false;
//             state.user = null;
//             state.error = null;
//         },
//         reset(state) {
//             return {
//                 loading: false,
//                 isAuthenticated: false,
//                 user: null,
//                 error: null,
//                 // Reset other state properties as needed
//             };
//         },
//     }
// });

// const { actions, reducer } = authSlice;

// export const {
//     loginRequest,
//     loginSuccess,
//     loginFail,
//     clearError,
//     registerRequest,
//     registerSuccess,
//     registerFail,
//     loadUserRequest,
//     loadUserSuccess,
//     loadUserFail,
//     logoutSuccess,
//     logoutFail,
//     updateProfileFail,
//     updateProfileRequest,
//     updateProfileSuccess,
//     clearUpdateProfile,
//     updatePasswordFail,
//     updatePasswordRequest,
//     updatePasswordSuccess,
//     forgotPasswordFail,
//     forgotPasswordRequest,
//     forgotPasswordSuccess,
//     resetPasswordFail,
//     resetPasswordRequest,
//     resetPasswordSuccess,
//     clearResetPassword,
//     clearUpdatePassword,
//     logoutRequest,
//     clearUser,
//     clearlogout,
//     reset,

// } = actions;

// export default reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
        isloggedout: false,
        loggedoutmessage: null,
        profileupdateloading: false,
        isUpdated: false,
        updatepasswordloading: false,
        resetloading: false,
        message: null,
        sendLoading:false,
        sendError:null,
        verifyError: null,
        sendMessage:null,
        message: null,
        token: null,
    },
    reducers: {
        sendOtpRequest(state) {
            state.sendLoading = true;
            // state.isAuthenticated = false;
            state.sendError = null;
        },
        sendOtpSuccess(state, action) {
            state.sendLoading = false;
            // state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.sendMessage = action.payload;
        },
        sendOtpFailure(state, action) {
            state.sendLoading = false;
            // state.isAuthenticated = false;
            state.sendError = action.payload;
        },
        clearSendOtp(state, action) {
            state.sendLoading = false;
            // state.isAuthenticated = false;
            state.sendMessage = null;
            state.sendError = null;
        },
        verifyOtpRequest(state) {
            state.verifyLoading = true;
            state.isAuthenticated = false;
            state.user = null;
            state.verifyError = null;
        },
        verifyOtpSuccess(state, action) {
            state.verifyLoading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
            // state.token = action.payload.token;
            state.message = action.payload;
        },
        verifyOtpFailure(state, action) {
            state.verifyLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.verifyError = action.payload;
        },
        clearVerifyError(state) {
            state.verifyError = null;
            state.verifyLoading=false;
            // state.isAuthenticated = false;
            // state.user = null;
        },
        loginRequest(state) {
            state.loading = true;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
        },
        loginFail(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        clearError(state) {
            state.loading = false;
            state.error = null;
        },
        registerRequest(state) {
            state.loading = true;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
        },
        registerFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loadUserRequest(state) {
            state.isAuthenticated = false;
            state.loading = true;
            state.user = null;
        },
        loadUserSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = action.payload.success ? action.payload.success : false;
            state.user = action.payload.user;
        },
        loadUserFail(state) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutRequest(state) {
            state.loading = false; // If you want to show a loading state
        },
        logoutSuccess(state, action) {
            state.loading = true;
            state.isAuthenticated = false;
            state.isloggedout = action.payload.success ? action.payload.success : false;
            state.loggedoutmessage = action.payload.message;
            state.user = null;
        },
        logoutFail(state, action) {
            state.error = action.payload;
        },
        clearlogout(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.isloggedout = false;
            state.loggedoutmessage = null;
            state.user = null;
        },
        clearUser(state) {
            state.error = null;
            state.isAuthenticated = false;
            state.user = null;
        },
        updateProfileRequest(state) {
            state.profileupdateloading = true;
            state.isUpdated = false;
        },
        updateProfileSuccess(state, action) {
            state.profileupdateloading = false;
            state.user = action.payload.user;
            state.isUpdated = true;
        },
        updateProfileFail(state, action) {
            state.profileupdateloading = false;
            state.error = action.payload;
        },
        clearUpdateProfile(state) {
            state.isUpdated = false;
            state.error = null;
        },
        updatePasswordRequest(state) {
            state.updatepasswordloading = true;
            state.isUpdated = false;
        },
        updatePasswordSuccess(state) {
            state.updatepasswordloading = false;
            state.isUpdated = true;
        },
        updatePasswordFail(state, action) {
            state.updatepasswordloading = false;
            state.error = action.payload;
        },
        clearUpdatePassword(state) {
            state.loading = false;
            state.isUpdated = false;
            state.error = null;
        },
        forgotPasswordRequest(state) {
            state.loading = true;
            state.message = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state) {
            state.resetloading = true;
        },
        resetPasswordSuccess(state, action) {
            state.resetloading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        resetPasswordFail(state, action) {
            state.resetloading = false;
            state.error = action.payload;
        },
        clearResetPassword(state) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        reset(state) {
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: null,
                // Reset other state properties as needed
            };
        },
    }
});

const { actions, reducer } = authSlice;

export const {
    loginRequest,
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
    clearlogout,
    reset,
    sendOtpRequest,
    sendOtpSuccess,
    sendOtpFailure,
    verifyOtpRequest,
    verifyOtpSuccess,
    verifyOtpFailure,
    clearVerifyError,
    clearSendOtp,

} = actions;

export default reducer;